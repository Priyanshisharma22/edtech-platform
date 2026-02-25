import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import VideoPlayer from "../components/videoplayer";
import "./courseContent.css";

export default function CourseContent() {
  const { id } = useParams(); // courseId
  const [completed, setCompleted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const token = localStorage.getItem("token");

  // Mark course progress after video ends
  const handleVideoComplete = async () => {
    try {
      await api.post(
        `/progress/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCompleted(true);
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  // Download certificate (AUTHORIZED)
  const downloadCertificate = async () => {
    setDownloading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/certificate/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        alert("Certificate not available");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate download failed", err);
      alert("Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="course-content-container">
      <h1>📚 Course Content</h1>

      <div className="video-section">
        <VideoPlayer
          videoUrl="https://www.w3schools.com/html/mov_bbb.mp4"
          onComplete={handleVideoComplete}
        />
      </div>

      {completed && (
        <div className="completion-section">
          <div className="completion-card">
            <div className="completion-icon">🎉</div>
            <h2>Course Completed!</h2>
            <p>Congratulations! You have successfully completed this course.</p>
            <button 
              className="certificate-btn"
              onClick={downloadCertificate}
              disabled={downloading}
            >
              {downloading ? "Downloading..." : "📜 Download Certificate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
