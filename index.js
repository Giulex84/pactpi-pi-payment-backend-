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
  console.error("❌ Missing PI_API_KEY");
  process.exit(1);
}

const PI_API_BASE = "https://api.minepi.com/v2/payments";

/**
 * Approve + Complete Pi Payment
 */
app.post("/approve-payment", async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "Missing paymentId" });
  }

  try {
    // 1️⃣ APPROVE PAYMENT
    await axios.post(
      `${PI_API_BASE}/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 2️⃣ COMPLETE PAYMENT  🔥 (QUESTO ERA IL PEZZO MANCANTE)
    await axios.post(
      `${PI_API_BASE}/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 3️⃣ DONE
    res.json({ success: true });
  } catch (err) {
    console.error(
      "❌ Pi payment error",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Pi payment failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
