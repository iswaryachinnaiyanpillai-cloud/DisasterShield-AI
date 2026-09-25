import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
} from "../../services/authService";

export default function CitizenLogin() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    identifier: "",
    phone: "",
    location: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        if (!form.name.trim()) {
          setError("Please enter your full name.");
          return;
        }

        if (!form.identifier.trim()) {
          setError("Please enter your email or phone number.");
          return;
        }

        if (!form.password) {
          setError("Please create a password.");
          return;
        }

        const result = await registerUser({
          role: "citizen",
          name: form.name,
          identifier: form.identifier,
          password: form.password,
          location: form.location,
          phone: form.phone,
        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        setIsRegistering(false);

        setForm((previous) => ({
          ...previous,
          password: "",
        }));

        return;
      }

      if (!form.identifier.trim()) {
        setError("Please enter your email or phone number.");
        return;
      }

      if (!form.password) {
        setError("Please enter your password.");
        return;
      }

      const result = await loginUser({
        role: "citizen",
        identifier: form.identifier,
        password: form.password,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate("/citizen", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="citizen-auth-page">
      <div className="citizen-auth-background" />

      <div className="citizen-auth-wrapper">
        {/* Back */}
        <button
          type="button"
          className="citizen-back-button"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={18} />
          <span>Back to platform selection</span>
        </button>

        {/* Brand */}
        <div className="citizen-auth-brand">
          <div className="citizen-brand-icon">
            <ShieldAlert size={30} strokeWidth={2.2} />
          </div>

          <div className="citizen-brand-text">
            <h1>DisasterShield AI</h1>
            <p>Predict. Warn. Evacuate. Rescue.</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="citizen-auth-card">
          {/* Header */}
          <div className="citizen-auth-header">
            <div className="citizen-title-icon">
              <UserRound size={23} />
            </div>

            <div>
              <h2>
                {isRegistering
                  ? "Create Citizen Account"
                  : "Citizen Login"}
              </h2>

              <p>
                {isRegistering
                  ? "Create your account to access emergency services and safety intelligence."
                  : "Access your safety dashboard, emergency alerts and assistance services."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="citizen-auth-form"
            onSubmit={handleSubmit}
          >
            {isRegistering && (
              <>
                <div className="citizen-form-group">
                  <label htmlFor="citizen-name">
                    Full Name
                  </label>

                  <div className="citizen-input-wrapper">
                    <UserRound size={18} />

                    <input
                      id="citizen-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="citizen-form-row">
                  <div className="citizen-form-group">
                    <label htmlFor="citizen-phone">
                      Phone Number
                    </label>

                    <div className="citizen-input-wrapper">
                      <Phone size={18} />

                      <input
                        id="citizen-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="citizen-form-group">
                    <label htmlFor="citizen-location">
                      Location
                    </label>

                    <div className="citizen-input-wrapper">
                      <span className="citizen-location-icon">
                        ◎
                      </span>

                      <input
                        id="citizen-location"
                        name="location"
                        type="text"
                        placeholder="City / Area"
                        value={form.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email / Phone */}
            <div className="citizen-form-group">
              <label htmlFor="citizen-identifier">
                Email or Phone Number
              </label>

              <div className="citizen-input-wrapper">
                <Mail size={18} />

                <input
                  id="citizen-identifier"
                  name="identifier"
                  type="text"
                  placeholder="Enter your email or phone number"
                  value={form.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="citizen-form-group">
              <div className="citizen-label-row">
                <label htmlFor="citizen-password">
                  Password
                </label>

                {!isRegistering && (
                  <button
                    type="button"
                    className="citizen-forgot-button"
                    onClick={() =>
                      setError(
                        "Password recovery will be available soon."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="citizen-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="citizen-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isRegistering
                      ? "Create a password"
                      : "Enter your password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={
                    isRegistering
                      ? "new-password"
                      : "current-password"
                  }
                />

                <button
                  type="button"
                  className="citizen-password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
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

            {/* Error */}
            {error && (
              <div className="citizen-auth-message error">
                {error}
              </div>
            )}

            {/* Register success */}
            {!isRegistering && error === "" && false}

            {/* Submit */}
            <button
              type="submit"
              className="citizen-submit-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegistering
                ? "Create Citizen Account"
                : "Login as Citizen"}
            </button>
          </form>

          {/* Switch */}
          <div className="citizen-auth-switch">
            <span>
              {isRegistering
                ? "Already have a citizen account?"
                : "Don't have a citizen account?"}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsRegistering((previous) => !previous);
                setError("");
                setShowPassword(false);
              }}
            >
              {isRegistering ? "Login" : "Create Account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="citizen-auth-footer">
          <span>DisasterShield AI</span>
          <span>•</span>
          <span>Citizen Emergency Platform</span>
        </div>
      </div>
    </div>
  );
}