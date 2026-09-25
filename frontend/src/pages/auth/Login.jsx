import { ShieldAlert, UserRound, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-background" />

      <div className="login-container">
        <div className="login-brand">
          <div className="brand-icon">
            <ShieldAlert size={32} />
          </div>

          <div>
            <h1>DisasterShield AI</h1>
            <p>Predict. Warn. Evacuate. Rescue.</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome to DisasterShield AI</h2>

            <p>
              Select your platform to continue.
            </p>
          </div>

          <div className="role-options">
            <button
              className="role-card"
              onClick={() => navigate("/login/citizen")}
            >
              <div className="role-icon citizen-icon">
                <UserRound size={28} />
              </div>

              <div className="role-content">
                <h3>Citizen</h3>

                <p>
                  Check safety status, receive emergency
                  alerts, find safe shelters and request
                  emergency assistance.
                </p>
              </div>

              <span className="role-arrow">→</span>
            </button>

            <button
              className="role-card"
              onClick={() => navigate("/login/authority")}
            >
              <div className="role-icon authority-icon">
                <Building2 size={28} />
              </div>

              <div className="role-content">
                <h3>Authority</h3>

                <p>
                  Monitor disaster intelligence, review
                  predictions, issue official alerts and
                  coordinate emergency response.
                </p>
              </div>

              <span className="role-arrow">→</span>
            </button>
          </div>
        </div>

        <div className="login-footer">
          DisasterShield AI · Emergency Intelligence Platform
        </div>
      </div>
    </div>
  );
}