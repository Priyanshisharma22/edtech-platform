import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/courses" className="navbar-logo">
          EduPlatform
        </Link>

        <div className="navbar-menu">
          <Link to="/cart" className="cart-button">
            🛒 Cart
          </Link>

          <Link to="/mycourses" className="mycourses-button">
            📚 My Courses
          </Link>

          <div className="profile-menu">
            <button className="profile-button" onClick={toggleDropdown}>
              👤 Profile
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
