import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";

import {
  bedOutline,
  checkmarkCircleOutline,
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
} from "ionicons/icons";

import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // ALREADY LOGGED IN
  // ==========================================

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove previous error while typing
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      setError("Please enter your email address.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const email = form.email.trim().toLowerCase();
      const password = form.password;

      // AuthContext handles the API request
      await login(email, password);

      // Return user to the page they originally requested
      const redirectPath = location.state?.from?.pathname || "/";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="login-page">
      <div className="login-container">
        {/* ======================================
            LEFT BRAND SECTION
        ====================================== */}

        <div className="login-brand">
          <div className="login-brand-content">
            <div className="hotel-logo">
              <IonIcon icon={bedOutline} />
            </div>

            <h1>Hotel Management</h1>

            <p>
              Manage your hotel operations with a simple, powerful and modern
              management system.
            </p>

            <div className="login-features">
              <div>
                <span>
                  <IonIcon icon={checkmarkCircleOutline} />
                </span>

                <p>Manage rooms and availability</p>
              </div>

              <div>
                <span>
                  <IonIcon icon={checkmarkCircleOutline} />
                </span>

                <p>Manage guests and bookings</p>
              </div>

              <div>
                <span>
                  <IonIcon icon={checkmarkCircleOutline} />
                </span>

                <p>Track your hotel revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================
            LOGIN FORM SECTION
        ====================================== */}

        <div className="login-form-wrapper">
          <div className="login-card">
            {/* HEADER */}

            <div className="login-header">
              <div className="login-welcome-icon">
                <IonIcon icon={lockClosedOutline} />
              </div>

              <h2>Welcome Back 👋</h2>

              <p>Sign in to access your hotel dashboard.</p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">
                <span className="login-error-icon">!</span>

                <span>{error}</span>
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit} noValidate>
              {/* EMAIL */}

              <div className="form-field">
                <label htmlFor="email">Email Address</label>

                <div className="login-input-wrapper">
                  <IonIcon icon={mailOutline} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@hotel.com"
                    autoComplete="email"
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="form-field">
                <label htmlFor="password">Password</label>

                <div className="login-input-wrapper password-wrapper">
                  <IonIcon icon={lockClosedOutline} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" disabled={loading} />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    alert(
                      "Please contact your hotel administrator to reset your password.",
                    );
                  }}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              {/* SUBMIT BUTTON */}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" />

                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>

                    <IonIcon icon={arrowForwardOutline} />
                  </>
                )}
              </button>
            </form>

            {/* FOOTER */}

            <div className="login-footer">
              <span>🔒 Secure hotel management system</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
