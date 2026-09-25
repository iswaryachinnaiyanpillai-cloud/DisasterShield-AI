const STATE_KEY =
  "disasterShieldEmergencyState";

const initialState = {
  officialAlert: null,

  citizenSOS: [],

  rescueTeams: [],

  evacuation: {
    active: false,
    peopleNotified: 0,
    evacuating: 0,
    reachedShelter: 0,
    remainingAtRisk: 0,
    assistanceRequired: 0,
    completion: 0,
  },
};

export function getEmergencyState() {
  try {
    const saved =
      localStorage.getItem(STATE_KEY);

    if (!saved) {
      return {
        ...initialState,
      };
    }

    const parsed = JSON.parse(saved);

    return {
      ...initialState,
      ...parsed,
    };
  } catch {
    return {
      ...initialState,
    };
  }
}

function saveState(state) {
  localStorage.setItem(
    STATE_KEY,
    JSON.stringify(state)
  );

  window.dispatchEvent(
    new CustomEvent(
      "disasterShieldStateChanged"
    )
  );
}

export function issueOfficialAlert(
  alertData
) {
  const state =
    getEmergencyState();

  const alert = {
    id: `ALERT-${Date.now()}`,

    issuedAt:
      new Date().toISOString(),

    disasterType:
      alertData.disasterType ||
      "Flood Risk",

    location:
      alertData.location ||
      "Affected Zone",

    currentRisk:
      alertData.currentRisk ?? 72,

    predictedRisk:
      alertData.predictedRisk ?? 87,

    estimatedImpact:
      alertData.estimatedImpact ||
      "10 minutes",

    recommendedAction:
      alertData.recommendedAction ||
      "Move toward the recommended safe shelter.",

    message:
      alertData.message ||
      "Official emergency alert issued by the Authority.",
  };

  state.officialAlert = alert;

  saveState(state);

  return alert;
}

export function clearOfficialAlert() {
  const state =
    getEmergencyState();

  state.officialAlert = null;

  saveState(state);
}

export function submitCitizenSOS(
  sosData
) {
  const state =
    getEmergencyState();

  const sos = {
    id: `SOS-${Date.now()}`,

    ...sosData,

    status: "PENDING",

    createdAt:
      new Date().toISOString(),
  };

  state.citizenSOS.unshift(sos);

  saveState(state);

  return sos;
}

export function assignRescueTeam({
  sosId,
  teamName,
}) {
  const state =
    getEmergencyState();

  const sos =
    state.citizenSOS.find(
      (item) =>
        item.id === sosId
    );

  if (!sos) {
    return null;
  }

  sos.status = "ASSIGNED";

  const rescue = {
    id: `RESCUE-${Date.now()}`,

    sosId,

    teamName:
      teamName ||
      "Rescue Team Alpha",

    status: "ASSIGNED",

    assignedAt:
      new Date().toISOString(),
  };

  state.rescueTeams.unshift(
    rescue
  );

  saveState(state);

  return rescue;
}

export function updateRescueStatus(
  rescueId,
  status
) {
  const state =
    getEmergencyState();

  const rescue =
    state.rescueTeams.find(
      (item) =>
        item.id === rescueId
    );

  if (!rescue) {
    return null;
  }

  rescue.status = status;

  const sos =
    state.citizenSOS.find(
      (item) =>
        item.id === rescue.sosId
    );

  if (sos) {
    sos.status = status;
  }

  saveState(state);

  return rescue;
}

export function startEvacuation(
  data = {}
) {
  const state =
    getEmergencyState();

  state.evacuation = {
    active: true,

    peopleNotified:
      data.peopleNotified || 0,

    evacuating:
      data.evacuation || 0,

    reachedShelter:
      data.reachedShelter || 0,

    remainingAtRisk:
      data.remainingAtRisk || 0,

    assistanceRequired:
      data.assistanceRequired || 0,

    completion:
      data.completion || 0,
  };

  saveState(state);

  return state.evacuation;
}

export function updateEvacuation(
  data
) {
  const state =
    getEmergencyState();

  state.evacuation = {
    ...state.evacuation,
    ...data,
  };

  saveState(state);

  return state.evacuation;
}