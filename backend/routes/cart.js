const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/cart");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "courses.courseId"
    );

    if (!cart) {
      cart = new Cart({ userId: req.user.id, courses: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add course to cart
router.post("/add/:courseId", auth, async (req, res) => {
  try {
    const courseId = req.courseId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, courses: [] });
    }

    // Check if course already in cart
    const courseExists = cart.courses.some(
      (item) => item.courseId.toString() === courseId
    );

    if (!courseExists) {
      cart.courses.push({ courseId });
      await cart.save();
    }

    await cart.populate("courses.courseId");
    res.json({ message: "Course added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Remove course from cart
router.delete("/remove/:courseId", auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.courses = cart.courses.filter(
      (item) => item.courseId.toString() !== courseId
    );
    await cart.save();

    await cart.populate("courses.courseId");
    res.json({ message: "Course removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Checkout - move all cart items to enrollments
router.post("/checkout", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "courses.courseId"
    );

    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Create enrollment for each course in cart
    const enrollments = [];
    for (const item of cart.courses) {
      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        userId: req.user.id,
        courseId: item.courseId._id,
      });

      if (!existingEnrollment) {
        const enrollment = new Enrollment({
          userId: req.user.id,
          courseId: item.courseId._id,
          paid: true,
        });
        await enrollment.save();
        enrollments.push(enrollment);
      }
    }

    // Clear cart
    cart.courses = [];
    await cart.save();

    res.json({
      message: "Checkout successful",
      enrollments,
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Clear cart
router.delete("/clear", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, courses: [] });
    }

    cart.courses = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
