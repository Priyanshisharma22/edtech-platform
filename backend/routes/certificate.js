const express = require("express");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const User = require("../models/user");
const Course = require("../models/course");

const router = express.Router();

router.get("/:courseId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
    });

    doc.pipe(res);

    /* ================= OPTIONAL BACKGROUND ================= */
    const bgPath = path.join(
      __dirname,
      "../assets/certificate-bg.png"
    );

    if (fs.existsSync(bgPath)) {
      doc.image(bgPath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height,
      });
    }

    /* ================= TEXT ================= */
    doc
      .fontSize(36)
      .fillColor("#000")
      .text("Certificate of Completion", 0, 150, {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(20)
      .text("This is to certify that", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(28)
      .text(user.name || "Student", {
        align: "center",
        underline: true,
      });

    doc.moveDown(1);

    doc
      .fontSize(18)
      .text("has successfully completed the course", {
        align: "center",
      });

    doc.moveDown(1);

    doc
      .fontSize(22)
      .text(course.title, {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .text(`Issued on: ${new Date().toDateString()}`, {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("Certificate error:", err);
    if (!res.headersSent) {
      res.status(500).json({ msg: "Certificate generation failed" });
    }
  }
});

module.exports = router;
