# ATOP — Skin Observation Report (Hackathon MVP)

A web app that generates an automatic skin condition report after a user uploads a photo and enters medical information. **Not a medical diagnostic tool** — outputs include a medical disclaimer and provide preliminary visual analysis only.

## Tech Stack

- **Backend:** Python + FastAPI
- **Vision model:** BLIP-2 (Hugging Face) — runs on Mac CPU or MPS, no CUDA
- **Frontend:** Next.js 14 + React + Tailwind CSS
- No paid APIs, no training or fine-tuning

## Features

1. User uploads a skin photo
2. User enters: current medications, symptoms (itching, redness, pain, dryness, etc.), duration of symptoms
3. Backend uses BLIP-2 to extract visual observations and combines them with user inputs into a structured report
4. Frontend displays the final report with disclaimer

## Getting Started (Local)

### 1. Python backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The first run downloads the BLIP-2 model (~10GB for xl). On Mac: uses float16 to halve memory. On CUDA: uses 8-bit quantization if `bitsandbytes` is installed.

### 2. Next.js frontend

```bash
npm install
npm run dev
```

### 3. Use the app

1. Open [http://localhost:3000](http://localhost:3000)
2. Go to **Upload** → add photo, medications, symptoms, duration
3. Click **Generate Report**
4. View the structured report

## Screens

- `/` — Landing page
- `/upload` — Photo upload + medical info
- `/report/[id]` — Observation report

## Report format (JSON)

```json
{
  "summary": "short neutral summary",
  "visual_observations": ["list of visual findings"],
  "user_reported_symptoms": ["list"],
  "current_medications": ["list"],
  "duration_of_symptoms": "string",
  "possible_non_diagnostic_causes": ["examples"],
  "general_advice": ["safe, non-medical advice"],
  "disclaimer": "This is not medical advice..."
}
```

## Environment

- `BACKEND_URL` (optional): Backend base URL, defaults to `http://localhost:8000`
- `BLIP2_MODEL` (optional): BLIP-2 model name, defaults to `Salesforce/blip2-flan-t5-base`
