const router = require("express").Router();
const Stripe = require("stripe");
const auth = require("../middleware/auth");

// ✅ Initialize stripe using the EXACT name from your .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout", auth, async (req, res) => {
  try {
    const { course } = req.body;

    // 🛑 DEBUG CHECK: If this triggers, your .env is not being read correctly
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY is missing from environment variables!");
      return res.status(500).json({ error: "Server Configuration Error: API Key missing" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // ✅ Card is universally supported
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr", // ✅ INR for Indian transactions
            product_data: {
              name: course.title,
            },
            unit_amount: Math.round(parseFloat(course.price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cart",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;