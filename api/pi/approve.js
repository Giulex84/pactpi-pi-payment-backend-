import { useState } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

export default function VerifyPi() {
  const [error, setError] = useState<string | null>(null);
  const backend = import.meta.env.VITE_BACKEND_URL;

  const verify = async () => {
    setError(null);

    try {
      await window.Pi.createPayment(
        {
          amount: 0.01,
          memo: "App verification",
          metadata: { type: "verify" }
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            await fetch(`${backend}/api/pi/approve`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId })
            });
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            await fetch(`${backend}/api/pi/complete`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid })
            });
          },

          onCancel: () => {
            setError("Transaction cancelled");
          },

          onError: (err: any) => {
            setError(err?.message || "Payment error");
          }
        }
      );
    } catch {
      setError("Failed to start payment");
    }
  };

  return (
    <div>
      <button onClick={verify}>Verify with Pi (0.01 Pi)</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
