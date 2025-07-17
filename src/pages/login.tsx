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
    <>
      <style>{`
        @media (max-width: 768px) {
          .login-container {
            width: 95% !important;
            max-width: 380px !important;
            padding: 20px !important;
            margin: 10px !important;
          }
          
          .login-heading {
            font-size: 24px !important;
            margin-bottom: 16px !important;
          }
          
          .login-input {
            padding: 14px !important;
            font-size: 16px !important;
            margin-bottom: 14px !important;
          }
          
          .login-button {
            padding: 14px !important;
            font-size: 16px !important;
            min-height: 48px !important;
          }
          
          .login-timer-text {
            font-size: 14px !important;
            margin-top: 12px !important;
          }
          
          .login-resend-button {
            margin-top: 12px !important;
            font-size: 14px !important;
            padding: 8px !important;
          }
          
          .login-message {
            font-size: 14px !important;
            margin-top: 12px !important;
          }
          
          .login-register-link {
            font-size: 14px !important;
            margin-top: 12px !important;
          }
          
          .login-center-container {
            padding: 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          .login-container {
            width: 100% !important;
            max-width: 340px !important;
            padding: 16px !important;
            margin: 5px !important;
          }
          
          .login-heading {
            font-size: 22px !important;
            margin-bottom: 14px !important;
          }
          
          .login-input {
            padding: 12px !important;
            font-size: 16px !important;
          }
          
          .login-button {
            padding: 12px !important;
            font-size: 15px !important;
            min-height: 44px !important;
          }
          
          .login-center-container {
            padding: 10px !important;
          }
        }
        
        @media (min-width: 769px) {
          .login-container {
            width: 100% !important;
            max-width: 420px !important;
            padding: 30px !important;
          }
          
          .login-heading {
            font-size: 28px !important;
            margin-bottom: 20px !important;
          }
          
          .login-input {
            padding: 12px !important;
            font-size: 14px !important;
          }
          
          .login-button {
            padding: 12px !important;
            font-size: 14px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .login-container {
            max-width: 450px !important;
            padding: 35px !important;
          }
          
          .login-heading {
            font-size: 30px !important;
            margin-bottom: 24px !important;
          }
        }
        
        /* Fix for iOS Safari zoom on input focus */
        @media (max-width: 768px) {
          .login-input:focus {
            font-size: 16px !important;
          }
        }
      `}</style>
      
      <div style={styles.fullPageBackground}>
        <div style={styles.overlay}></div>

        <div style={styles.centerContainer} className="login-center-container">
          <div style={styles.container} className="login-container">
            <h2 style={styles.heading} className="login-heading">Medical App Login</h2>

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
                  className="login-input"
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
                  className="login-input"
                  style={{
                    ...styles.input,
                    ...(focusedInput === "password" ? styles.inputFocus : {}),
                  }}
                />
                <button
                  type="submit"
                  className="login-button"
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
                  className="login-input"
                  style={{
                    ...styles.input,
                    ...(focusedInput === "code" ? styles.inputFocus : {}),
                  }}
                />
                <button
                  type="submit"
                  className="login-button"
                  style={{
                    ...styles.button,
                    ...(isHovering ? styles.buttonHover : {}),
                  }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Verify & Login
                </button>

                <p style={styles.timerText} className="login-timer-text">
                  {timeLeft > 0
                    ? `⏳ Code expires in ${formatTime(timeLeft)}`
                    : "⚠️ Code expired. Please resend."}
                </p>

                <button
                  type="button"
                  onClick={handleResendCode}
                  className="login-resend-button"
                  style={styles.resendButton}
                >
                  Resend Code
                </button>
              </form>
            )}

            {message && <p style={styles.message} className="login-message">{message}</p>}

            {error && <p style={styles.error} className="login-message">{error}</p>}

            <p style={styles.registerLink} className="login-register-link">
              Don't have an account?{" "}
              <a href="/register" style={styles.registerLinkAnchor}>
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// 💡 Responsive Styles
const styles: { [key: string]: React.CSSProperties } = {
  fullPageBackground: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    backgroundImage:
      "url('https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "auto",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to right, rgba(0, 36, 80, 0.6), rgba(0, 85, 150, 0.5))",
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
    padding: "20px",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 8px 20px rgba(0, 183, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
    lineHeight: "1.2",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(0, 229, 255, 0.5)",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 0 4px rgba(0,229,255,0.2)",
    boxSizing: "border-box",
    width: "100%",
  },
  inputFocus: {
    border: "1px solid #00e5ff",
    boxShadow: "0 0 8px #00e5ff, 0 0 16px rgba(0,229,255,0.4)",
  },
  button: {
    padding: "12px",
    background: "transparent",
    color: "#ffffff",
    border: "2px solid #00e5ff",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 8px rgba(0, 229, 255, 0.2)",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "auto",
  },
  buttonHover: {
    background:
      "linear-gradient(90deg, rgba(0,229,255,0.1), rgba(0,172,193,0.2))",
    boxShadow: "0 0 12px #00e5ff, 0 0 24px #00acc1",
    transform: "scale(1.03)",
  },
  timerText: {
    fontSize: "13px",
    color: "#fff",
    marginTop: "10px",
    textAlign: "center",
  },
  resendButton: {
    marginTop: "10px",
    background: "transparent",
    color: "#00e5ff",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
    padding: "5px",
    transition: "all 0.3s ease",
  },
  message: {
    color: "#fff",
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
  error: {
    color: "#f55",
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
  registerLink: {
    textAlign: "center",
    marginTop: "10px",
    color: "#fff",
    fontSize: "14px",
  },
  registerLinkAnchor: {
    color: "#00e5ff",
    textDecoration: "none",
  },
};

export default Login;