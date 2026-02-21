"use client";

import { useState } from "react";

type PredictResponse = {
  result: "Approved" | "Rejected";
  probability: number;        // probability of the displayed result
  probability_bad: number;    // risk score (charged-off probability)
};

type DTIResponse = {
  dti: number;
};

export default function Home() {
  // Core inputs (the model features)
  const [loan_amnt, setLoanAmnt] = useState<number>(10000);
  const [term, setTerm] = useState<string>("36 months");
  const [annual_inc, setAnnualInc] = useState<number>(65000);
  const [fico_range_low, setFico] = useState<number>(700);
  const [dti, setDti] = useState<number>(18);

  // UI state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string>("");

  // DTI helper modal state
  const [showDtiHelper, setShowDtiHelper] = useState(false);
  const [monthlyDebt, setMonthlyDebt] = useState<number>(500);
  const [dtiLoading, setDtiLoading] = useState(false);
  const [dtiError, setDtiError] = useState<string>("");

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

      const data: PredictResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function computeDTI() {
    setDtiLoading(true);
    setDtiError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/compute-dti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annual_inc,
          monthly_debt_payment: monthlyDebt,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `DTI request failed with status ${res.status}`);
      }

      const data: DTIResponse = await res.json();
      setDti(data.dti);               // ✅ auto-fill the DTI feature
      setShowDtiHelper(false);        // close helper
    } catch (err: any) {
      setDtiError(err.message || "Failed to compute DTI");
    } finally {
      setDtiLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Loan Approval Predictor (V2)</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Minimal feature set: loan amount, term, income, FICO, DTI.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: 24, display: "grid", gap: 12 }}
      >
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

        {/* DTI + helper */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>DTI</span>
            <button
              type="button"
              onClick={() => {
                setDtiError("");
                setShowDtiHelper(true);
              }}
              title="What is DTI?"
              style={{
                border: "1px solid #ccc",
                borderRadius: 999,
                width: 22,
                height: 22,
                lineHeight: "20px",
                cursor: "pointer",
                background: "white",
                fontWeight: 700,
              }}
            >
              i
            </button>
          </div>

          <input
            type="number"
            step="0.1"
            value={dti}
            onChange={(e) => setDti(Number(e.target.value))}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
            DTI is your total monthly debt payments divided by gross monthly income (as a %).
          </div>
        </div>

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

      {/* Errors */}
      {error && (
        <div style={{ marginTop: 16, color: "crimson", whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Result</h2>

          <p style={{ marginTop: 8 }}>
            Decision:{" "}
            <b style={{ fontSize: 18 }}>
              {result.result === "Approved" ? "Approved ✅" : "Rejected ❌"}
            </b>
          </p>

          <p style={{ marginTop: 6 }}>
            Probability of this result:{" "}
            <b>{(result.probability * 100).toFixed(2)}%</b>
          </p>

          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer" }}>Show model risk details</summary>
            <p style={{ marginTop: 8 }}>
              Probability of “Bad Loan” (charged-off risk):{" "}
              <b>{(result.probability_bad * 100).toFixed(2)}%</b>
            </p>
          </details>
        </div>
      )}

      {/* DTI Helper Modal */}
      {showDtiHelper && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowDtiHelper(false)}
        >
          <div
            style={{ background: "white", width: 520, maxWidth: "100%", padding: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>DTI Calculator</h3>
            <p style={{ marginTop: 8, opacity: 0.85 }}>
              DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100
            </p>

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <label>
                Annual Income (uses your form value)
                <input
                  type="number"
                  value={annual_inc}
                  onChange={(e) => setAnnualInc(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, marginTop: 6 }}
                />
              </label>

              <label>
                Total Monthly Debt Payments (credit cards, car loan, minimums, etc.)
                <input
                  type="number"
                  value={monthlyDebt}
                  onChange={(e) => setMonthlyDebt(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, marginTop: 6 }}
                />
              </label>

              {dtiError && (
                <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
                  {dtiError}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={computeDTI}
                  disabled={dtiLoading}
                  style={{ padding: 10, fontWeight: 700 }}
                >
                  {dtiLoading ? "Calculating..." : "Calculate DTI"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDtiHelper(false)}
                  style={{ padding: 10 }}
                >
                  Cancel
                </button>
              </div>

              <div style={{ fontSize: 12, opacity: 0.75 }}>
                Tip: If you don’t know exact payments, estimate using minimum payments + recurring debts.
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
