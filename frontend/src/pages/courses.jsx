import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Courses</h1>

      {courses.map(course => (
        <div key={course._id} style={{ marginBottom: "20px" }}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <Link to={`/course/${course._id}`}>
            View Course
          </Link>
        </div>
      ))}
    </div>
  );
}
