"""
Skin Observation Report - FastAPI Backend
Hackathon MVP: BLIP-2 vision + structured report generation.
NOT a medical diagnostic tool. Output includes medical disclaimer.
"""

import io
import os
from pathlib import Path
from typing import Any

# Load .env from backend folder (for HF_TOKEN, BLIP2_MODEL, etc.)
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Lazy load heavy deps to speed up startup
# Model loaded on first request

app = FastAPI(
    title="Skin Observation Report API",
    description="Preliminary visual analysis - NOT medical diagnosis",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Report schema for response
DISCLAIMER = (
    "This is not medical advice. This report is a preliminary visual analysis "
    "only. Please consult a qualified healthcare provider for any medical concerns."
)


class AnalysisRequest(BaseModel):
    """Request body for analysis (when not using form)."""

    medications: str = ""
    symptoms: str = ""
    duration: str = ""


def get_device() -> tuple[str, bool]:
    """Return (device, use_cuda). MPS on Apple Silicon, CUDA if available, else CPU."""
    try:
        import torch

        if torch.cuda.is_available():
            return "cuda", True
        if torch.backends.mps.is_available():
            return "mps", False
        return "cpu", False
    except Exception:
        return "cpu", False


def load_model():
    """Load BLIP-2 model once. Quantized: 8-bit on CUDA, float16 on Mac (MPS/CPU)."""
    import torch
    from transformers import AutoProcessor, Blip2ForConditionalGeneration

    model_name = os.getenv("BLIP2_MODEL", "Salesforce/blip2-flan-t5-xl")
    token = os.getenv("HF_TOKEN") or os.getenv("HUGGING_FACE_HUB_TOKEN")
    device, use_cuda = get_device()

    processor = AutoProcessor.from_pretrained(model_name, token=token)

    # 8-bit quantization: CUDA only (bitsandbytes), not supported on Mac
    if use_cuda:
        try:
            model = Blip2ForConditionalGeneration.from_pretrained(
                model_name,
                token=token,
                load_in_8bit=True,
                device_map="auto",
            )
            model.eval()
            return processor, model, device
        except Exception:
            pass  # Fall back to float16 if bitsandbytes unavailable

    # Mac (MPS/CPU): float16 halves memory, supported on Apple Silicon
    model = Blip2ForConditionalGeneration.from_pretrained(
        model_name,
        token=token,
        torch_dtype=torch.float16,
    )
    model = model.to(device)
    model.eval()

    return processor, model, device


# Global model cache (loaded on first request)
_model_cache: dict[str, Any] = {}


def get_model():
    if not _model_cache:
        _model_cache["processor"], _model_cache["model"], _model_cache["device"] = load_model()
    return (
        _model_cache["processor"],
        _model_cache["model"],
        _model_cache["device"],
    )


def _prepare_inputs(inputs: dict, device: str, model) -> dict:
    """Move inputs to device; use float16 when model is half-precision (saves memory on Mac)."""
    import torch

    result = {}
    for k, v in inputs.items():
        if isinstance(v, torch.Tensor):
            v = v.to(device)
            if hasattr(model, "dtype") and model.dtype in (torch.float16, torch.bfloat16) and v.is_floating_point():
                v = v.to(model.dtype)
            result[k] = v
        else:
            result[k] = v
    return result


def extract_visual_observations(image_bytes: bytes, processor, model, device: str) -> list[str]:
    """
    Use BLIP-2 to get visual observations from the skin image.
    VQA-style: ask what visible skin features are present.
    """
    import torch
    from PIL import Image

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Single focused prompt for skin observation (BLIP-2 supports conditional generation)
    prompt = """
당신은 피부 관찰 보조 시스템입니다.

당신의 역할은 이미지에서 시각적으로 관찰 가능한 피부의 특징을 주의 깊게 분석하고,
의학적 판단 없이 중립적이고 사실적인 방식으로 요약하는 것입니다.

중요 규칙:
- 의학적 진단을 내려서는 안 됩니다.
- 질병명을 언급해서는 안 됩니다 (예: 습진, 아토피 피부염, 건선 등).
- 치료, 약물, 또는 행동을 제안해서는 안 됩니다.
- 원인을 의학적 사실처럼 해석해서는 안 됩니다.
- 이미지에서 직접적으로 관찰 가능한 내용만 설명해야 합니다.

허용되는 내용:
- 발적, 각질, 부기, 건조함, 거칠음, 자극과 같은 시각적 특징을 설명할 수 있습니다.
- "…처럼 보입니다", "…일 수 있습니다", "시각적으로 확인됩니다"와 같은 신중한 표현을 사용해야 합니다.
- 이러한 피부 특징이 일상적인 맥락에서 일반적으로 무엇을 의미하는지에 대해 비의학적인 수준의 설명을 제공할 수 있습니다.
- 차분하고 중립적이며 안심시키는 톤을 유지해야 합니다.

과업:
제공된 피부 이미지를 분석하고 구조화된 관찰 보고서를 생성하세요.

출력 형식 (JSON ONLY):
{
  "시각적_관찰": {
    "발적": "없음 | 경미함 | 중간 | 뚜렷함",
    "각질": "없음 | 경미함 | 중간 | 뚜렷함",
    "부기": "없음 | 경미함 | 중간 | 뚜렷함",
    "가려움_징후": "관찰되지 않음 | 가능성 있음 | 이미지로 판단 불가",
    "거칠음": "없음 | 경미함 | 중간 | 뚜렷함"
  },
  "요약": "관찰된 피부 특징에 대한 짧고 중립적인 요약",
  "일반적_설명": "이러한 시각적 특징이 일상적인 관점에서 일반적으로 무엇을 의미하는지에 대한 비의학적인 설명",
  "한계": "이미지 만으로는 판단할 수 없는 요소들",
  "면책문구": "이 내용은 의학적 진단이 아닙니다. 본 보고서는 의료 전문가와의 소통을 돕기 위한 참고 자료입니다."
}

규칙:
- 시각적_관찰 항목의 각 값은 다음 중 하나만 선택해야 합니다:
  없음, 경미함, 중간, 뚜렷함
- 가려움_징후 항목은 다음 중 하나만 선택해야 합니다:
  관찰되지 않음, 가능성 있음, 이미지로 판단 불가
- 요약에는 관찰된 피부 특징을 간단하고 중립적으로 작성해야 합니다.
- 일반적_설명에는 의학적 용어를 사용하지 않고 일상적인 의미에서 설명해야 합니다.
- 한계에는 이미지 분석의 한계를 명확히 작성해야 합니다.
- 면책문구에는 이것이 의학적 진단이 아님을 분명히 명시해야 합니다.
- 한국말로 작성해야 합니다.
- 출력 형식 (JSON ONLY)만 출력해야 합니다.
- 사진 속 인물의 피부만 분석하십시오. 피부를 감지하지 못하면 “피부를 감지하지 못했습니다”라고 말하십시오.
"""
    inputs = processor(images=image, text=prompt, return_tensors="pt")
    inputs = _prepare_inputs(inputs, device, model)

    with torch.no_grad():
        out = model.generate(**inputs, max_new_tokens=80)

    caption = processor.decode(out[0], skip_special_tokens=True).strip()
    if caption and caption.lower() not in ("unknown", "n/a", ""):
        observations = [caption]
    else:
        # Fallback: unconditional caption
        inputs = processor(images=image, return_tensors="pt")
        inputs = _prepare_inputs(inputs, device, model)
        with torch.no_grad():
            out = model.generate(**inputs, max_new_tokens=80)
        caption = processor.decode(out[0], skip_special_tokens=True).strip()
        observations = [caption] if caption else []

    if not observations:
        observations = ["Image received. Visual analysis may be limited by image quality or lighting."]

    return observations


def build_report(
    visual_observations: list[str],
    medications: str,
    symptoms: str,
    duration: str,
) -> dict:
    """
    Build structured report from BLIP-2 observations + user inputs.
    Uses cautious, non-diagnostic wording. No treatment advice.
    """
    user_symptoms = [s.strip() for s in symptoms.split(",") if s.strip()]
    if not user_symptoms and symptoms.strip():
        user_symptoms = [symptoms.strip()]

    med_list = [m.strip() for m in medications.split(",") if m.strip()]
    if not med_list and medications.strip():
        med_list = [medications.strip()]

    # Safe, generic possible causes - never diagnostic
    possible_causes = [
        "Environmental factors (dry air, allergens)",
        "Skin barrier changes",
        "Reaction to products or lifestyle factors",
    ]
    if duration:
        possible_causes.append(f"Duration of {duration} - pattern may be consistent with various conditions")

    # General safe advice - never treatment
    general_advice = [
        "Keep the area clean and moisturized.",
        "Avoid known irritants if possible.",
        "Consider tracking symptoms to share with a healthcare provider.",
        "Seek professional evaluation for persistent or worsening symptoms.",
    ]

    summary_parts = []
    if visual_observations:
        summary_parts.append("Visual observations may be consistent with the described areas.")
    if user_symptoms:
        summary_parts.append(f"User-reported symptoms include: {', '.join(user_symptoms[:5])}.")
    if duration:
        summary_parts.append(f"Duration reported: {duration}.")
    if med_list:
        summary_parts.append("Current medications have been noted for provider context.")

    summary = " ".join(summary_parts) if summary_parts else "Preliminary visual analysis completed."

    return {
        "summary": summary,
        "visual_observations": visual_observations,
        "user_reported_symptoms": user_symptoms,
        "current_medications": med_list,
        "duration_of_symptoms": duration,
        "possible_non_diagnostic_causes": possible_causes,
        "general_advice": general_advice,
        "disclaimer": DISCLAIMER,
    }


@app.get("/")
def root():
    return {"status": "ok", "message": "Skin Observation Report API - not medical diagnosis"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/analyze")
async def analyze_skin(
    file: UploadFile = File(...),
    medications: str = Form(""),
    symptoms: str = Form(""),
    duration: str = Form(""),
):
    """
    Upload skin photo + medical info, get structured report.
    NOT medical diagnosis - preliminary visual analysis only.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    try:
        processor, model, device = get_model()
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model loading failed: {str(e)}. Ensure transformers/torch are installed.",
        ) from e

    try:
        visual_observations = extract_visual_observations(image_bytes, processor, model, device)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image analysis failed: {str(e)}",
        ) from e

    report = build_report(visual_observations, medications, symptoms, duration)

    return report


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
