const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

/* ================= CORS – HARD FIX ================= */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ================= BODY PARSER ================= */
app.use(express.json());
// 1. Import your payment route file
const paymentRoutes = require("./routes/payment");

// 2. Register it with the /api/payment prefix
// This makes the final URL: http://localhost:5000/api/payment/create-checkout
app.use("/api/payment", paymentRoutes);

/* ================= STATIC ================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/enroll", require("./routes/enroll"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/certificate", require("./routes/certificate"));
// This connects the logic in payment.js to the /api/payment URL


/* ================= DB + SERVER ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((err) => console.error(err));
