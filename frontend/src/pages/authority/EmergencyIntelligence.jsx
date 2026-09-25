import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquare,
  Radio,
  Send,
  ShieldAlert,
  TrendingUp,
  X,
} from "lucide-react";

import {
  getEmergencyState,
  issueOfficialAlert,
  clearOfficialAlert,
} from "../../services/emergencyState";

function EmergencyIntelligence() {
  const [officialAlert, setOfficialAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    disasterType: "",
    location: "",
    currentRisk: "",
    predictedRisk: "",
    estimatedImpact: "",
    recommendedAction: "",
    message: "",
  });

  useEffect(() => {
    loadAlert();

    const handleStateChange = () => {
      loadAlert();
    };

    window.addEventListener(
      "disasterShieldStateChanged",
      handleStateChange
    );

    return () => {
      window.removeEventListener(
        "disasterShieldStateChanged",
        handleStateChange
      );
    };
  }, []);

  function loadAlert() {
    const state = getEmergencyState();
    setOfficialAlert(state?.officialAlert || null);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleOpenForm() {
    setShowSuccess(false);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.disasterType.trim() ||
      !form.location.trim() ||
      !form.currentRisk ||
      !form.predictedRisk ||
      !form.estimatedImpact.trim() ||
      !form.recommendedAction.trim() ||
      !form.message.trim()
    ) {
      alert("Please fill in all emergency alert fields.");
      return;
    }

    const currentRisk = Number(form.currentRisk);
    const predictedRisk = Number(form.predictedRisk);

    if (
      Number.isNaN(currentRisk) ||
      currentRisk < 0 ||
      currentRisk > 100
    ) {
      alert("Current Risk must be between 0 and 100.");
      return;
    }

    if (
      Number.isNaN(predictedRisk) ||
      predictedRisk < 0 ||
      predictedRisk > 100
    ) {
      alert("Predicted Risk must be between 0 and 100.");
      return;
    }

    const alertData = {
      disasterType: form.disasterType.trim(),
      location: form.location.trim(),
      currentRisk,
      predictedRisk,
      estimatedImpact: form.estimatedImpact.trim(),
      recommendedAction: form.recommendedAction.trim(),
      message: form.message.trim(),
    };

    const createdAlert = issueOfficialAlert(alertData);

    setOfficialAlert(createdAlert);
    setShowForm(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  }

  function handleCancelAlert() {
    const confirmed = window.confirm(
      "Are you sure you want to remove the current official emergency alert?"
    );

    if (!confirmed) return;

    clearOfficialAlert();
    setOfficialAlert(null);
    setShowSuccess(false);
  }

  function getRiskLevel(value) {
    const risk = Number(value);

    if (risk >= 90) return "PEAK RISK";
    if (risk >= 75) return "HIGH RISK";
    if (risk >= 50) return "INCREASING RISK";
    return "LOW / NORMAL";
  }

  return (
    <div className="authority-intelligence-page">
      {/* HEADER */}
      <div className="authority-intelligence-header">
        <div>
          <div className="authority-intelligence-eyebrow">
            <ShieldAlert size={16} />
            EMERGENCY COMMAND CENTER
          </div>

          <h1>Emergency Intelligence</h1>

          <p>
            Review emergency conditions and issue an official alert to
            citizens when required.
          </p>
        </div>

        <div className="authority-intelligence-live">
          <span />
          LIVE MONITORING
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="authority-intelligence-success">
          <CheckCircle2 size={20} />

          <div>
            <strong>Official alert sent successfully</strong>
            <p>
              The emergency information has been sent to the Citizen
              platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            aria-label="Close success message"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* CURRENT OFFICIAL ALERT */}
      {officialAlert && (
        <section className="authority-official-alert">
          <div className="authority-official-alert-header">
            <div className="authority-official-alert-title">
              <div className="authority-official-alert-icon">
                <Bell size={24} />
              </div>

              <div>
                <span>OFFICIAL ALERT SENT TO CITIZENS</span>
                <h2>{officialAlert.disasterType}</h2>
              </div>
            </div>

            <button
              type="button"
              className="authority-alert-cancel-btn"
              onClick={handleCancelAlert}
            >
              Remove Alert
            </button>
          </div>

          <div className="authority-official-alert-grid">
            <div>
              <span>Location</span>
              <strong>{officialAlert.location}</strong>
            </div>

            <div>
              <span>Current Risk</span>
              <strong>{officialAlert.currentRisk}%</strong>
            </div>

            <div>
              <span>Predicted Risk</span>
              <strong>{officialAlert.predictedRisk}%</strong>
            </div>

            <div>
              <span>Estimated Impact</span>
              <strong>{officialAlert.estimatedImpact}</strong>
            </div>
          </div>

          <div className="authority-official-alert-message">
            <MessageSquare size={18} />

            <div>
              <span>MESSAGE SENT TO CITIZENS</span>
              <p>{officialAlert.message}</p>
            </div>
          </div>

          <div className="authority-official-alert-action">
            <strong>Recommended Action</strong>
            <p>{officialAlert.recommendedAction}</p>
          </div>
        </section>
      )}

      {/* INTELLIGENCE SUMMARY */}
      <section className="authority-intelligence-summary">
        <div className="authority-intelligence-summary-card">
          <div className="authority-summary-icon risk">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Current Risk</span>
            <strong>
              {officialAlert
                ? `${officialAlert.currentRisk}%`
                : "No alert"}
            </strong>
          </div>
        </div>

        <div className="authority-intelligence-summary-card">
          <div className="authority-summary-icon prediction">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Predicted Risk</span>
            <strong>
              {officialAlert
                ? `${officialAlert.predictedRisk}%`
                : "No alert"}
            </strong>
          </div>
        </div>

        <div className="authority-intelligence-summary-card">
          <div className="authority-summary-icon location">
            <MapPin size={21} />
          </div>

          <div>
            <span>Affected Location</span>
            <strong>
              {officialAlert
                ? officialAlert.location
                : "Awaiting information"}
            </strong>
          </div>
        </div>

        <div className="authority-intelligence-summary-card">
          <div className="authority-summary-icon time">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Impact Estimate</span>
            <strong>
              {officialAlert
                ? officialAlert.estimatedImpact
                : "Awaiting information"}
            </strong>
          </div>
        </div>
      </section>

      {/* MAIN CONTROL */}
      {!showForm && !officialAlert && (
        <section className="authority-create-alert-card">
          <div className="authority-create-alert-icon">
            <Radio size={30} />
          </div>

          <div className="authority-create-alert-content">
            <span>AUTHORITY ACTION REQUIRED</span>

            <h2>Issue an Official Emergency Alert</h2>

            <p>
              Enter the verified emergency information below. The alert
              will not be sent to citizens until you review the information
              and submit it.
            </p>

            <button
              type="button"
              className="authority-create-alert-btn"
              onClick={handleOpenForm}
            >
              <Send size={18} />
              Create Emergency Alert
            </button>
          </div>
        </section>
      )}

      {/* EDIT / CREATE BUTTON WHEN ALERT EXISTS */}
      {!showForm && officialAlert && (
        <section className="authority-next-action-card">
          <div>
            <div className="authority-next-action-icon">
              <Radio size={22} />
            </div>

            <div>
              <span>ALERT CONTROL</span>
              <h3>Update emergency information</h3>
              <p>
                Create a new official alert when the emergency conditions
                or instructions change.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenForm}
            className="authority-create-alert-btn"
          >
            <Send size={18} />
            Issue Updated Alert
          </button>
        </section>
      )}

      {/* MANUAL ALERT FORM */}
      {showForm && (
        <section className="authority-alert-form-card">
          <div className="authority-alert-form-header">
            <div>
              <div className="authority-form-eyebrow">
                <Radio size={15} />
                MANUAL AUTHORITY INPUT
              </div>

              <h2>Emergency Alert Information</h2>

              <p>
                Enter the verified information that should be communicated
                to citizens.
              </p>
            </div>

            <button
              type="button"
              className="authority-form-close"
              onClick={handleCloseForm}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* BASIC INFORMATION */}
            <div className="authority-form-section">
              <div className="authority-form-section-title">
                <h3>Emergency Information</h3>
                <span>Required</span>
              </div>

              <div className="authority-form-grid">
                <div className="authority-form-field">
                  <label htmlFor="disasterType">
                    Disaster Type
                  </label>

                  <input
                    id="disasterType"
                    name="disasterType"
                    type="text"
                    placeholder="e.g. Flood, Cyclone, Landslide"
                    value={form.disasterType}
                    onChange={handleChange}
                  />
                </div>

                <div className="authority-form-field">
                  <label htmlFor="location">
                    Affected Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Palani North Zone"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* RISK INFORMATION */}
            <div className="authority-form-section">
              <div className="authority-form-section-title">
                <h3>Risk Information</h3>
                <span>0 - 100</span>
              </div>

              <div className="authority-form-grid authority-form-grid-three">
                <div className="authority-form-field">
                  <label htmlFor="currentRisk">
                    Current Risk
                  </label>

                  <div className="authority-input-with-suffix">
                    <input
                      id="currentRisk"
                      name="currentRisk"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0 - 100"
                      value={form.currentRisk}
                      onChange={handleChange}
                    />

                    <span>%</span>
                  </div>

                  {form.currentRisk !== "" && (
                    <small>
                      {getRiskLevel(form.currentRisk)}
                    </small>
                  )}
                </div>

                <div className="authority-form-field">
                  <label htmlFor="predictedRisk">
                    Predicted Risk
                  </label>

                  <div className="authority-input-with-suffix">
                    <input
                      id="predictedRisk"
                      name="predictedRisk"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0 - 100"
                      value={form.predictedRisk}
                      onChange={handleChange}
                    />

                    <span>%</span>
                  </div>

                  {form.predictedRisk !== "" && (
                    <small>
                      {getRiskLevel(form.predictedRisk)}
                    </small>
                  )}
                </div>

                <div className="authority-form-field">
                  <label htmlFor="estimatedImpact">
                    Estimated Time to Impact
                  </label>

                  <input
                    id="estimatedImpact"
                    name="estimatedImpact"
                    type="text"
                    placeholder="e.g. 20 minutes"
                    value={form.estimatedImpact}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* CITIZEN COMMUNICATION */}
            <div className="authority-form-section">
              <div className="authority-form-section-title">
                <h3>Citizen Communication</h3>
                <span>Required</span>
              </div>

              <div className="authority-form-field">
                <label htmlFor="recommendedAction">
                  Recommended Action
                </label>

                <textarea
                  id="recommendedAction"
                  name="recommendedAction"
                  rows="3"
                  placeholder="Tell citizens what they should do immediately..."
                  value={form.recommendedAction}
                  onChange={handleChange}
                />
              </div>

              <div className="authority-form-field">
                <label htmlFor="message">
                  Official Alert Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Write the official emergency message that citizens should receive..."
                  value={form.message}
                  onChange={handleChange}
                />

                <small className="authority-form-help">
                  This message will appear on the Citizen Dashboard and
                  Action Plan.
                </small>
              </div>
            </div>

            {/* REVIEW */}
            <div className="authority-form-review">
              <div className="authority-form-review-icon">
                <ShieldAlert size={21} />
              </div>

              <div>
                <strong>Review before sending</strong>

                <p>
                  Once submitted, this information becomes the official
                  emergency alert visible to citizens. Make sure all
                  information is verified before sending.
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="authority-form-actions">
              <button
                type="button"
                className="authority-form-cancel"
                onClick={handleCloseForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="authority-form-submit"
              >
                <Send size={18} />
                Send Official Alert
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default EmergencyIntelligence;