import React, { useState } from "react";

export default function GlobalVerificationPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const verifyCertificate = async () => {
    if (!input) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://us-central1-unimentorai-pjhwn.cloudfunctions.net/global_verification_api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ certificateId: input }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        valid: false,
        error: "Verification failed",
      });
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F19", color: "white", padding: 20 }}>

      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        🌍 Global Certificate Verification
      </h1>

      {/* INPUT */}
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#111827", padding: 20, borderRadius: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Certificate ID or Hash"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #333",
            background: "#0F172A",
            color: "white"
          }}
        />

        <button
          onClick={verifyCertificate}
          style={{
            marginTop: 12,
            width: "100%",
            padding: 12,
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Verify Certificate
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p style={{ textAlign: "center", marginTop: 20, color: "#60A5FA" }}>
          Verifying blockchain + AI engine...
        </p>
      )}

      {/* RESULT */}
      {result && (
        <div style={{ maxWidth: 600, margin: "20px auto", background: "#111827", padding: 20, borderRadius: 12 }}>

          {result.valid ? (
            <>
              <h2 style={{ color: "#22C55E" }}>✔ Valid Certificate</h2>

              <p>Issuer: {result.issuer}</p>
              <p>Trust Score: {result.trust_score}%</p>
              <p>Blockchain: {result.blockchain_verified ? "YES" : "NO"}</p>

              <div style={{ height: 10, background: "#1F2937", borderRadius: 10, marginTop: 10 }}>
                <div
                  style={{
                    width: `${result.trust_score || 0}%`,
                    height: "100%",
                    background: "#22C55E",
                    borderRadius: 10
                  }}
                />
              </div>
            </>
          ) : (
            <h2 style={{ color: "#EF4444" }}>✖ Invalid Certificate</h2>
          )}

        </div>
      )}
    </div>
  );
}