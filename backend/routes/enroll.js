const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");

// Enroll in a specific course
router.post("/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      paid: true,
    });

    await enrollment.save();
    res.json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Enrollment failed" });
  }
});

// Get user's enrolled courses
router.get("/my", auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate(
      "courseId"
    );
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

// Delete/Unenroll from a course
router.delete("/:enrollmentId", auth, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    // Find and verify ownership
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Verify the enrollment belongs to the user
    if (enrollment.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this enrollment" });
    }

    // Delete the enrollment
    await Enrollment.findByIdAndDelete(enrollmentId);
    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unenroll" });
  }
});
module.exports = router;
