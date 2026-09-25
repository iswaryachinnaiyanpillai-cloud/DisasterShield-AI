import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Users,
  AlertTriangle,
  Clock3,
  Route,
  ShieldCheck,
  Radio,
  CheckCircle2,
  UserRoundCheck,
  Siren,
  ArrowRight,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  getEmergencyState,
  assignRescueTeam,
  updateRescueStatus,
} from "../../services/emergencyState";

import "./Authority.css";

/* =========================================================
   RESCUE TEAM MASTER DATA
========================================================= */

const RESCUE_TEAMS = [
  {
    id: "RT-001",
    name: "Alpha Rescue Unit",
    status: "AVAILABLE",
    location: "Nagercoil Central",
    lat: 8.178,
    lng: 77.432,
    members: 6,
    speciality: "Flood & General Rescue",
  },
  {
    id: "RT-002",
    name: "Bravo Emergency Team",
    status: "AVAILABLE",
    location: "Vadasery",
    lat: 8.183,
    lng: 77.430,
    members: 5,
    speciality: "Emergency Response",
  },
  {
    id: "RT-003",
    name: "Charlie Rescue Squad",
    status: "AVAILABLE",
    location: "Kottar",
    lat: 8.171,
    lng: 77.431,
    members: 7,
    speciality: "Urban Rescue",
  },
  {
    id: "RT-004",
    name: "Delta Rapid Response",
    status: "BUSY",
    location: "Parvathipuram",
    lat: 8.190,
    lng: 77.420,
    members: 6,
    speciality: "Rapid Response",
  },
  {
    id: "RT-005",
    name: "Echo Disaster Response",
    status: "AVAILABLE",
    location: "Suchindram",
    lat: 8.154,
    lng: 77.467,
    members: 5,
    speciality: "Disaster Management",
  },
  {
    id: "RT-006",
    name: "Foxtrot Medical Rescue",
    status: "AVAILABLE",
    location: "Asaripallam",
    lat: 8.177,
    lng: 77.421,
    members: 4,
    speciality: "Medical Rescue",
  },
  {
    id: "RT-007",
    name: "Guardian Rescue Team",
    status: "BUSY",
    location: "Thuckalay",
    lat: 8.252,
    lng: 77.328,
    members: 6,
    speciality: "Flood Rescue",
  },
  {
    id: "RT-008",
    name: "Horizon Emergency Unit",
    status: "AVAILABLE",
    location: "Marthandam",
    lat: 8.305,
    lng: 77.224,
    members: 5,
    speciality: "Emergency Support",
  },
];

/* =========================================================
   STATUS DEFINITIONS
========================================================= */

const WORKING_STATUSES = [
  "ASSIGNED",
  "EN ROUTE",
  "ARRIVED",
  "RESCUED",
];

const COMPLETED_STATUS = "RESOLVED";

/* =========================================================
   CUSTOM MAP MARKERS
========================================================= */

const rescueIcon = L.divIcon({
  className: "custom-map-icon",
  html: `
    <div class="rescue-marker rescue-marker-black">
      <span>●</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -20],
});

const citizenIcon = L.divIcon({
  className: "custom-map-icon",
  html: `
    <div class="rescue-marker rescue-marker-blue">
      <span>●</span>
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -20],
});

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({ team, citizen, route }) {
  const map = useMap();

  useEffect(() => {
    if (!team || !citizen) return;

    const points = [
      [team.lat, team.lng],
      [citizen.lat, citizen.lng],
      ...(route || []),
    ];

    const bounds = L.latLngBounds(points);

    setTimeout(() => {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 15,
      });
    }, 300);
  }, [map, team, citizen, route]);

  return null;
}

/* =========================================================
   GEOCODE CITIZEN LOCATION
========================================================= */

async function geocodeLocation(location) {
  if (!location) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        location
      )}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || !data.length) {
      return null;
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}

/* =========================================================
   ACTUAL ROAD ROUTE
========================================================= */

