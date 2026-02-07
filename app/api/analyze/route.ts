/**
 * Proxy to Python FastAPI backend for skin analysis.
 * Backend runs on http://localhost:8000 - forwards request and returns report.
 */

import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const backendUrl = `${BACKEND_URL}/api/analyze`;

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail ?? "Analysis failed" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis request failed";
    return NextResponse.json(
      {
        error: `${message}. Ensure the Python backend is running: cd backend && uvicorn main:app --reload`,
      },
      { status: 502 },
    );
  }
}
