import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  House,
  Map,
  Navigation,
  Phone,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";

import { getEmergencyState } from "../../services/emergencyState";

function ActionPlan() {
  const [officialAlert, setOfficialAlert] = useState(null);

  useEffect(() => {
    const loadAlert = () => {
      const state = getEmergencyState();
      setOfficialAlert(state?.officialAlert || null);
    };

    loadAlert();

    window.addEventListener(
      "disasterShieldStateChanged",
      loadAlert
    );

    return () => {
      window.removeEventListener(
        "disasterShieldStateChanged",
        loadAlert
      );
    };
  }, []);

  const alert = officialAlert;

  return (
    <div className="citizen-action-page">
      {/* PAGE HEADER */}
      <div className="citizen-action-header">
        <div>
          <div className="citizen-action-eyebrow">
            <ShieldCheck size={16} />
            CITIZEN SAFETY GUIDANCE
          </div>

          <h1>Action Plan</h1>

          <p>
            Know what to do right now and follow the safest recommended
            steps during an emergency.
          </p>
        </div>

        {alert && (
          <div className="citizen-action-status">
            <span className="citizen-action-status-dot" />
            Official alert active
          </div>
        )}
      </div>

      {/* NO OFFICIAL ALERT */}
      {!alert ? (
        <div className="citizen-action-safe-card">
          <div className="citizen-action-safe-icon">
            <ShieldCheck size={30} />
          </div>

          <div className="citizen-action-safe-content">
            <h2>No official emergency alert is active</h2>

            <p>
              There is currently no authority-issued emergency alert.
              Stay aware of official instructions and keep your emergency
              information ready.
            </p>

            <div className="citizen-action-prepared-grid">
              <div className="citizen-action-prepared-item">
                <CheckCircle2 size={19} />
                <span>Keep your phone charged</span>
              </div>

              <div className="citizen-action-prepared-item">
                <CheckCircle2 size={19} />
                <span>Keep emergency contacts accessible</span>
              </div>

              <div className="citizen-action-prepared-item">
                <CheckCircle2 size={19} />
                <span>Know your nearest safe shelter</span>
              </div>

              <div className="citizen-action-prepared-item">
                <CheckCircle2 size={19} />
                <span>Follow official instructions</span>
              </div>
            </div>

            <Link
              to="/citizen/shelter"
              className="citizen-action-primary-btn"
            >
              <Map size={18} />
              Check Smart Shelter
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* OFFICIAL ALERT */}
          <section className="citizen-action-alert-card">
            <div className="citizen-action-alert-top">
              <div className="citizen-action-alert-icon">
                <Siren size={26} />
              </div>

              <div className="citizen-action-alert-heading">
                <span>OFFICIAL EMERGENCY ALERT</span>
                <h2>{alert.disasterType}</h2>
              </div>
            </div>

            <div className="citizen-action-alert-grid">
              <div className="citizen-action-alert-info">
                <span>Location</span>
                <strong>{alert.location}</strong>
              </div>

              <div className="citizen-action-alert-info">
                <span>Current Risk</span>
                <strong>{alert.currentRisk}%</strong>
              </div>

              <div className="citizen-action-alert-info">
                <span>Predicted Risk</span>
                <strong>{alert.predictedRisk}%</strong>
              </div>

              <div className="citizen-action-alert-info">
                <span>Estimated Impact</span>
                <strong>{alert.estimatedImpact}</strong>
              </div>
            </div>

            <div className="citizen-action-alert-message">
              <AlertTriangle size={19} />
              <p>{alert.message}</p>
            </div>
          </section>

          {/* WHAT TO DO NOW */}
          <section className="citizen-action-section">
            <div className="citizen-action-section-title">
              <div className="citizen-action-title-icon">
                <Clock3 size={21} />
              </div>

              <div>
                <h2>What should I do right now?</h2>
                <p>
                  Follow these steps in order and use the recommended
                  safe route.
                </p>
              </div>
            </div>

            <div className="citizen-action-steps">
              <div className="citizen-action-step">
                <div className="citizen-action-step-number">01</div>

                <div className="citizen-action-step-content">
                  <h3>Stay calm and check the official alert</h3>
                  <p>
                    Read the emergency information carefully and follow
                    the recommended action issued by the Authority.
                  </p>
                </div>
              </div>

              <div className="citizen-action-step">
                <div className="citizen-action-step-number">02</div>

                <div className="citizen-action-step-content">
                  <h3>Prepare to move to a safe location</h3>
                  <p>
                    Take essential medicines, identification, water,
                    communication devices and other necessary items.
                  </p>
                </div>
              </div>

              <div className="citizen-action-step">
                <div className="citizen-action-step-number">03</div>

                <div className="citizen-action-step-content">
                  <h3>Use Smart Shelter</h3>
                  <p>
                    Find a suitable shelter based on safety, accessibility,
                    availability and route conditions.
                  </p>
                </div>
              </div>

              <div className="citizen-action-step">
                <div className="citizen-action-step-number">04</div>

                <div className="citizen-action-step-content">
                  <h3>Follow the safe route</h3>
                  <p>
                    Start navigation and avoid areas identified as unsafe
                    or inaccessible.
                  </p>
                </div>
              </div>

              <div className="citizen-action-step">
                <div className="citizen-action-step-number">05</div>

                <div className="citizen-action-step-content">
                  <h3>Reach the shelter and follow instructions</h3>
                  <p>
                    Once you reach a safe location, follow instructions
                    from emergency personnel and shelter authorities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RECOMMENDED ACTION */}
          <section className="citizen-action-recommendation">
            <div className="citizen-action-recommendation-icon">
              <Navigation size={23} />
            </div>

            <div>
              <span>RECOMMENDED ACTION</span>

              <h3>
                {alert.recommendedAction ||
                  "Move toward the recommended safe shelter."}
              </h3>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="citizen-action-section">
            <div className="citizen-action-section-title">
              <div className="citizen-action-title-icon">
                <Navigation size={21} />
              </div>

              <div>
                <h2>Take action</h2>
                <p>
                  Use the tools below to respond to the current situation.
                </p>
              </div>
            </div>

            <div className="citizen-action-tools">
              <Link
                to="/citizen/shelter"
                className="citizen-action-tool-card"
              >
                <div className="citizen-action-tool-icon shelter">
                  <House size={24} />
                </div>

                <div className="citizen-action-tool-content">
                  <h3>Find Safe Shelter</h3>
                  <p>
                    Find an available shelter and view the safest route.
                  </p>
                </div>

                <ArrowRight size={19} />
              </Link>

              <Link
                to="/citizen/sos"
                className="citizen-action-tool-card sos"
              >
                <div className="citizen-action-tool-icon emergency">
                  <Siren size={24} />
                </div>

                <div className="citizen-action-tool-content">
                  <h3>Emergency SOS</h3>
                  <p>
                    Send your emergency situation and location to the
                    Authority.
                  </p>
                </div>

                <ArrowRight size={19} />
              </Link>

              <Link
                to="/citizen/emergency-centres"
                className="citizen-action-tool-card"
              >
                <div className="citizen-action-tool-icon centre">
                  <Phone size={24} />
                </div>

                <div className="citizen-action-tool-content">
                  <h3>Emergency Centre</h3>
                  <p>
                    Find nearby hospitals, police and fire services.
                  </p>
                </div>

                <ArrowRight size={19} />
              </Link>
            </div>
          </section>

          {/* BEFORE LEAVING */}
          <section className="citizen-action-checklist">
            <div className="citizen-action-section-title">
              <div className="citizen-action-title-icon">
                <Users size={21} />
              </div>

              <div>
                <h2>Before leaving</h2>
                <p>
                  Quickly check these important things before moving.
                </p>
              </div>
            </div>

            <div className="citizen-action-check-grid">
              <div className="citizen-action-check-item">
                <CheckCircle2 size={19} />
                <span>Take essential medicines</span>
              </div>

              <div className="citizen-action-check-item">
                <CheckCircle2 size={19} />
                <span>Carry your phone and charger</span>
              </div>

              <div className="citizen-action-check-item">
                <CheckCircle2 size={19} />
                <span>Stay with your family or group</span>
              </div>

              <div className="citizen-action-check-item">
                <CheckCircle2 size={19} />
                <span>Follow official emergency instructions</span>
              </div>

              <div className="citizen-action-check-item">
                <CheckCircle2 size={19} />
                <span>Do not enter restricted areas</span>
              </div>

              <div className="citizen-action-check-item">
                <CheckCircle2 size={19} />
                <span>Ask for assistance if required</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default ActionPlan;