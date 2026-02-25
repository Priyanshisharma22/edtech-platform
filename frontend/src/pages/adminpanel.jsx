import { useState } from "react";
import api from "../services/api";

export default function AdminPanel() {
  const [title, setTitle] = useState("");

  const createCourse = async () => {
    await api.post("/courses", { title, price: 999, videos: [] });
    alert("Course Created");
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <input onChange={(e) => setTitle(e.target.value)} />
      <button onClick={createCourse}>Create Course</button>
    </div>
  );
}
