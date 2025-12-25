import type { VercelRequest, VercelResponse } from "vercel";
import crypto from "crypto";
import fetch from "node-fetch";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  const apiKey = process.env.PI_API_KEY!;
  const appId = process.env.PI_APP_ID!;
  const timestamp = Date.now().toString();

  const payload = JSON.stringify({ paymentId });
  const signature = crypto
    .createHmac("sha256", apiKey)
    .update(`${payload}${timestamp}`)
    .digest("hex");

  await fetch(
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

  return res.status(200).json({ success: true });
}
