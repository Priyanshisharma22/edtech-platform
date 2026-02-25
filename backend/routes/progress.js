const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Progress = require("../models/Progress");

// Mark course as completed
router.post("/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // prevent duplicate progress
    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completed: true,
      });
    }

    res.json({ message: "Course completed", progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Progress update failed" });
  }
});

module.exports = router;
