const razorpay = require("../utils/razorpay");
const crypto = require("crypto");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // rupees

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const paise = Math.round(Number(amount) * 100);

    const order = await razorpay.orders.create({
      amount: paise, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    return res.json(order);
  } catch (err) {
    console.error("createOrder error:", err?.message || err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    return res.json({ message: "Payment successful" });
  } catch (err) {
    console.error("verifyPayment error:", err?.message || err);
    return res.status(500).json({ message: "Verification error" });
  }
};

// WEBHOOK HANDLER
// Note: this route expects the raw body (use `express.raw({type: 'application/json'})` on the route)
exports.webhookHandler = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Missing RAZORPAY_WEBHOOK_SECRET");
      return res.status(500).send("Webhook secret not configured");
    }

    const body = req.body && Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);

    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (expected !== signature) {
      console.warn("Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    let event;
    try {
      event = JSON.parse(body);
    } catch (e) {
      console.warn("Webhook: invalid json", e?.message || e);
      return res.status(400).send("Invalid payload");
    }

    // Handle specific events as needed
    const { event: eventType, payload } = event;
    // Example: handle payment captured
    if (eventType === "payment.captured") {
      // TODO: update DB/payment record using payload.payment.entity
      console.info("Payment captured webhook received");
    }

    // For now, respond 200 to acknowledge receipt
    return res.status(200).send("OK");
  } catch (err) {
    console.error("webhookHandler error:", err?.message || err);
    return res.status(500).send("Internal error");
  }
};
