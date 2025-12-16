import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5002";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please enter email and password" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // store user and navigate
        localStorage.setItem("token", data.token);  // JWT token
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");

        
      } else {
        setMessage({ type: "error", text: data.msg || data.error || "Login failed" });
      }
    } catch (err) {
      setLoading(false);
      setMessage({ type: "error", text: "Network error" });
    }
  };
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "50px 40px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideIn 0.5s ease",
        }}
      >
        <div style={{ marginBottom: "35px" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "10px",
              color: "#667eea",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </h2>
          <p style={{ textAlign: "center", color: "#999", margin: 0, fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "5px",
              marginBottom: "18px",
              borderRadius: "8px",
              border: "1px solid #bbb",
              outline: "none",
              fontSize: "14px",
            }}
          />

          {/* Password */}
          <label
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "5px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "1px solid #bbb",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{ position: "absolute", right: 10, top: 10, background: "transparent", border: "none", color: "#4a00e0", cursor: "pointer" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {message && (
            <div style={{ marginBottom: 12, color: message.type === "error" ? "#c92a2a" : "#1b7a3a" }}>{message.text}</div>
          )}

          {/* Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: "#4a00e0",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#6b28e6")}
            onMouseOut={(e) => (e.target.style.background = "#4a00e0")}
          >
            Login
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "18px",
            fontSize: "14px",
            color: "#444",
          }}
        >
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{ color: "#4a00e0", fontWeight: "bold", textDecoration: "none" }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
