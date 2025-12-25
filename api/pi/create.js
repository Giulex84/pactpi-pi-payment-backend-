export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  // Questo endpoint serve solo a soddisfare
  // il flow richiesto da Pi (create → approve → complete)
  return res.status(200).json({
    success: true,
    paymentId,
  });
}
