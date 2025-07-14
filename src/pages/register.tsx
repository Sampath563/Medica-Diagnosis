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
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

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
        email: formData.email,
        password: formData.password,
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
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
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
          Register
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

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

export default Register;
