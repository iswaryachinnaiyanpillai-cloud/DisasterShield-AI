import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  UserRound,
  LockKeyhole,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  registerUser,
  loginUser,
} from "../../services/authService";

export default function AuthorityLogin() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function switchMode() {
    setIsRegistering((previous) => !previous);

    setName("");
    setIdentifier("");
    setPassword("");
    setPhone("");
    setLocation("");

    setShowPassword(false);

    resetMessages();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    resetMessages();

    if (!identifier.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (isRegistering) {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (!phone.trim()) {
        setError("Please enter your phone number.");
        return;
      }

      if (!location.trim()) {
        setError("Please enter your location.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isRegistering) {
        const result = await registerUser({
          role: "authority",
          name,
          identifier,
          password,
          phone,
          location,
        });

        if (!result.success) {
          setError(result.message || "Unable to create authority account.");
          return;
        }

        setSuccess(
          "Authority account created successfully. You can now sign in."
        );

        setIsRegistering(false);

        setName("");
        setIdentifier("");
        setPassword("");
        setPhone("");
        setLocation("");
      } else {
        const result = await loginUser({
          role: "authority",
          identifier,
          password,
        });

        if (!result.success) {
          setError(result.message || "Invalid email/phone or password.");
          return;
        }

        navigate("/authority");
      }
    } catch (err) {
      console.error("Authority authentication error:", err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page authority-auth-page">
      <div className="auth-background" />

      <div className="auth-container">

        {/* Back button */}

        <button
          type="button"
          className="auth-back-button"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>


        {/* Brand */}

        <div className="auth-brand">

          <div className="auth-brand-icon">
            <ShieldAlert size={30} />
          </div>

          <div>
            <div className="auth-brand-name">
              DisasterShield AI
            </div>

            <div className="auth-brand-subtitle">
              Emergency Intelligence Platform
            </div>
          </div>

        </div>


        {/* Main card */}

        <div className="auth-card">

          {/* Header */}

          <div className="auth-header">

            <div className="auth-role-icon authority-auth-icon">
              <Building2 size={30} />
            </div>

            <div className="auth-header-text">
              <span className="auth-role-label">
                AUTHORITY PLATFORM
              </span>

              <h1>
                {isRegistering
                  ? "Create Authority Account"
                  : "Authority Login"}
              </h1>

              <p>
                {isRegistering
                  ? "Register to access the Emergency Command Center."
                  : "Sign in to the Emergency Command Center."}
              </p>
            </div>

          </div>


          {/* Messages */}

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-success">
              {success}
            </div>
          )}


          {/* Form */}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* Name - registration */}

            {isRegistering && (
              <div className="auth-field">

                <label htmlFor="authority-name">
                  Name
                </label>

                <div className="auth-input-wrapper">

                  <UserRound
                    size={18}
                    className="auth-input-icon"
                  />

                  <input
                    id="authority-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                  />

                </div>

              </div>
            )}


            {/* Email / phone */}

            <div className="auth-field">

              <label htmlFor="authority-identifier">
                Email or Phone
              </label>

              <div className="auth-input-wrapper">

                <Mail
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="authority-identifier"
                  type="text"
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(event.target.value)
                  }
                  placeholder="Enter your email or phone"
                  autoComplete="username"
                />

              </div>

            </div>


            {/* Phone - registration */}

            {isRegistering && (
              <div className="auth-field">

                <label htmlFor="authority-phone">
                  Phone Number
                </label>

                <div className="auth-input-wrapper">

                  <Phone
                    size={18}
                    className="auth-input-icon"
                  />

                  <input
                    id="authority-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />

                </div>

              </div>
            )}


            {/* Location - registration */}

            {isRegistering && (
              <div className="auth-field">

                <label htmlFor="authority-location">
                  Location
                </label>

                <div className="auth-input-wrapper">

                  <MapPin
                    size={18}
                    className="auth-input-icon"
                  />

                  <input
                    id="authority-location"
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    placeholder="Enter your location"
                    autoComplete="address-level2"
                  />

                </div>

              </div>
            )}


            {/* Password */}

            <div className="auth-field">

              <label htmlFor="authority-password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <LockKeyhole
                  size={18}
                  className="auth-input-icon"
                />

                <input
                  id="authority-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    isRegistering
                      ? "new-password"
                      : "current-password"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >

              <Building2 size={18} />

              <span>
                {loading
                  ? "Please wait..."
                  : isRegistering
                    ? "Create Authority Account"
                    : "Sign In"}
              </span>

            </button>

          </form>


          {/* Switch login / register */}

          <div className="auth-switch">

            <span>
              {isRegistering
                ? "Already have an authority account?"
                : "Don't have an authority account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {isRegistering
                ? "Sign In"
                : "Create Account"}
            </button>

          </div>


          {/* Security note */}

          <div className="auth-security">

            <ShieldAlert size={16} />

            <span>
              Your authority session is protected by
              role-based access.
            </span>

          </div>

        </div>


        {/* Footer */}

        <div className="auth-footer">
          DisasterShield AI · Predict. Warn. Evacuate. Rescue.
        </div>

      </div>
    </div>
  );
}