import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "./mycourses.css";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [localCourses, setLocalCourses] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    // Fetch from API
    const token = localStorage.getItem("token");

    api
      .get("/enroll/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourses(res.data);
      })
      .catch(() => {
        setCourses([]);
      });

    // Get locally enrolled courses from cart checkout
    const enrolledFromCart = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    setLocalCourses(enrolledFromCart);
  }, []);


  const deleteCourse = async (item) => {
    try {
      setDeleting(item._id);
      const token = localStorage.getItem("token");
      
      if (item.courseId) {
        // API enrolled course - delete via backend
        await api.delete(`/enroll/${item._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(courses.filter((c) => c._id !== item._id));
      } else {
        // Local course - delete from localStorage
        const updated = localCourses.filter((c) => c._id !== item._id);
        setLocalCourses(updated);
        localStorage.setItem("enrolledCourses", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete course");
    } finally {
      setDeleting(null);
    }
  };

  const combinedCourses = [...courses, ...localCourses];

  // Remove duplicates based on course ID
  const uniqueCourses = combinedCourses.filter((course, index, self) => {
    const courseId = course.courseId ? course.courseId._id : course._id;
    return self.findIndex((c) => (c.courseId ? c.courseId._id : c._id) === courseId) === index;
  });

  if (uniqueCourses.length === 0) {
    return <h2 style={{ textAlign: "center", margin: "2rem" }}>No enrolled courses yet.</h2>;
  }

  return (
    <div className="mycourses-container">
      <h1>🎓 My Courses</h1>

      <div className="courses-list">
        {uniqueCourses.map((item) => {
          const course = item.courseId || item;
          const courseId = item.courseId ? item.courseId._id : item._id;
          const isLocalCourse = !item.courseId;

          return (
            <div
              key={courseId}
              className={`course-card ${isLocalCourse ? "local-course" : ""}`}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              {isLocalCourse && <p className="newly-enrolled">✓ Newly Enrolled</p>}

              <div className="course-actions">
                <Link to={`/course/${courseId}/content`}>
                  <button className="continue-btn">📺 Continue Learning</button>
                </Link>
                <button 
                  className="delete-btn"
                  onClick={() => deleteCourse(item)}
                  disabled={deleting === item._id}
                >
                  {deleting === item._id ? "Deleting..." : "🗑️ Delete Course"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
