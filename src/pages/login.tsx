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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
    console.log("📤 Sending login-step1 request with:", {
      email: formData.email,
      password: formData.password,
    });

    try {
      const res = await axios.post("https://medica-backend-3.onrender.com/api/login-step1", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.step === 2) {
        setMessage("📧 Verification code sent to your email.");
        setError("");
        setStep(2);
        setTimeLeft(600);
      }
    } catch (err: any) {
      console.error("❌ login-step1 error:", err.response || err.message);
      setError(err.response?.data?.message || "Step 1 failed.");
      setMessage("");
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://medica-backend-3.onrender.com/api/login-step2", {
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
      await axios.post("https://medica-backend-3.onrender.com/api/login-step1", {
        email: formData.email,
        password: formData.password,
      });
      setMessage("📧 New verification code sent.");
      setError("");
      setTimeLeft(600);
    } catch (err: any) {
      setError("Could not resend code.");
      setMessage("");
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <div style={styles.fullPageBackground}>
      <div style={styles.overlay}></div>

      <div style={styles.centerContainer}>
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
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === "email" ? styles.inputFocus : {}),
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                value={formData.password}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === "password" ? styles.inputFocus : {}),
                }}
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
                onFocus={() => setFocusedInput("code")}
                onBlur={() => setFocusedInput(null)}
                style={{
                  ...styles.input,
                  ...(focusedInput === "code" ? styles.inputFocus : {}),
                }}
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

              <p style={styles.timerText}>
                {timeLeft > 0
                  ? `⏳ Code expires in ${formatTime(timeLeft)}`
                  : "⚠️ Code expired. Please resend."}
              </p>

              <button
                type="button"
                onClick={handleResendCode}
                style={styles.resendButton}
              >
                Resend Code
              </button>
            </form>
          )}

          {message && <p style={styles.messageText}>{message}</p>}
          {error && <p style={styles.errorText}>{error}</p>}

          <p style={styles.registerText}>
            Don't have an account?{" "}
            <a href="/register" style={styles.registerLink}>
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  fullPageBackground: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1889&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 86, 179, 0.7)",
    zIndex: 1,
  },
  centerContainer: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    padding: "1rem",
  },
  container: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    // Mobile responsive
    '@media (max-width: 600px)': {
      maxWidth: "90%",
      padding: "1.5rem",
      margin: "1rem",
    },
    '@media (max-width: 400px)': {
      maxWidth: "95%",
      padding: "1.25rem",
      margin: "0.5rem",
    },
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "0.5px",
    // Mobile responsive
    '@media (max-width: 600px)': {
      fontSize: "1.5rem",
      marginBottom: "1.5rem",
    },
    '@media (max-width: 400px)': {
      fontSize: "1.25rem",
      marginBottom: "1.25rem",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  input: {
    padding: "1rem",
    borderRadius: "8px",
    border: "2px solid rgba(0, 188, 212, 0.6)",
    outline: "none",
    fontSize: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    transition: "all 0.3s ease",
    fontFamily: "system-ui, -apple-system, sans-serif",
    minHeight: "50px",
    width: "100%",
    boxSizing: "border-box",
    // Mobile responsive
    '@media (max-width: 600px)': {
      padding: "0.875rem",
      fontSize: "1rem",
      minHeight: "48px",
    },
    '@media (max-width: 400px)': {
      padding: "0.75rem",
      fontSize: "0.95rem",
      minHeight: "46px",
    },
  },
  inputFocus: {
    border: "2px solid #00bcd4",
    boxShadow: "0 0 0 3px rgba(0, 188, 212, 0.2)",
  },
  button: {
    padding: "1rem",
    background: "transparent",
    color: "#ffffff",
    border: "2px solid #00bcd4",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "system-ui, -apple-system, sans-serif",
    minHeight: "50px",
    width: "100%",
    boxSizing: "border-box",
    // Mobile responsive
    '@media (max-width: 600px)': {
      padding: "0.875rem",
      fontSize: "1rem",
      minHeight: "48px",
    },
    '@media (max-width: 400px)': {
      padding: "0.75rem",
      fontSize: "0.95rem",
      minHeight: "46px",
    },
  },
  buttonHover: {
    background: "rgba(0, 188, 212, 0.1)",
    boxShadow: "0 0 20px rgba(0, 188, 212, 0.3)",
    transform: "translateY(-1px)",
  },
  timerText: {
    fontSize: "0.875rem",
    color: "#fff",
    marginTop: "0.5rem",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    // Mobile responsive
    '@media (max-width: 400px)': {
      fontSize: "0.8rem",
    },
  },
  resendButton: {
    marginTop: "0.5rem",
    background: "transparent",
    color: "#00bcd4",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.875rem",
    padding: "0.5rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
    minHeight: "40px",
    // Mobile responsive
    '@media (max-width: 400px)': {
      fontSize: "0.8rem",
      minHeight: "38px",
    },
  },
  messageText: {
    color: "#fff",
    marginTop: "1rem",
    fontSize: "0.875rem",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    // Mobile responsive
    '@media (max-width: 400px)': {
      fontSize: "0.8rem",
    },
  },
  errorText: {
    color: "#ff5252",
    marginTop: "1rem",
    fontSize: "0.875rem",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    // Mobile responsive
    '@media (max-width: 400px)': {
      fontSize: "0.8rem",
    },
  },
  registerText: {
    textAlign: "center",
    marginTop: "1.5rem",
    color: "#fff",
    fontSize: "0.875rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
    // Mobile responsive
    '@media (max-width: 400px)': {
      fontSize: "0.8rem",
      marginTop: "1.25rem",
    },
  },
  registerLink: {
    color: "#00bcd4",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Login;