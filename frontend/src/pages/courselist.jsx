import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./courselist.css";



export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading courses...</h2>;
  }

  if (error) {
    return <h2 className="course-error">{error}</h2>;
  }

  return (
    <div className="course-page">
      <h1>🎓 Explore Courses</h1>

      {courses.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#6b7280" }}>No courses available</p>
      )}

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-item">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div style={{ marginTop: "auto" }}>
              <Link to={`/course/${course._id}`} style={{ marginRight: "10px" }}>
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
