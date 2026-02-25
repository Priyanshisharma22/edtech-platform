import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import CourseList from "./pages/courselist";
import CourseDetail from "./pages/coursedetail";
import CourseContent from "./pages/courseContent";
import Profile from "./pages/profile";
import Cart from "./pages/cart";
import MyCourses from "./pages/mycourses";
import ProtectedRoute from "./components/protectedroute";
import Navbar from "./components/navbar";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mycourses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id/content"
        element={
          <ProtectedRoute>
            <CourseContent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}
