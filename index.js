import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

if (!PI_API_KEY) {
  console.error("❌ Missing PI_API_KEY in .env");
  process.exit(1);
}

app.post("/approve-payment", async (req, res) => {
  const { payment


  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  try {
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error("❌ Pi payment approval failed", err.response?.data || err);
    res.status(500).json({ error: "Payment approval failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pi payment backend running on port ${PORT}`);
});
