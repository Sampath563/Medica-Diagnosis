import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login-step1", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.step === 2) {
        setMessage("📧 Verification code sent to your email.");
        setError("");
        setStep(2);
        setTimeLeft(300);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Step 1 failed.");
      setMessage("");
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login-step2", {
        email: formData.email,
        code: formData.code,
      });

      setMessage("✅ Login successful!");
      setError("");
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed.");
      setMessage("");
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post("http://localhost:8000/api/login-step1", {
        email: formData.email,
        password: formData.password,
      });
      setMessage("📧 New verification code sent.");
      setError("");
      setTimeLeft(300);
    } catch (err: any) {
      setError("Could not resend code.");
      setMessage("");
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Medical App Login</h2>

      {step === 1 ? (
        <form onSubmit={handleStep1} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            value={formData.email}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            value={formData.password}
            style={styles.input}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isHovering ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Send Verification Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleStep2} style={styles.form}>
          <input
            type="text"
            name="code"
            placeholder="Enter verification code"
            required
            onChange={handleChange}
            value={formData.code}
            style={styles.input}
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isHovering ? styles.buttonHover : {}),
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Verify & Login
          </button>

          <p style={{ fontSize: "13px", color: "#555", marginTop: "10px" }}>
            {timeLeft > 0
              ? `⏳ Code expires in ${formatTime(timeLeft)}`
              : "⚠️ Code expired. Please resend."}
          </p>

          <button
            type="button"
            onClick={handleResendCode}
            style={{
              marginTop: "10px",
              background: "transparent",
              color: "#007bff",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Resend Code
          </button>
        </form>
      )}

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

// 🌈 Enhanced Medical UI Styling
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "420px",
    margin: "100px auto",
    padding: "30px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
    boxShadow: "0 8px 20px rgba(0, 183, 255, 0.2)",
    border: "1px solid rgba(0, 174, 255, 0.3)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#006064",
    fontFamily: "Segoe UI, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #b2ebf2",
    outline: "none",
    fontSize: "14px",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
  },
  button: {
    padding: "12px",
    background: "linear-gradient(90deg, #00bcd4, #0097a7)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 188, 212, 0.4)",
  },
  buttonHover: {
    background: "linear-gradient(90deg, #00e5ff, #00acc1)",
    boxShadow: "0 0 12px #00e5ff, 0 0 24px #00acc1",
    transform: "scale(1.03)",
  },
};

export default Login;
