import { useEffect, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  MapPinned,
  ClipboardList,
  Siren,
  CheckCircle2,
  Clock3,
  Navigation,
  Wifi,
  WifiOff,
  ArrowRight,
} from "lucide-react";

import {
  getEmergencyState,
} from "../../services/emergencyState";

import "./Citizen.css";

export default function CitizenDashboard() {
  const [emergencyState, setEmergencyState] = useState(
    getEmergencyState()
  );

  // =========================================
  // ONLINE / OFFLINE STATUS
  // =========================================

  const [isOnline, setIsOnline] = useState(
    navigator.onLine
  );

  useEffect(() => {
    const refresh = () => {
      setEmergencyState(getEmergencyState());
    };

    window.addEventListener(
      "disasterShieldStateChanged",
      refresh
    );

    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(
        "disasterShieldStateChanged",
        refresh
      );

      window.removeEventListener(
        "storage",
        refresh
      );
    };
  }, []);

  // =========================================
  // DETECT INTERNET CONNECTION
  // =========================================

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  const alert = emergencyState?.officialAlert;

  return (
    <div className="citizen-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="citizen-page-header">
        <div>
          <div className="citizen-eyebrow">
            <ShieldCheck size={18} />
            CITIZEN SAFETY PLATFORM
          </div>

          <h1>Safety Dashboard</h1>

          <p>
            Stay informed, follow verified emergency
            guidance and reach safety when required.
          </p>
        </div>

        {/* =========================================
            SAFETY STATUS
            ========================================= */}

        <div className="citizen-status-card">
          <CheckCircle2 size={21} />

          <div>
            <span>SAFETY STATUS</span>

            <strong>
              {alert
                ? "Emergency Alert Active"
                : "Monitoring Active"}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================================
          ONLINE / OFFLINE MODE CARD
          ========================================= */}

      <section
        className={
          isOnline
            ? "citizen-connectivity-card online"
            : "citizen-connectivity-card offline"
        }
      >
        <div className="citizen-connectivity-icon">
          {isOnline ? (
            <Wifi size={26} />
          ) : (
            <WifiOff size={26} />
          )}
        </div>

        <div className="citizen-connectivity-content">
          <span className="citizen-card-label">
            CONNECTIVITY STATUS
          </span>

          <h2>
            {isOnline
              ? "Online Mode"
              : "Offline Mode"}
          </h2>

          <p>
            {isOnline
              ? "Internet connection is available. You can use the normal Citizen Platform and live services."
              : "No internet connection detected. You can access the dedicated Offline Dashboard and cached emergency information."}
          </p>
        </div>

        {/* =========================================
            OFFLINE DASHBOARD BUTTON
            ========================================= */}

        {!isOnline && (
          <a
            href="/citizen/offline"
            className="citizen-offline-dashboard-btn"
          >
            <span>
              Open Offline Dashboard
            </span>

            <ArrowRight size={18} />
          </a>
        )}
      </section>

      {/* =========================================
          NORMAL ONLINE / EMERGENCY CONTENT
          ========================================= */}

      {!alert ? (
        <section className="citizen-safe-card">
          <div className="citizen-safe-icon">
            <ShieldCheck size={30} />
          </div>

          <div>
            <span className="citizen-card-label">
              CURRENT STATUS
            </span>

            <h2>
              No Official Emergency Alert
            </h2>

            <p>
              There is currently no official emergency
              alert issued by the Authority.
            </p>
          </div>
        </section>
      ) : (
        <section className="citizen-emergency-card">
          <div className="citizen-emergency-header">
            <div className="citizen-emergency-title">
              <div className="citizen-emergency-icon">
                <AlertTriangle size={24} />
              </div>

              <div>
                <span>
                  OFFICIAL EMERGENCY ALERT
                </span>

                <h2>
                  {alert.disasterType}
                </h2>
              </div>
            </div>

            <div className="citizen-active-badge">
              ACTIVE
            </div>
          </div>

          <div className="citizen-alert-grid">
            <div>
              <span>LOCATION</span>
              <strong>
                {alert.location}
              </strong>
            </div>

            <div>
              <span>CURRENT RISK</span>
              <strong>
                {alert.currentRisk}/100
              </strong>
            </div>

            <div>
              <span>PREDICTED RISK</span>
              <strong>
                {alert.predictedRisk}/100
              </strong>
            </div>

            <div>
              <span>ESTIMATED IMPACT</span>
              <strong>
                {alert.estimatedImpact}
              </strong>
            </div>
          </div>

          <div className="citizen-alert-message">
            <AlertTriangle size={19} />

            <p>
              {alert.message}
            </p>
          </div>

          <div className="citizen-recommended-action">
            <Clock3 size={19} />

            <div>
              <strong>
                Recommended Action
              </strong>

              <p>
                {alert.recommendedAction}
              </p>
            </div>
          </div>

          <div className="citizen-alert-actions">
            <a
              href="/citizen/shelter"
              className="citizen-primary-btn"
            >
              <Navigation size={18} />
              Start Safe Navigation
            </a>

            <a
              href="/citizen/shelter"
              className="citizen-secondary-btn"
            >
              <MapPinned size={18} />
              View Shelter
            </a>

            <a
              href="/citizen/action-plan"
              className="citizen-secondary-btn"
            >
              <ClipboardList size={18} />
              View Action Plan
            </a>

            <a
              href="/citizen/sos"
              className="citizen-danger-btn"
            >
              <Siren size={18} />
              Emergency SOS
            </a>
          </div>
        </section>
      )}

      {/* =========================================
          EXISTING FEATURE CARDS
          ========================================= */}

      <div className="citizen-feature-grid">
        <a
          href="/citizen/shelter"
          className="citizen-feature-card"
        >
          <MapPinned size={25} />

          <div>
            <h3>
              Smart Shelter
            </h3>

            <p>
              Find a suitable safe shelter using your
              current location and safety conditions.
            </p>
          </div>
        </a>

        <a
          href="/citizen/action-plan"
          className="citizen-feature-card"
        >
          <ClipboardList size={25} />

          <div>
            <h3>
              Action Plan
            </h3>

            <p>
              Follow the recommended steps for your
              current emergency situation.
            </p>
          </div>
        </a>

        <a
          href="/citizen/sos"
          className="citizen-feature-card danger"
        >
          <Siren size={25} />

          <div>
            <h3>
              Emergency SOS
            </h3>

            <p>
              Send your emergency details directly to
              the Authority response team.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}