async function getRoadRoute(team, citizen) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${team.lng},${team.lat};${citizen.lng},${citizen.lat}` +
      `?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Route service unavailable");
    }

    const data = await response.json();

    if (!data.routes || !data.routes.length) {
      throw new Error("No route found");
    }

    const route = data.routes[0];

    const coordinates = route.geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );

    return {
      coordinates,
      distance: route.distance / 1000,
      duration: route.duration / 60,
    };
  } catch (error) {
    console.error("Route error:", error);

    return {
      coordinates: [],
      distance: 0,
      duration: 0,
    };
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function RescueTeam() {
  const [searchParams] = useSearchParams();

  const sosId = searchParams.get("sosId");

  const [emergencyState, setEmergencyState] = useState(
    getEmergencyState()
  );

  const [selectedSOS, setSelectedSOS] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [citizenLocation, setCitizenLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    duration: 0,
  });

  const [loadingRoute, setLoadingRoute] = useState(false);

  const [showMap, setShowMap] = useState(false);

  /* =======================================================
     REFRESH SHARED STATE
  ======================================================= */

  useEffect(() => {
    const refreshState = () => {
      setEmergencyState(getEmergencyState());
    };

    window.addEventListener(
      "disasterShieldStateChanged",
      refreshState
    );

    window.addEventListener("storage", refreshState);

    return () => {
      window.removeEventListener(
        "disasterShieldStateChanged",
        refreshState
      );

      window.removeEventListener("storage", refreshState);
    };
  }, []);

  /* =======================================================
     DATA
  ======================================================= */

  const sosList = emergencyState.citizenSOS || [];

  const rescueList = emergencyState.rescueTeams || [];

  /* =======================================================
     FIND SOS FOR RESCUE
  ======================================================= */

  const getSOSForRescue = (rescue) => {
    return sosList.find(
      (sos) => sos.id === rescue.sosId
    );
  };

  /* =======================================================
     WORKING RESCUES
  ======================================================= */

  const workingRescues = useMemo(() => {
    return rescueList.filter((rescue) =>
      WORKING_STATUSES.includes(rescue.status)
    );
  }, [rescueList]);

  /* =======================================================
     COMPLETED RESCUES
  ======================================================= */

  const completedRescues = useMemo(() => {
    return rescueList.filter(
      (rescue) => rescue.status === COMPLETED_STATUS
    );
  }, [rescueList]);

  /* =======================================================
     ALREADY ASSIGNED SOS IDS
  ======================================================= */

  const assignedSOSIds = useMemo(() => {
    return rescueList
      .filter(
        (rescue) =>
          rescue.status !== "RESOLVED"
      )
      .map((rescue) => rescue.sosId);
  }, [rescueList]);

  /* =======================================================
     PENDING SOS
  ======================================================= */

  const pendingSOS = useMemo(() => {
    return sosList.filter(
      (sos) => !assignedSOSIds.includes(sos.id)
    );
  }, [sosList, assignedSOSIds]);

  /* =======================================================
     AVAILABLE TEAMS
  ======================================================= */

  const assignedTeamNames = useMemo(() => {
    return rescueList
      .filter(
        (rescue) =>
          rescue.status !== "RESOLVED"
      )
      .map((rescue) => rescue.teamName);
  }, [rescueList]);

  const availableTeams = useMemo(() => {
    return RESCUE_TEAMS.filter(
      (team) =>
        team.status === "AVAILABLE" &&
        !assignedTeamNames.includes(team.name)
    );
  }, [assignedTeamNames]);

  const busyTeams = RESCUE_TEAMS.filter(
    (team) => team.status !== "AVAILABLE"
  );

  /* =======================================================
     AUTO SELECT
  ======================================================= */

  useEffect(() => {
    if (!sosList.length) {
      setSelectedSOS(null);
      return;
    }

    const requestedSOS = sosId
      ? sosList.find((item) => item.id === sosId)
      : null;

    if (requestedSOS) {
      setSelectedSOS(requestedSOS);
      return;
    }

    if (pendingSOS.length > 0) {
      setSelectedSOS(pendingSOS[0]);
      return;
    }

    if (workingRescues.length > 0) {
      const firstWorkingSOS = getSOSForRescue(
        workingRescues[0]
      );

      setSelectedSOS(firstWorkingSOS || null);
      return;
    }

    setSelectedSOS(sosList[0]);
  }, [
    sosId,
    sosList.length,
    pendingSOS.length,
    workingRescues.length,
  ]);

  /* =======================================================
     SELECT SOS
  ======================================================= */

  const handleSelectSOS = (sos) => {
    setSelectedSOS(sos);

    setSelectedTeam(null);

    setCitizenLocation(null);

    setRouteCoordinates([]);

    setRouteInfo({
      distance: 0,
      duration: 0,
    });

    setShowMap(false);
  };

  /* =======================================================
     SELECT EXISTING WORKING RESCUE
  ======================================================= */

  const handleSelectWorkingRescue = async (rescue) => {
    const sos = getSOSForRescue(rescue);

    const team = RESCUE_TEAMS.find(
      (item) => item.name === rescue.teamName
    );

    if (!sos || !team) return;

    setSelectedSOS(sos);
    setSelectedTeam(team);

    await buildRoute(team, sos);
  };

  /* =======================================================
     BUILD ROUTE
  ======================================================= */

  const buildRoute = async (team, sos) => {
    setLoadingRoute(true);

    try {
      let citizenCoords = null;

      /*
       * First priority:
       * GPS coordinates saved with SOS
       */

      if (
        sos.latitude !== undefined &&
        sos.longitude !== undefined
      ) {
        citizenCoords = {
          lat: Number(sos.latitude),
          lng: Number(sos.longitude),
        };
      }

      if (
        !citizenCoords &&
        sos.lat !== undefined &&
        sos.lng !== undefined
      ) {
        citizenCoords = {
          lat: Number(sos.lat),
          lng: Number(sos.lng),
        };
      }

      /*
       * Second priority:
       * Geocode text location
       */

      if (!citizenCoords) {
        citizenCoords = await geocodeLocation(
          sos.currentLocation
        );
      }

      if (!citizenCoords) {
        alert(
          "Unable to locate the citizen. Please check the SOS location."
        );

        return;
      }

      setCitizenLocation(citizenCoords);

      /*
       * Actual road route
       */

      const route = await getRoadRoute(
        team,
        citizenCoords
      );

      setRouteCoordinates(route.coordinates);

      setRouteInfo({
        distance: route.distance,
        duration: route.duration,
      });

      setShowMap(true);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to create the rescue route."
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  /* =======================================================
     START NEW RESCUE
  ======================================================= */

  const handleStartRescue = async () => {
    if (!selectedSOS || !selectedTeam) {
      return;
    }

    setLoadingRoute(true);

    try {
      /*
       * Assign the team first.
       */

      assignRescueTeam({
        sosId: selectedSOS.id,
        teamName: selectedTeam.name,
      });

      /*
       * Refresh state so assignment immediately
       * moves from Pending → Working.
       */

      setEmergencyState(getEmergencyState());

      /*
       * Find newly created rescue.
       */

      const updatedState = getEmergencyState();

      const newRescue =
        updatedState.rescueTeams?.find(
          (item) =>
            item.sosId === selectedSOS.id &&
            item.teamName === selectedTeam.name
        );

      /*
       * Immediately move to EN ROUTE.
       */

      if (newRescue) {
        updateRescueStatus(
          newRescue.id,
          "EN ROUTE"
        );
      }

      /*
       * Refresh again.
       */

      setEmergencyState(getEmergencyState());

      /*
       * Build actual route and open map.
       */

      await buildRoute(
        selectedTeam,
        selectedSOS
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to start rescue."
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  /* =======================================================
     UPDATE RESCUE STATUS
  ======================================================= */

  const handleStatusChange = (
    rescueId,
    newStatus
  ) => {
    updateRescueStatus(
      rescueId,
      newStatus
    );

    /*
     * Immediately refresh.
     *
     * This is what makes the rescue automatically
     * move between Working and Completed.
     */

    setEmergencyState(
      getEmergencyState()
    );
  };

  /* =======================================================
     STATUS BUTTON
  ======================================================= */

  const getNextStatus = (status) => {
    if (status === "ASSIGNED") {
      return "EN ROUTE";
    }

    if (status === "EN ROUTE") {
      return "ARRIVED";
    }

    if (status === "ARRIVED") {
      return "RESCUED";
    }

    if (status === "RESCUED") {
      return "RESOLVED";
    }

    return null;
  };

  const getNextStatusLabel = (status) => {
    if (status === "ASSIGNED") {
      return "START ROUTE";
    }

    if (status === "EN ROUTE") {
      return "MARK ARRIVED";
    }

    if (status === "ARRIVED") {
      return "MARK RESCUED";
    }

    if (status === "RESCUED") {
      return "RESOLVE";
    }

    return "";
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!sosList.length) {
    return (
      <div className="authority-rescue-page">

        <div className="authority-rescue-empty">

          <AlertTriangle size={46} />

          <h2>No Citizen SOS Found</h2>

          <p>
            Citizen emergency requests will appear here
            when an SOS is sent to the Authority.
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="authority-rescue-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="authority-rescue-header">

        <div>

          <div className="authority-rescue-eyebrow">
            <Radio size={15} />
            RESCUE OPERATIONS
          </div>

          <h1>Rescue Team</h1>

          <p>
            Manage pending, active and completed rescue
            operations.
          </p>

        </div>

        <div className="authority-rescue-live">

          <span className="authority-rescue-live-dot" />

          LIVE RESPONSE

        </div>

      </div>

      {/* =================================================
          PENDING SOS
      ================================================= */}

      <section className="authority-rescue-card">

        <div className="authority-rescue-card-header">

          <div>

            <h2>
              Pending Rescue Requests
            </h2>

            <p>
              New citizen SOS requests waiting for a
              rescue team.
            </p>

          </div>

          <div className="authority-rescue-count">
            {pendingSOS.length} PENDING
          </div>

        </div>

        {pendingSOS.length === 0 ? (

          <div className="authority-rescue-no-items">

            <CheckCircle2 size={24} />

            <span>
              No pending rescue requests.
            </span>

          </div>

        ) : (

          <div className="authority-rescue-sos-grid">

            {pendingSOS.map((sos) => (

              <button
                key={sos.id}
                type="button"
                className={`authority-rescue-sos ${
                  selectedSOS?.id === sos.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleSelectSOS(sos)
                }
              >

                <div className="authority-rescue-sos-top">

                  <span className="authority-rescue-sos-type">
                    {sos.emergencyType}
                  </span>

                  <span className="authority-rescue-priority">
                    {sos.priority || "HIGH"}
                  </span>

                </div>

                <strong>
                  {sos.message ||
                    "Emergency assistance required"}
                </strong>

                <div className="authority-rescue-sos-location">

                  <MapPin size={15} />

                  {sos.currentLocation ||
                    "Location unavailable"}

                </div>

                <div className="authority-rescue-sos-meta">

                  <span>
                    <Users size={14} />
                    {sos.numberOfPeople || 1}
                    {" "}people
                  </span>

                  <span>
                    Injured:{" "}
                    {sos.injuredPeople || 0}
                  </span>

                </div>

              </button>

            ))}

          </div>

        )}

      </section>

      {/* =================================================
          WORKING RESCUES
      ================================================= */}

      <section className="authority-rescue-card">

        <div className="authority-rescue-card-header">

          <div>

            <h2>
              Working Rescues
            </h2>

            <p>
              Assigned rescue teams currently handling
              citizen emergencies.
            </p>

          </div>

          <div className="authority-rescue-working-count">
            {workingRescues.length} WORKING
          </div>

        </div>

        {workingRescues.length === 0 ? (

          <div className="authority-rescue-no-items">

            <Clock3 size={24} />

            <span>
              No rescue operations are currently active.
            </span>

          </div>

        ) : (

          <div className="authority-rescue-working-list">

            {workingRescues.map((rescue) => {

              const sos =
                getSOSForRescue(rescue);

              const team =
                RESCUE_TEAMS.find(
                  (item) =>
                    item.name ===
                    rescue.teamName
                );

              const nextStatus =
                getNextStatus(
                  rescue.status
                );

              return (
                <div
                  key={rescue.id}
                  className="authority-rescue-working-item"
                >

                  <div className="working-team-icon">
                    <ShieldCheck size={22} />
                  </div>

                  <div className="working-rescue-info">

                    <div className="working-rescue-title">

                      <strong>
                        {rescue.teamName}
                      </strong>

                      <span className="working-status">
                        {rescue.status}
                      </span>

                    </div>

                    <div className="working-rescue-details">

                      <span>
                        <Siren size={14} />

                        {sos?.emergencyType ||
                          "Emergency"}
                      </span>

                      <span>
                        <MapPin size={14} />

                        {sos?.currentLocation ||
                          "Citizen location"}
                      </span>

                    </div>

                  </div>

                  <div className="working-rescue-actions">

                    <button
                      type="button"
                      className="view-route-button"
                      onClick={() =>
                        handleSelectWorkingRescue(
                          rescue
                        )
                      }
                    >
                      <Route size={15} />
                      VIEW ROUTE
                    </button>

                    {nextStatus && (
                      <button
                        type="button"
                        className="status-action-button"
                        onClick={() =>
                          handleStatusChange(
                            rescue.id,
                            nextStatus
                          )
                        }
                      >
                        {getNextStatusLabel(
                          rescue.status
                        )}

                        <ArrowRight
                          size={15}
                        />
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

      {/* =================================================
          SELECT TEAM FOR PENDING SOS
      ================================================= */}

      {pendingSOS.length > 0 && (
        <section className="authority-rescue-card">

          <div className="authority-rescue-card-header">

            <div>

              <h2>
                Assign Rescue Team
              </h2>

              <p>
                Select an available team for the selected
                emergency.
              </p>

            </div>

            <div className="authority-rescue-available">
              {availableTeams.length} AVAILABLE
            </div>

          </div>

          <div className="authority-rescue-team-grid">

            {availableTeams.map((team) => (

              <button
                key={team.id}
                type="button"
                className={`authority-rescue-team ${
                  selectedTeam?.id === team.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedTeam(team)
                }
              >

                <div className="authority-rescue-team-icon">

                  <ShieldCheck size={22} />

                </div>

                <div className="authority-rescue-team-content">

                  <div className="authority-rescue-team-title">

                    <strong>
                      {team.name}
                    </strong>

                    <span className="authority-rescue-status available">
                      AVAILABLE
                    </span>

                  </div>

                  <div className="authority-rescue-team-info">

                    <span>
                      <MapPin size={14} />
                      {team.location}
                    </span>

                    <span>
                      <Users size={14} />
                      {team.members} members
                    </span>

                  </div>

                  <small>
                    {team.speciality}
                  </small>

                </div>

              </button>

            ))}

          </div>

          {/* BUSY TEAMS */}

          <div className="authority-rescue-busy-section">

            <div className="authority-rescue-busy-title">

              <Clock3 size={17} />

              BUSY TEAMS

            </div>

            <div className="authority-rescue-busy-list">

              {busyTeams.map((team) => (

                <div
                  key={team.id}
                  className="authority-rescue-busy-team"
                >

                  <strong>
                    {team.name}
                  </strong>

                  <span>
                    {team.location}
                  </span>

                  <em>
                    BUSY
                  </em>

                </div>

              ))}

            </div>

          </div>

          {/* START RESCUE */}

          <div className="authority-rescue-action">

            <div className="authority-rescue-selection">

              <span>
                Selected team
              </span>

              <strong>
                {selectedTeam
                  ? selectedTeam.name
                  : "Select an available team"}
              </strong>

            </div>

            <button
              type="button"
              className="authority-rescue-start"
              disabled={
                !selectedTeam ||
                !selectedSOS ||
                loadingRoute
              }
              onClick={
                handleStartRescue
              }
            >

              <Navigation size={20} />

              {loadingRoute
                ? "STARTING RESCUE..."
                : "START RESCUE"}

            </button>

          </div>

        </section>
      )}

      {/* =================================================
          MAP
      ================================================= */}

      {showMap &&
        selectedTeam &&
        citizenLocation && (

          <section className="authority-rescue-card authority-rescue-map-card">

            <div className="authority-rescue-map-header">

              <div>

                <div className="authority-rescue-map-title">

                  <Route size={20} />

                  RESCUE ROUTE

                </div>

                <h2>

                  {selectedTeam.name}
                  {" → "}
                  Citizen SOS

                </h2>

                <p>
                  Rescue team route to the citizen
                  emergency location.
                </p>

              </div>

              <div className="authority-rescue-enroute">

                <span />

                {(() => {

                  const activeRescue =
                    rescueList.find(
                      (item) =>
                        item.sosId ===
                          selectedSOS?.id &&
                        item.teamName ===
                          selectedTeam?.name
                    );

                  return (
                    activeRescue?.status ||
                    "EN ROUTE"
                  );

                })()}

              </div>

            </div>

            {/* ROUTE STATS */}

            <div className="authority-rescue-route-stats">

              <div>

                <Route size={18} />

                <span>

                  <small>
                    ROAD DISTANCE
                  </small>

                  <strong>

                    {routeInfo.distance
                      ? `${routeInfo.distance.toFixed(
                          2
                        )} km`
                      : "Calculating..."}

                  </strong>

                </span>

              </div>

              <div>

                <Clock3 size={18} />

                <span>

                  <small>
                    ESTIMATED TIME
                  </small>

                  <strong>

                    {routeInfo.duration
                      ? `${Math.round(
                          routeInfo.duration
                        )} min`
                      : "Calculating..."}

                  </strong>

                </span>

              </div>

              <div>

                <Navigation size={18} />

                <span>

                  <small>
                    RESPONSE STATUS
                  </small>

                  <strong>

                    {(() => {

                      const activeRescue =
                        rescueList.find(
                          (item) =>
                            item.sosId ===
                              selectedSOS?.id &&
                            item.teamName ===
                              selectedTeam?.name
                        );

                      return (
                        activeRescue?.status ||
                        "EN ROUTE"
                      );

                    })()}

                  </strong>

                </span>

              </div>

            </div>

            {/* MAP */}

            <div className="authority-rescue-map-wrapper">

              <MapContainer
                center={[
                  selectedTeam.lat,
                  selectedTeam.lng,
                ]}
                zoom={13}
                scrollWheelZoom={true}
                className="authority-rescue-leaflet-map"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                  team={selectedTeam}
                  citizen={citizenLocation}
                  route={routeCoordinates}
                />

                {/* BLACK RESCUE TEAM */}

                <Marker
                  position={[
                    selectedTeam.lat,
                    selectedTeam.lng,
                  ]}
                  icon={rescueIcon}
                >

                  <Popup>

                    <strong>
                      {selectedTeam.name}
                    </strong>

                    <br />

                    Rescue Team

                    <br />

                    Status: EN ROUTE

                  </Popup>

                </Marker>

                {/* BLUE CITIZEN */}

                <Marker
                  position={[
                    citizenLocation.lat,
                    citizenLocation.lng,
                  ]}
                  icon={citizenIcon}
                >

                  <Popup>

                    <strong>
                      Citizen SOS
                    </strong>

                    <br />

                    {selectedSOS.currentLocation ||
                      "Emergency location"}

                  </Popup>

                </Marker>

                {/* GREEN ROAD ROUTE */}

                {routeCoordinates.length > 0 && (

                  <Polyline
                    positions={
                      routeCoordinates
                    }
                    pathOptions={{
                      color: "#16a34a",
                      weight: 7,
                      opacity: 0.9,
                    }}
                  />

                )}

              </MapContainer>

              {/* MAP LEGEND */}

              <div className="authority-rescue-map-legend">

                <div>
                  <span className="legend-dot black" />
                  Rescue Team
                </div>

                <div>
                  <span className="legend-dot blue" />
                  Citizen SOS
                </div>

                <div>
                  <span className="legend-line green" />
                  Road Route
                </div>

              </div>

            </div>

            {/* ROUTE DETAILS */}

            <div className="authority-rescue-route-details">

              <div>

                <MapPin size={18} />

                <span>

                  <small>
                    RESCUE TEAM LOCATION
                  </small>

                  <strong>
                    {selectedTeam.location}
                  </strong>

                </span>

              </div>

              <div>

                <MapPin size={18} />

                <span>

                  <small>
                    CITIZEN LOCATION
                  </small>

                  <strong>
                    {selectedSOS.currentLocation ||
                      "Location identified"}
                  </strong>

                </span>

              </div>

            </div>

          </section>

        )}

      {/* =================================================
          COMPLETED RESCUES
      ================================================= */}

      <section className="authority-rescue-card">

        <div className="authority-rescue-card-header">

          <div>

            <h2>
              Completed Rescues
            </h2>

            <p>
              Rescue operations that have been fully
              resolved.
            </p>

          </div>

          <div className="authority-rescue-completed-count">
            {completedRescues.length} COMPLETED
          </div>

        </div>

        {completedRescues.length === 0 ? (

          <div className="authority-rescue-no-items">

            <CheckCircle2 size={24} />

            <span>
              No completed rescue operations yet.
            </span>

          </div>

        ) : (

          <div className="authority-rescue-completed-list">

            {completedRescues.map((rescue) => {

              const sos =
                getSOSForRescue(rescue);

              return (

                <div
                  key={rescue.id}
                  className="authority-rescue-completed-item"
                >

                  <div className="completed-icon">

                    <CheckCircle2 size={21} />

                  </div>

                  <div>

                    <strong>
                      {rescue.teamName}
                    </strong>

                    <span>

                      {sos?.emergencyType ||
                        "Emergency"}

                      {" • "}

                      {sos?.currentLocation ||
                        "Location unavailable"}

                    </span>

                  </div>

                  <div className="completed-status">
                    RESOLVED
                  </div>

                </div>

              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}