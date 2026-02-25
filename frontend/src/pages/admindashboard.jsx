import { useEffect, useState } from "react";
import api from "../services/api";




export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data));
  }, []);

  if (!stats) return null;

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>Total Users: {stats.users}</p>
      <p>Total Courses: {stats.courses}</p>
      <p>Total Enrollments: {stats.enrollments}</p>
    </div>
  );
}
