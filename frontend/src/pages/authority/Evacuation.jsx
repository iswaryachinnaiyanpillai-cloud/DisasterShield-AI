import { useEffect, useState } from "react";

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

  const canStart =
    Boolean(state?.officialAlert) &&
    (state?.citizenSOS?.length || 0) > 0;

  function handleStart() {
    if (!canStart) {
      window.alert(
        "Evacuation can begin after an official alert and citizen emergency response."
      );
      return;
    }

    startEvacuation({
      peopleNotified: 100,
      evacuation: 0,
      reachedShelter: 0,
      remainingAtRisk: 100,
      assistanceRequired: 0,
      completion: 0,
    });

    setState(getEmergencyState());
  }

  function increaseEvacuating() {
    const next = Math.min(
      (evacuation.evacuating || 0) + 10,
      evacuation.peopleNotified || 100
    );

    const remaining = Math.max(
      (evacuation.remainingAtRisk || 0) - 10,
      0
    );

    const reached = Math.min(
      (evacuation.reachedShelter || 0) + 5,
      evacuation.peopleNotified || 100
    );

    const completion = Math.round(
      (reached /
        Math.max(
          evacuation.peopleNotified || 1,
          1
        )) *
        100
    );

    updateEvacuation({
      evacuating: next,
      remainingAtRisk: remaining,
      reachedShelter: reached,
      completion,
    });

    setState(getEmergencyState());
  }

  return (
    <div className="authority-page">
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

      {!evacuation.active ? (
        <div className="evacuation-standby">
          <Route size={44} />

          <h3>Evacuation operation not active</h3>

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
          <div className="evacuation-progress-card">
            <div>
              <span>COMPLETION</span>

              <strong>
                {evacuation.completion || 0}%
              </strong>
            </div>

            <div className="progress-large">
              <div
                style={{
                  width: `${
                    evacuation.completion || 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="response-grid">
            <div className="response-card">
              <Users size={22} />
              <span>People Notified</span>
              <strong>
                {evacuation.peopleNotified || 0}
              </strong>
            </div>

            <div className="response-card">
              <Route size={22} />
              <span>Evacuating</span>
              <strong>
                {evacuation.evacuating || 0}
              </strong>
            </div>

            <div className="response-card">
              <CheckCircle2 size={22} />
              <span>Reached Shelter</span>
              <strong>
                {evacuation.reachedShelter || 0}
              </strong>
            </div>

            <div className="response-card">
              <AlertTriangle size={22} />
              <span>Remaining at Risk</span>
              <strong>
                {evacuation.remainingAtRisk || 0}
              </strong>
            </div>
          </div>

          <button
            className="primary-authority-button"
            onClick={increaseEvacuating}
          >
            Update Evacuation Progress
          </button>
        </>
      )}
    </div>
  );
}

export default Evacuation;