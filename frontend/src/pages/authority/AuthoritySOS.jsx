import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock3,
  MapPin,
  Navigation,
  Phone,
  ShieldAlert,
  Users,
} from "lucide-react";

import { getEmergencyState } from "../../services/emergencyState";

export default function AuthoritySOS() {
  const navigate = useNavigate();

  const [state, setState] = useState(getEmergencyState());
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const refreshState = () => {
      setState(getEmergencyState());
    };

    window.addEventListener(
      "disasterShieldStateChanged",
      refreshState
    );

    return () => {
      window.removeEventListener(
        "disasterShieldStateChanged",
        refreshState
      );
    };
  }, []);

  const sosList = state.citizenSOS || [];

  const activeRescues = state.rescueTeams || [];

  const filteredSOS = useMemo(() => {
    if (filter === "All") {
      return sosList;
    }

    return sosList.filter((sos) => {
      const type = String(sos.emergencyType || "").toLowerCase();

      if (filter === "Critical") {
        return (
          type.includes("trapped") ||
          type.includes("medical") ||
          type.includes("fire")
        );
      }

      if (filter === "Medical") {
        return type.includes("medical");
      }

      if (filter === "Trapped") {
        return type.includes("trapped");
      }

      if (filter === "Missing") {
        return type.includes("missing");
      }

      if (filter === "Assistance") {
        return (
          type.includes("assistance") ||
          type.includes("other")
        );
      }

      return true;
    });
  }, [filter, sosList]);

  function getRescueForSOS(sosId) {
    return activeRescues.find(
      (rescue) =>
        rescue.sosId === sosId &&
        !["RESCUED", "RESOLVED"].includes(rescue.status)
    );
  }

  function getPriority(sos) {
    const type = String(
      sos.emergencyType || ""
    ).toLowerCase();

    if (
      type.includes("trapped") ||
      type.includes("medical") ||
      type.includes("fire")
    ) {
      return "CRITICAL";
    }

    if (
      type.includes("flood") ||
      type.includes("accident") ||
      type.includes("missing")
    ) {
      return "HIGH";
    }

    return "NORMAL";
  }

  function getPriorityClass(priority) {
    if (priority === "CRITICAL") return "critical";
    if (priority === "HIGH") return "high";
    return "normal";
  }

  function formatTime(timestamp) {
    if (!timestamp) return "Just now";

    try {
      return new Date(timestamp).toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      });
    } catch {
      return "Just now";
    }
  }

  function handleAssignRescue(sos) {
    navigate(
      `/authority/rescue?sosId=${encodeURIComponent(sos.id)}`
    );
  }

  return (
    <div className="authority-sos-page">
      {/* HEADER */}

      <div className="authority-sos-header">
        <div>
          <div className="authority-sos-eyebrow">
            <ShieldAlert size={16} />
            EMERGENCY RESPONSE
          </div>

          <h1>Emergency SOS</h1>

          <p>
            Monitor citizen emergency requests and coordinate
            rescue response.
          </p>
        </div>

        <div className="authority-sos-live">
          <span className="authority-sos-live-dot" />
          LIVE SOS NETWORK
        </div>
      </div>

      {/* SUMMARY */}

      <div className="authority-sos-summary">
        <div className="authority-sos-summary-card">
          <div className="authority-sos-summary-icon total">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Total SOS</span>
            <strong>{sosList.length}</strong>
          </div>
        </div>

        <div className="authority-sos-summary-card">
          <div className="authority-sos-summary-icon critical">
            <ShieldAlert size={20} />
          </div>

          <div>
            <span>Critical</span>
            <strong>
              {
                sosList.filter(
                  (sos) =>
                    getPriority(sos) === "CRITICAL"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="authority-sos-summary-card">
          <div className="authority-sos-summary-icon active">
            <Navigation size={20} />
          </div>

          <div>
            <span>Active Rescue</span>
            <strong>
              {
                activeRescues.filter(
                  (rescue) =>
                    !["RESCUED", "RESOLVED"].includes(
                      rescue.status
                    )
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="authority-sos-summary-card">
          <div className="authority-sos-summary-icon people">
            <Users size={20} />
          </div>

          <div>
            <span>People Affected</span>
            <strong>
              {sosList.reduce(
                (total, sos) =>
                  total + Number(sos.numberOfPeople || 0),
                0
              )}
            </strong>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}

      <div className="authority-sos-filter-panel">
        <div>
          <h2>Citizen SOS Signals</h2>
          <p>
            Review emergency requests and assign available rescue
            teams.
          </p>
        </div>

        <div className="authority-sos-filters">
          {[
            "All",
            "Critical",
            "Medical",
            "Trapped",
            "Missing",
            "Assistance",
          ].map((item) => (
            <button
              key={item}
              type="button"
              className={
                filter === item ? "active" : ""
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* SOS LIST */}

      <div className="authority-sos-list">
        {filteredSOS.length === 0 ? (
          <div className="authority-sos-empty">
            <ShieldAlert size={42} />

            <h3>No SOS signals</h3>

            <p>
              Citizen emergency requests will appear here when
              submitted.
            </p>
          </div>
        ) : (
          filteredSOS.map((sos) => {
            const priority = getPriority(sos);

            const rescue = getRescueForSOS(sos.id);

            return (
              <div
                className={`authority-sos-card ${getPriorityClass(
                  priority
                )}`}
                key={sos.id}
              >
                {/* CARD TOP */}

                <div className="authority-sos-card-top">
                  <div className="authority-sos-type-wrapper">
                    <div
                      className={`authority-sos-type-icon ${getPriorityClass(
                        priority
                      )}`}
                    >
                      <AlertTriangle size={19} />
                    </div>

                    <div>
                      <span className="authority-sos-label">
                        EMERGENCY TYPE
                      </span>

                      <h3>
                        {sos.emergencyType ||
                          "Assistance Required"}
                      </h3>
                    </div>
                  </div>

                  <div className="authority-sos-badges">
                    <span
                      className={`authority-sos-priority ${getPriorityClass(
                        priority
                      )}`}
                    >
                      {priority}
                    </span>

                    {rescue && (
                      <span className="authority-sos-assigned">
                        {rescue.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* SOS INFORMATION */}

                <div className="authority-sos-information">
                  <div className="authority-sos-info-item">
                    <span>
                      <ShieldAlert size={14} />
                      SOS ID
                    </span>

                    <strong>{sos.id}</strong>
                  </div>

                  <div className="authority-sos-info-item">
                    <span>
                      <Clock3 size={14} />
                      Received
                    </span>

                    <strong>
                      {formatTime(
                        sos.createdAt ||
                          sos.submittedAt ||
                          sos.timestamp
                      )}
                    </strong>
                  </div>

                  <div className="authority-sos-info-item location">
                    <span>
                      <MapPin size={14} />
                      Current Location
                    </span>

                    <strong>
                      {sos.currentLocation ||
                        "Location unavailable"}
                    </strong>
                  </div>

                  <div className="authority-sos-info-item">
                    <span>
                      <Users size={14} />
                      People
                    </span>

                    <strong>
                      {sos.numberOfPeople || 1}
                    </strong>
                  </div>

                  <div className="authority-sos-info-item">
                    <span>
                      <AlertTriangle size={14} />
                      Injured
                    </span>

                    <strong>
                      {sos.injuredPeople || 0}
                    </strong>
                  </div>
                </div>

                {/* EXTRA INFORMATION */}

                {(sos.assistanceRequirements ||
                  sos.message) && (
                  <div className="authority-sos-extra">
                    {sos.assistanceRequirements && (
                      <div>
                        <span>
                          Assistance Requirements
                        </span>

                        <p>
                          {sos.assistanceRequirements}
                        </p>
                      </div>
                    )}

                    {sos.message && (
                      <div>
                        <span>Citizen Message</span>

                        <p>{sos.message}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* RESPONSE */}

                <div className="authority-sos-response">
                  <div className="authority-sos-response-status">
                    {rescue ? (
                      <>
                        <div className="authority-sos-response-icon assigned">
                          <Navigation size={17} />
                        </div>

                        <div>
                          <span>
                            RESCUE TEAM ASSIGNED
                          </span>

                          <strong>
                            {rescue.teamName}
                          </strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="authority-sos-response-icon pending">
                          <Clock3 size={17} />
                        </div>

                        <div>
                          <span>
                            RESPONSE STATUS
                          </span>

                          <strong>
                            Awaiting rescue team
                          </strong>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="authority-sos-actions">
                    {rescue ? (
                      <>
                        <button
                          type="button"
                          className="authority-sos-view-route"
                          onClick={() =>
                            navigate(
                              `/authority/rescue?sosId=${encodeURIComponent(
                                sos.id
                              )}`
                            )
                          }
                        >
                          <Navigation size={16} />
                          VIEW RESCUE ROUTE
                        </button>

                        <button
                          type="button"
                          className="authority-sos-call"
                          title="Contact rescue coordination"
                        >
                          <Phone size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="authority-sos-assign"
                        onClick={() =>
                          handleAssignRescue(sos)
                        }
                      >
                        <Navigation size={17} />
                        ASSIGN RESCUE TEAM
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}