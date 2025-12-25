import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  const apiKey = process.env.PI_API_KEY;
  const appId = process.env.PI_APP_ID;

  if (!apiKey || !appId) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  const timestamp = Date.now().toString();
  const payload = JSON.stringify({ paymentId });

  const signature = crypto
    .createHmac("sha256", apiKey)
    .update(payload + timestamp)
    .digest("hex");

  const response = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Pi-API-Key": apiKey,
        "X-Pi-App-Id": appId,
        "X-Pi-Timestamp": timestamp,
        "X-Pi-Signature": signature,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return res.status(500).json({ error: text });
  }

  return res.json({ success: true });
}
