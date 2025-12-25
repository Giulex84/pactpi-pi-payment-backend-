export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const response = await fetch(
    "https://api.minepi.com/v2/payments",
    {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 0.01,
        memo: "PactPI verification",
        metadata: { type: "verification" },
      }),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
