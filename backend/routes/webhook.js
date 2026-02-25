const express = require("express");
const Stripe = require("stripe");
const Enrollment = require("../models/enrollment");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata.userId;
      const courseId = session.metadata.courseId;

      await Enrollment.create({
        user: userId,
        course: courseId,
        paymentStatus: "paid",
      });
    }

    res.json({ received: true });
  }
);

module.exports = router;
