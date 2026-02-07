#!/bin/bash
# Run FastAPI backend for Skin Observation Report
cd "$(dirname "$0")"
python -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt -q
uvicorn main:app --reload --port 8000
