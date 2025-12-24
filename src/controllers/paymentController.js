const razorpay = require("../utils/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  const crypto = require("crypto");

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    }

    return res.json({ success: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
};
