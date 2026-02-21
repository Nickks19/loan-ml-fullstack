import { PredictRequest, PredictResponse, DTIRequest, DTIResponse } from "@/types";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function predictLoan(payload: PredictRequest): Promise<PredictResponse> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Prediction failed");
  }

  return res.json();
}

export async function computeDTI(payload: DTIRequest): Promise<DTIResponse> {
  const res = await fetch(`${BASE_URL}/compute-dti`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "DTI computation failed");
  }

  return res.json();
}