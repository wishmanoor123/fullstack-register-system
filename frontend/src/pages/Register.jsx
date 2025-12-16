import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5002";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else setPreview(null);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  function passwordStrength(pw) {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    // basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    // build form data
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.image) data.append("image", formData.image);

    // use XHR to track upload progress
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/register`);
    setLoading(true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        setProgress(pct);
      }
    };
    xhr.onload = () => {
      setLoading(false);
      if (xhr.status === 201 || xhr.status === 200) {
        setMessage({ type: "success", text: "Registration successful. Redirecting to login..." });
        setTimeout(() => navigate("/login"), 1400);
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          setMessage({ type: "error", text: res.msg || res.error || "Registration failed" });
        } catch (err) {
          setMessage({ type: "error", text: "Registration failed" });
        }
      }
      setProgress(0);
    };
    xhr.onerror = () => {
      setLoading(false);
      setMessage({ type: "error", text: "Network error. Please try again." });
    };
    xhr.send(data);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            marginBottom: "25px",
            color: "#2575fc",
            fontWeight: "bold",
          }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            placeholder="Enter full name"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
              marginBottom: "18px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          {/* Email */}
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            onChange={handleChange}
            placeholder="Enter email address"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
              marginBottom: "18px",
              fontSize: "14px",
              outline: "none",
            }}
          />

          {/* Password */}
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              onChange={handleChange}
              placeholder="Create a password"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                marginBottom: "8px",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 10,
                top: 10,
                background: "transparent",
                border: "none",
                color: "#2575fc",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div style={{ height: 8, background: "#f1f1f1", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
            <div
              style={{
                height: "100%",
                width: `${(passwordStrength(formData.password) / 4) * 100}%`,
                background: formData.password ? "linear-gradient(90deg,#00b09b,#96c93d)" : "transparent",
                transition: "width 200ms ease",
              }}
            />
          </div>

          {/* Image */}
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "#555" }}>
            Upload Profile Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f8f8f8",
              fontSize: "14px",
            }}
          />

          {preview && (
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <img src={preview} alt="preview" style={{ maxWidth: "160px", borderRadius: 8 }} />
            </div>
          )}

          {progress > 0 && (
            <div style={{ height: 8, background: "#efefef", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#2575fc", transition: "width 120ms" }} />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2575fc",
              color: "white",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#1b5fcc")}
            onMouseOut={(e) => (e.target.style.background = "#2575fc")}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p style={{ textAlign: "center", marginTop: 16, color: message.type === "error" ? "#c92a2a" : "#1b7a3a" }}>
            {message.text}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            color: "#444",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#2575fc", fontWeight: "bold", textDecoration: "none" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
