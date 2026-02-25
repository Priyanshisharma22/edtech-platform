import { useEffect, useState } from "react";
import api from "../services/api";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [value, setValue] = useState("");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };
    fetchProfile();
  }, []);

  /* ================= UPDATE FIELD ================= */
  const saveField = async () => {
    try {
      const res = await api.put("/profile", {
        [editField]: value,
      });
      setUser(res.data);
      setEditField(null);
      setValue("");
    } catch {
      alert("Update failed");
    }
  };

  /* ================= UPLOAD PHOTO ================= */
  const uploadPhoto = async () => {
    if (!file) return alert("Select an image first");

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await api.put("/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      setPreview(null);
      setFile(null);
    } catch {
      alert("Photo upload failed");
    }
  };

  /* ================= REMOVE PHOTO ================= */
  const removePhoto = async () => {
    try {
      const res = await api.delete("/profile/photo");
      setUser(res.data);
    } catch {
      alert("Failed to remove photo");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("All fields required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.put("/profile/password", {
        currentPassword,
        newPassword,
      });

      alert("Password changed successfully. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.msg || "Password change failed");
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="profile-modal">
      <h2>Profile</h2>

      {/* ================= PROFILE PHOTO ================= */}
      <div className="avatar-section">
        <img
          src={
            preview ||
            user.profilePic ||
            "/default-avatar.png"
          }
          className="avatar"
          alt="profile"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <button onClick={uploadPhoto}>Upload</button>

        {user.profilePic && (
          <button className="remove-btn" onClick={removePhoto}>
            Remove photo
          </button>
        )}
      </div>

      {/* ================= NAME ================= */}
      <div className="row">
        <label>Name</label>
        {editField === "name" ? (
          <>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={saveField}>Save</button>
          </>
        ) : (
          <>
            <span>{user.name}</span>
            <button onClick={() => {
              setEditField("name");
              setValue(user.name);
            }}>
              Change
            </button>
          </>
        )}
      </div>

      {/* ================= EMAIL ================= */}
      <div className="row">
        <label>Email</label>
        {editField === "email" ? (
          <>
            <input
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={saveField}>Save</button>
          </>
        ) : (
          <>
            <span>{user.email}</span>
            <button onClick={() => {
              setEditField("email");
              setValue(user.email);
            }}>
              Change
            </button>
          </>
        )}
      </div>

      {/* ================= PHONE ================= */}
      <div className="row">
        <label>Phone</label>
        {editField === "phone" ? (
          <>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={saveField}>Save</button>
          </>
        ) : (
          <>
            <span>{user.phone || "-"}</span>
            <button onClick={() => {
              setEditField("phone");
              setValue(user.phone || "");
            }}>
              Change
            </button>
          </>
        )}
      </div>

      <button className="change-password" onClick={() => setShowPasswordModal(true)}>
        Change Password
      </button>

      <button className="logout" onClick={logout}>
        Logout
      </button>

      {/* ================= PASSWORD MODAL ================= */}
      {showPasswordModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Change Password</h3>

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={changePassword}>Update</button>
            <button className="cancel" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
