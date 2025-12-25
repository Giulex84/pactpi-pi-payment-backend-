export default async function handler(req, res) {
  try {
    const { paymentId } = req.body;

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error("APPROVE ERROR", err);
    return res.status(500).json({ error: "approve failed" });
  }
}
