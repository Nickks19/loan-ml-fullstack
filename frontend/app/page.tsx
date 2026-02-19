"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    no_of_dependents: 0,
    education: "Graduate",
    self_employed: "No",
    income_annum: 0,
    loan_amount: 0,
    loan_term: 0,
    cibil_score: 700,
    residential_assets_value: 0,
    commercial_assets_value: 0,
    luxury_assets_value: 0,
    bank_asset_value: 0,
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Loan Approval Predictor</h1>

      {Object.keys(formData).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          type={typeof formData[key as keyof typeof formData] === "number" ? "number" : "text"}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Predict
      </button>

      {result && (
        <div className="mt-4 p-4 border">
          <p>Prediction: {result.prediction === 1 ? "Approved" : "Rejected"}</p>
          <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
