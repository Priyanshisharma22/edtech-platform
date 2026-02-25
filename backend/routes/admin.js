const router = require("express").Router();
const User = require("../models/User");
const Course = require("../models/Course");
const auth = require("../middleware/auth");

router.get("/stats", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const users = await User.countDocuments();
  const courses = await Course.countDocuments();
  const enrollments = await User.aggregate([
    { $unwind: "$enrolledCourses" },
    { $count: "total" }
  ]);

  res.json({
    users,
    courses,
    enrollments: enrollments[0]?.total || 0,
  });
});

module.exports = router;
