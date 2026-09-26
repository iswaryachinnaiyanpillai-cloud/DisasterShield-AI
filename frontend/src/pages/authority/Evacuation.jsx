import { useState } from "react";

import {
  Route,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import {
  getEmergencyState,
  startEvacuation,
  updateEvacuation,
} from "../../services/emergencyState";

function Evacuation() {
  const [state, setState] = useState(
    getEmergencyState()
  );

  const evacuation = state?.evacuation || {};

  const [formData, setFormData] = useState({
    peopleNotified:
      evacuation.peopleNotified ?? "",

    evacuating:
      evacuation.evacuating ?? "",

    reachedShelter:
      evacuation.reachedShelter ?? "",

    remainingAtRisk:
      evacuation.remainingAtRisk ?? "",
  });

  const canStart =
    Boolean(state?.officialAlert) &&
    (state?.citizenSOS?.length || 0) > 0;

  // =========================================
  // START EVACUATION
  // =========================================

  function handleStart() {
    if (!canStart) {
      window.alert(
        "Evacuation can begin after an official alert and citizen emergency response."
      );
      return;
    }

    // Initially all evacuation values are empty.
    // Authority must enter the actual values manually.
    startEvacuation({
      peopleNotified: null,
      evacuating: null,
      reachedShelter: null,
      remainingAtRisk: null,
      assistanceRequired: null,
      completion: 0,
    });

    setState(getEmergencyState());

    setFormData({
      peopleNotified: "",
      evacuating: "",
      reachedShelter: "",
      remainingAtRisk: "",
    });
  }

  // =========================================
  // UPDATE EVACUATION PROGRESS
  // =========================================

  function handleUpdateProgress() {
    // Do not allow empty values to be saved as 0.
    if (
      formData.peopleNotified === "" ||
      formData.evacuating === "" ||
      formData.reachedShelter === "" ||
      formData.remainingAtRisk === ""
    ) {
      window.alert(
        "Please enter all evacuation values before updating."
      );
      return;
    }

    const peopleNotified = Math.max(
      0,
      Number(formData.peopleNotified) || 0
    );

    const evacuating = Math.max(
      0,
      Number(formData.evacuating) || 0
    );

    const reachedShelter = Math.max(
      0,
      Number(formData.reachedShelter) || 0
    );

    const remainingAtRisk = Math.max(
      0,
      Number(formData.remainingAtRisk) || 0
    );

    // =========================================
    // VALIDATION
    // =========================================

    if (evacuating > peopleNotified) {
      window.alert(
        "Evacuating cannot be greater than People Notified."
      );
      return;
    }

    if (reachedShelter > peopleNotified) {
      window.alert(
        "Reached Shelter cannot be greater than People Notified."
      );
      return;
    }

    if (remainingAtRisk > peopleNotified) {
      window.alert(
        "Remaining at Risk cannot be greater than People Notified."
      );
      return;
    }

    // =========================================
    // COMPLETION
    // =========================================

    const completion =
      peopleNotified > 0
        ? Math.round(
            (reachedShelter /
              peopleNotified) *
              100
          )
        : 0;

    // =========================================
    // SAVE EXACT AUTHORITY-ENTERED VALUES
    // =========================================

    updateEvacuation({
      peopleNotified,
      evacuating,
      reachedShelter,
      remainingAtRisk,
      completion,
    });

    setState(getEmergencyState());

    setFormData({
      peopleNotified,
      evacuating,
      reachedShelter,
      remainingAtRisk,
    });

    window.alert(
      "Evacuation progress updated successfully."
    );
  }

  // =========================================
  // HANDLE INPUT CHANGES
  // =========================================

  function handleInputChange(
    field,
    value
  ) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  return (
    <div className="authority-page">
      {/* =========================================
          HEADER
          ========================================= */}

      <div className="authority-topbar">
        <div>
          <div className="authority-eyebrow">
            EVACUATION OPERATIONS
          </div>

          <h2>Evacuation</h2>

          <p>
            Monitor citizen movement from affected
            areas toward designated shelters.
          </p>
        </div>
      </div>

      {/* =========================================
          EVACUATION NOT ACTIVE
          ========================================= */}

      {!evacuation.active ? (
        <div className="evacuation-standby">
          <Route size={44} />

          <h3>
            Evacuation operation not active
          </h3>

          <p>
            Evacuation is activated only after an
            official emergency alert and citizen
            emergency response.
          </p>

          <button
            className="primary-authority-button"
            onClick={handleStart}
          >
            Start Evacuation Operation
          </button>
        </div>
      ) : (
        <>
          {/* =========================================
              COMPLETION
              ========================================= */}

          <div className="evacuation-progress-card">
            <div>
              <span>COMPLETION</span>

              <strong>
                {evacuation.completion ?? 0}%
              </strong>
            </div>

            <div className="progress-large">
              <div
                style={{
                  width: `${
                    evacuation.completion ?? 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* =========================================
              EVACUATION DATA
              ========================================= */}

          <div className="response-grid">

            {/* =======================================
                PEOPLE NOTIFIED
                ======================================= */}

            <div className="response-card">
              <Users size={22} />

              <span>
                People Notified
              </span>

              <input
                type="number"
                min="0"
                placeholder="Enter value"
                value={
                  formData.peopleNotified
                }
                onChange={(event) =>
                  handleInputChange(
                    "peopleNotified",
                    event.target.value
                  )
                }
              />
            </div>

            {/* =======================================
                EVACUATING
                ======================================= */}

            <div className="response-card">
              <Route size={22} />

              <span>
                Evacuating
              </span>

              <input
                type="number"
                min="0"
                placeholder="Enter value"
                value={
                  formData.evacuating
                }
                onChange={(event) =>
                  handleInputChange(
                    "evacuating",
                    event.target.value
                  )
                }
              />
            </div>

            {/* =======================================
                REACHED SHELTER
                ======================================= */}

            <div className="response-card">
              <CheckCircle2 size={22} />

              <span>
                Reached Shelter
              </span>

              <input
                type="number"
                min="0"
                placeholder="Enter value"
                value={
                  formData.reachedShelter
                }
                onChange={(event) =>
                  handleInputChange(
                    "reachedShelter",
                    event.target.value
                  )
                }
              />
            </div>

            {/* =======================================
                REMAINING AT RISK
                ======================================= */}

            <div className="response-card">
              <AlertTriangle size={22} />

              <span>
                Remaining at Risk
              </span>

              <input
                type="number"
                min="0"
                placeholder="Enter value"
                value={
                  formData.remainingAtRisk
                }
                onChange={(event) =>
                  handleInputChange(
                    "remainingAtRisk",
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          {/* =========================================
              UPDATE BUTTON
              ========================================= */}

          <button
            className="primary-authority-button"
            onClick={
              handleUpdateProgress
            }
          >
            Update Evacuation Progress
          </button>
        </>
      )}
    </div>
  );
}

export default Evacuation;