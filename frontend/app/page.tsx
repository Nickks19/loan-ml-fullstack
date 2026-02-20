"use client";

import { useState } from "react";

type ApiResponse = {
  approved: boolean;
  probability_bad: number;
};

export default function Home() {
  const [loan_amnt, setLoanAmnt] = useState<number>(10000);
  const [term, setTerm] = useState<string>("36 months");
  const [annual_inc, setAnnualInc] = useState<number>(65000);
  const [fico_range_low, setFico] = useState<number>(700);
  const [dti, setDti] = useState<number>(18);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loan_amnt,
          term,
          annual_inc,
          fico_range_low,
          dti,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        Loan Approval Predictor (V2)
      </h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Minimal feature set: loan amount, term, income, FICO, DTI.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <label>
          Loan Amount
          <input
            type="number"
            value={loan_amnt}
            onChange={(e) => setLoanAmnt(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Term
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="36 months">36 months</option>
            <option value="60 months">60 months</option>
          </select>
        </label>

        <label>
          Annual Income
          <input
            type="number"
            value={annual_inc}
            onChange={(e) => setAnnualInc(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          FICO (Low)
          <input
            type="number"
            value={fico_range_low}
            onChange={(e) => setFico(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          DTI
          <input
            type="number"
            step="0.1"
            value={dti}
            onChange={(e) => setDti(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 16, color: "crimson", whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Result</h2>
          <p style={{ marginTop: 8 }}>
            Approved: <b>{result.approved ? "YES" : "NO"}</b>
          </p>
          <p>
            Probability of “Bad Loan”: <b>{(result.probability_bad * 100).toFixed(2)}%</b>
          </p>
        </div>
      )}
    </main>
  );
}
