import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        email,
        password,
      });

      setMessage(res.data.message);
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
      setMessage("");
    }
  };

  return (
    <div style={styles.fullPageBackground}>
      <div style={styles.overlay}></div>
      <div style={styles.centerContainer}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Create a Medical Account</h2>
          <form onSubmit={handleRegister} style={styles.form}>
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
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
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === "password" ? styles.inputFocus : {}),
              }}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              onFocus={() => setFocusedInput("confirmPassword")}
              onBlur={() => setFocusedInput(null)}
              style={{
                ...styles.input,
                ...(focusedInput === "confirmPassword"
                  ? styles.inputFocus
                  : {}),
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
              Register
            </button>
          </form>

          {message && <p style={{ color: "#0f0", marginTop: 10 }}>{message}</p>}
          {error && <p style={{ color: "#f55", marginTop: 10 }}>{error}</p>}

          <p style={{ textAlign: "center", marginTop: "10px", color: "#fff" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#08fff7ff" }}>
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// 💠 Styles
const styles: { [key: string]: React.CSSProperties } = {
  fullPageBackground: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    backgroundImage:
      "url('https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
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
    padding: "20px",
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
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#fff",
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
    border: "1px solid rgba(0, 229, 255, 0.5)",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 0 4px rgba(0,229,255,0.2)",
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
  },
  buttonHover: {
    background:
      "linear-gradient(90deg, rgba(0,229,255,0.1), rgba(0,172,193,0.2))",
    boxShadow: "0 0 12px #00e5ff, 0 0 24px #00acc1",
    transform: "scale(1.03)",
  },
};

export default Register;
