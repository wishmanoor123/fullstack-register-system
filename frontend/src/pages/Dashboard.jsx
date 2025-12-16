import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  fetch("http://localhost:5002/dashboard", {  // ✅ aap backend endpoint add karenge
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      if (data.msg === "Invalid token" || data.msg === "No token provided") {
        navigate("/login");
      } else {
        setUser(data.user);
        setEditData({ name: data.user.name, email: data.user.email });
      }
    })
    .catch(() => navigate("/login"));
}, [navigate]);


  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token"); // ✅ remove JWT
  navigate("/login");
};

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    const updatedUser = { ...user, ...editData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({ name: user.name, email: user.email });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "30px 20px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            gap: "20px",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid white",
              padding: "10px 20px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,255,255,0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ← Back
          </button>

          <h1 style={{ color: "white", fontSize: "32px", margin: 0, flex: 1 }}>
            Dashboard
          </h1>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "2px solid white",
              padding: "10px 25px",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,255,255,0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Left: Profile Section */}
          <div
            style={{
              padding: "50px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            {/* Profile Image */}
            <div
              style={{
                position: "relative",
                marginBottom: "25px",
              }}
            >
              <img
                src={user.image || "https://via.placeholder.com/140?text=No+Image"}
                alt="profile"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "6px solid white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  background: "#4caf50",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "20px",
                  border: "3px solid white",
                }}
              >
                ✓
              </div>
            </div>

            <h2 style={{ fontSize: "28px", margin: "15px 0 8px 0", fontWeight: "bold" }}>
              {user.name}
            </h2>
            <p style={{ fontSize: "16px", margin: "0 0 20px 0", opacity: "0.9" }}>
              {user.email}
            </p>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "25px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "24px", margin: "0", fontWeight: "bold" }}>
                  100%
                </p>
                <p style={{ fontSize: "12px", margin: "5px 0 0 0", opacity: "0.8" }}>
                  Complete
                </p>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.3)" }}></div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "24px", margin: "0", fontWeight: "bold" }}>
                  Verified
                </p>
                <p style={{ fontSize: "12px", margin: "5px 0 0 0", opacity: "0.8" }}>
                  Account
                </p>
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div style={{ padding: "50px 40px", background: "#f8f9fa" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "30px",
              }}
            >
              Account Information
            </h3>

            {!isEditing ? (
              <>
                <div style={{ marginBottom: "25px" }}>
                  <label style={{ fontSize: "12px", color: "#999", fontWeight: "600" }}>
                    FULL NAME
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#333",
                      margin: "8px 0 0 0",
                      fontWeight: "500",
                    }}
                  >
                    {user.name}
                  </p>
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label style={{ fontSize: "12px", color: "#999", fontWeight: "600" }}>
                    EMAIL ADDRESS
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#333",
                      margin: "8px 0 0 0",
                      fontWeight: "500",
                    }}
                  >
                    {user.email}
                  </p>
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label style={{ fontSize: "12px", color: "#999", fontWeight: "600" }}>
                    USER ID
                  </label>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#333",
                      margin: "8px 0 0 0",
                      fontWeight: "500",
                      fontFamily: "monospace",
                    }}
                  >
                    #{user.id}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginTop: "20px",
                    transition: "all 0.3s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#5568d3";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#667eea";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "8px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  />
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "8px",
                      border: "2px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border 0.3s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#45a049";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#4caf50";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#da190b";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#f44336";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              maxWidth: "400px",
              textAlign: "center",
              animation: "slideUp 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "22px", color: "#333", marginBottom: "15px" }}>
              Confirm Logout?
            </h3>
            <p style={{ color: "#666", marginBottom: "30px", fontSize: "14px" }}>
              Are you sure you want to logout from your account?
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.background = "#e0e0e0")}
                onMouseOut={(e) => (e.target.style.background = "#f0f0f0")}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#da190b";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#f44336";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
