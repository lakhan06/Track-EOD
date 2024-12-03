import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import { login } from "../../services/api";
import "./Login.css";

const Login = () => {
  const { login: authenticateUser, user } = useContext(AuthContext); // Use AuthContext
  const [form, setForm] = useState({ email: "", password: "" }); // Form state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null); // Clear previous errors
      const { data } = await login(form); // Call the login API
      authenticateUser(data.user, data.token); // Save user & token to context
      navigate("/"); // Navigate to the dashboard
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Left side: Login form */}
      <div className="login-form-container">
        <h2 className="login-header">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        <div className="register-link">
          Don't have an account? <Link to="/register"><span>Register</span></Link>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="login-image-container">
        <img
          src="images/Register.webp" // Replace with your image URL
          alt="Login Illustration"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
