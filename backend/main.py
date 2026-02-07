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
이 이미지를 일반적인 장면 설명으로 설명하지 마세요.
사람, 행동, 배경, 사물에 대해 설명하지 마세요.

오직 피부만 분석하세요.
피부가 보이지 않으면 “피부를 감지하지 못했습니다”라고만 출력하세요.

역할:
당신은 피부 관찰 보조 시스템입니다.
의학적 진단, 질병명, 치료, 약물, 행동 제안은 절대 하지 마세요.
보이는 피부의 시각적 특징만 중립적으로 설명하세요.

출력 언어: 한국어
출력 형식: JSON ONLY

출력:
{
  "시각적_관찰": {
    "발적": "없음 | 경미함 | 중간 | 뚜렷함",
    "각질": "없음 | 경미함 | 중간 | 뚜렷함",
    "부기": "없음 | 경미함 | 중간 | 뚜렷함",
    "가려움_징후": "관찰되지 않음 | 가능성 있음 | 이미지로 판단 불가",
    "거칠음": "없음 | 경미함 | 중간 | 뚜렷함"
  },
  "요약": "관찰된 피부 특징에 대한 짧고 중립적인 요약",
  "일반적_설명": "이러한 시각적 특징이 일상적으로 의미하는 바에 대한 비의학적 설명",
  "한계": "이미지 만으로 판단할 수 없는 점",
  "면책문구": "본 내용은 의학적 진단이 아니며 의료진과의 소통을 돕기 위한 참고 자료입니다."
}
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
