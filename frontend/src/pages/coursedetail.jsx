import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./coursedetail.css";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    api
      .get(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load course");
        setLoading(false);
      });
  }, [id]);

  /* ================= CHECK IF ALREADY ENROLLED ================= */
  useEffect(() => {
    if (!token) return;

    // Check API enrollments
    api
      .get("/enroll/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const enrolled = res.data.some((enroll) => enroll.courseId._id === id);
        if (enrolled) {
          setIsEnrolled(true);
          return;
        }

        // Check localStorage enrollments
        const localEnrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        const isLocalEnrolled = localEnrolled.some((c) => c._id === id);
        if (isLocalEnrolled) {
          setIsEnrolled(true);
        }
      })
      .catch(() => {
        // Check localStorage as fallback
        const localEnrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
        const isLocalEnrolled = localEnrolled.some((c) => c._id === id);
        if (isLocalEnrolled) {
          setIsEnrolled(true);
        }
      });
  }, [id, token]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item._id === course._id);
    if (exists) {
      alert("Course already in cart");
      return;
    }

    cart.push(course);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  if (loading) return <p style={{ textAlign: "center", padding: "2rem" }}>Loading...</p>;
  if (!course) return null;

  return (
    <div className="course-detail-page">
      <h1>Course Detail</h1>

      <div className="course-card">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p className="price">₹{course.price}</p>
      </div>

      {isEnrolled && (
        <div className="already-enrolled-banner">
          ✓ You are already enrolled in this course
        </div>
      )}

      {/* ================= ACTION BUTTONS ================= */}
      <div className="course-actions">
        {!isEnrolled && (
          <button className="cart-btn" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
