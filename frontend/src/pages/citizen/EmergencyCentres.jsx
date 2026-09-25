import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Navigation,
  Search,
  Hospital,
  Shield,
  Flame,
  Clock3,
  Phone,
  Route,
  X,
  LocateFixed,
  AlertCircle,
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

import "./Citizen.css";

/* =========================================================
   EMERGENCY CENTRES
========================================================= */

const EMERGENCY_CENTRES = [
  {
    id: "HOS-001",
    name: "Government Medical College Hospital",
    type: "HOSPITAL",
    location: "Asaripallam, Nagercoil",
    lat: 8.1776,
    lng: 77.4212,
    phone: "04652 223000",
    status: "OPEN",
    services: ["Emergency", "Trauma", "ICU"],
  },
  {
    id: "HOS-002",
    name: "Kanyakumari Government Hospital",
    type: "HOSPITAL",
    location: "Nagercoil",
    lat: 8.1831,
    lng: 77.4119,
    phone: "04652 222222",
    status: "OPEN",
    services: ["Emergency", "Medical Care"],
  },
  {
    id: "HOS-003",
    name: "CSI Mission Hospital",
    type: "HOSPITAL",
    location: "Nagercoil",
    lat: 8.1818,
    lng: 77.4342,
    phone: "04652 270000",
    status: "OPEN",
    services: ["Emergency", "General Care"],
  },
  {
    id: "POL-001",
    name: "Nagercoil Police Station",
    type: "POLICE",
    location: "Nagercoil",
    lat: 8.1833,
    lng: 77.4114,
    phone: "100",
    status: "OPEN",
    services: ["Police Assistance", "Emergency Response"],
  },
  {
    id: "POL-002",
    name: "Kottar Police Station",
    type: "POLICE",
    location: "Kottar, Nagercoil",
    lat: 8.1712,
    lng: 77.4311,
    phone: "100",
    status: "OPEN",
    services: ["Police Assistance", "Rescue Support"],
  },
  {
    id: "FIR-001",
    name: "Nagercoil Fire & Rescue Station",
    type: "FIRE",
    location: "Nagercoil",
    lat: 8.1845,
    lng: 77.4302,
    phone: "101",
    status: "OPEN",
    services: ["Fire Rescue", "Emergency Response"],
  },
  {
    id: "FIR-002",
    name: "Kottar Fire & Rescue Station",
    type: "FIRE",
    location: "Kottar, Nagercoil",
    lat: 8.1705,
    lng: 77.4287,
    phone: "101",
    status: "OPEN",
    services: ["Fire Rescue", "Emergency Support"],
  },
];

/* =========================================================
   MAP MARKERS
========================================================= */

const citizenIcon = L.divIcon({
  className: "citizen-centre-map-icon",
  html: `
    <div class="citizen-centre-marker citizen-centre-marker-user">
      <span>●</span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18],
});

const hospitalIcon = L.divIcon({
  className: "citizen-centre-map-icon",
  html: `
    <div class="citizen-centre-marker citizen-centre-marker-hospital">
      <span>+</span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18],
});

const policeIcon = L.divIcon({
  className: "citizen-centre-map-icon",
  html: `
    <div class="citizen-centre-marker citizen-centre-marker-police">
      <span>★</span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18],
});

const fireIcon = L.divIcon({
  className: "citizen-centre-map-icon",
  html: `
    <div class="citizen-centre-marker citizen-centre-marker-fire">
      <span>!</span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18],
});

/* =========================================================
   MAP CONTROLLER
========================================================= */

function MapController({ userLocation, centre, route }) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !centre) return;

    const points = [
      [userLocation.lat, userLocation.lng],
      [centre.lat, centre.lng],
      ...(route || []),
    ];

    const bounds = L.latLngBounds(points);

    setTimeout(() => {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      });
    }, 250);
  }, [map, userLocation, centre, route]);

  return null;
}

/* =========================================================
   DISTANCE
========================================================= */

function calculateDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

/* =========================================================
   ROAD ROUTE
========================================================= */

async function getRoadRoute(user, centre) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${user.lng},${user.lat};${centre.lng},${centre.lat}` +
      `?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Route service unavailable");
    }

    const data = await response.json();

    if (!data.routes?.length) {
      throw new Error("No route found");
    }

    const route = data.routes[0];

    return {
      coordinates: route.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng]
      ),
      distance: route.distance / 1000,
      duration: route.duration / 60,
    };
  } catch (error) {
    console.error("Route error:", error);

    return null;
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function EmergencyCentres() {
  const [activeType, setActiveType] = useState("ALL");

  const [search, setSearch] = useState("");

  const [userLocation, setUserLocation] = useState(null);

  const [locationStatus, setLocationStatus] =
    useState("idle");

  const [selectedCentre, setSelectedCentre] =
    useState(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);

  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    duration: 0,
  });

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [showMap, setShowMap] = useState(false);

  /* =======================================================
     GET USER LOCATION
  ======================================================= */

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setLocationStatus("success");
      },
      () => {
        setLocationStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  /* =======================================================
     FILTER CENTRES
  ======================================================= */

  const filteredCentres = useMemo(() => {
    return EMERGENCY_CENTRES.filter((centre) => {
      const matchesType =
        activeType === "ALL" ||
        centre.type === activeType;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        centre.name.toLowerCase().includes(query) ||
        centre.location.toLowerCase().includes(query) ||
        centre.services.some((service) =>
          service.toLowerCase().includes(query)
        );

      return matchesType && matchesSearch;
    }).map((centre) => {
      if (!userLocation) {
        return {
          ...centre,
          distance: null,
        };
      }

      return {
        ...centre,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          centre.lat,
          centre.lng
        ),
      };
    });
  }, [activeType, search, userLocation]);

  /* =======================================================
     SORT BY DISTANCE
  ======================================================= */

  const sortedCentres = useMemo(() => {
    return [...filteredCentres].sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;

      return a.distance - b.distance;
    });
  }, [filteredCentres]);

  /* =======================================================
     ICON
  ======================================================= */

  const getCentreIcon = (type) => {
    if (type === "HOSPITAL") {
      return <Hospital size={21} />;
    }

    if (type === "POLICE") {
      return <Shield size={21} />;
    }

    return <Flame size={21} />;
  };

  /* =======================================================
     START MAP
  ======================================================= */

  const handleStartMap = async (centre) => {
    setSelectedCentre(centre);
    setRouteCoordinates([]);
    setRouteInfo({
      distance: 0,
      duration: 0,
    });

    setShowMap(true);

    if (!userLocation) {
      requestLocation();
      return;
    }

    setRouteLoading(true);

    try {
      const route = await getRoadRoute(
        userLocation,
        centre
      );

      if (route) {
        setRouteCoordinates(route.coordinates);

        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
        });
      } else {
        const straightDistance =
          calculateDistance(
            userLocation.lat,
            userLocation.lng,
            centre.lat,
            centre.lng
          );

        setRouteInfo({
          distance: straightDistance,
          duration: straightDistance * 2.5,
        });
      }
    } finally {
      setRouteLoading(false);
    }
  };

  /* =======================================================
     CLOSE MAP
  ======================================================= */

  const closeMap = () => {
    setShowMap(false);
    setSelectedCentre(null);
    setRouteCoordinates([]);
  };

  /* =======================================================
     CALL CENTRE
  ======================================================= */

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="citizen-centres-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="citizen-centres-header">

        <div>

          <div className="citizen-centres-eyebrow">
            EMERGENCY SUPPORT
          </div>

          <h1>
            Emergency Centre
          </h1>

          <p>
            Find nearby hospitals, police stations and
            fire & rescue services.
          </p>

        </div>

        <button
          type="button"
          className="citizen-centres-location-button"
          onClick={requestLocation}
        >
          <LocateFixed size={17} />

          {locationStatus === "loading"
            ? "LOCATING..."
            : "USE MY LOCATION"}
        </button>

      </div>

      {/* =================================================
          LOCATION MESSAGE
      ================================================= */}

      {locationStatus === "denied" && (

        <div className="citizen-centres-location-warning">

          <AlertCircle size={18} />

          <span>
            Location access is unavailable. Enable
            location permission to calculate distance and
            road routes.
          </span>

          <button
            type="button"
            onClick={requestLocation}
          >
            TRY AGAIN
          </button>

        </div>

      )}

      {locationStatus === "success" && (

        <div className="citizen-centres-location-success">

          <LocateFixed size={16} />

          Your current location is being used to calculate
          nearby emergency services.

        </div>

      )}

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="citizen-centres-toolbar">

        <div className="citizen-centres-filters">

          {[
            ["ALL", "All"],
            ["HOSPITAL", "Hospitals"],
            ["POLICE", "Police"],
            ["FIRE", "Fire & Rescue"],
          ].map(([value, label]) => (

            <button
              key={value}
              type="button"
              className={
                activeType === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveType(value)
              }
            >
              {label}
            </button>

          ))}

        </div>

        <div className="citizen-centres-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search emergency centre..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          CENTRE LIST
      ================================================= */}

      <div className="citizen-centres-layout">

        <div className="citizen-centres-list">

          <div className="citizen-centres-list-header">

            <div>

              <h2>
                Emergency Services
              </h2>

              <span>
                {sortedCentres.length} centres available
              </span>

            </div>

            {userLocation && (
              <span className="citizen-centres-nearest">
                Sorted by distance
              </span>
            )}

          </div>

          {sortedCentres.length === 0 ? (

            <div className="citizen-centres-empty">

              <Search size={32} />

              <h3>
                No emergency centres found
              </h3>

              <p>
                Try a different search or service type.
              </p>

            </div>

          ) : (

            <div className="citizen-centres-items">

              {sortedCentres.map((centre) => (

                <article
                  key={centre.id}
                  className={`citizen-centre-card ${
                    selectedCentre?.id === centre.id
                      ? "selected"
                      : ""
                  }`}
                >

                  <div className="citizen-centre-card-main">

                    <div
                      className={`citizen-centre-icon ${
                        centre.type.toLowerCase()
                      }`}
                    >
                      {getCentreIcon(
                        centre.type
                      )}
                    </div>

                    <div className="citizen-centre-content">

                      <div className="citizen-centre-title-row">

                        <h3>
                          {centre.name}
                        </h3>

                        <span className="citizen-centre-open">
                          OPEN
                        </span>

                      </div>

                      <div className="citizen-centre-location">

                        <MapPin size={14} />

                        {centre.location}

                      </div>

                      <div className="citizen-centre-meta">

                        <span>

                          <Route size={14} />

                          {centre.distance !== null
                            ? `${centre.distance.toFixed(
                                1
                              )} km`
                            : "Distance unavailable"}

                        </span>

                        <span>

                          <Clock3 size={14} />

                          {centre.distance !== null
                            ? `${Math.max(
                                1,
                                Math.round(
                                  centre.distance * 3
                                )
                              )} min`
                            : "Time unavailable"}

                        </span>

                      </div>

                      <div className="citizen-centre-services">

                        {centre.services.map(
                          (service) => (
                            <span key={service}>
                              {service}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                  </div>

                  <div className="citizen-centre-actions">

                    <button
                      type="button"
                      className="citizen-centre-map-button"
                      onClick={() =>
                        handleStartMap(centre)
                      }
                    >
                      <Navigation size={16} />
                      START MAP
                    </button>

                    <button
                      type="button"
                      className="citizen-centre-call-button"
                      onClick={() =>
                        handleCall(centre.phone)
                      }
                      aria-label={`Call ${centre.name}`}
                    >
                      <Phone size={16} />
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

        {/* =================================================
            QUICK MAP PREVIEW
        ================================================= */}

        <div className="citizen-centres-side-map">

          <div className="citizen-centres-side-map-header">

            <div>

              <span>
                MAP
              </span>

              <strong>
                Emergency Centres
              </strong>

            </div>

            <MapPin size={19} />

          </div>

          <div className="citizen-centres-side-map-body">

            {userLocation ? (

              <MapContainer
                center={[
                  userLocation.lat,
                  userLocation.lng,
                ]}
                zoom={12}
                scrollWheelZoom={false}
                className="citizen-centres-mini-map"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[
                    userLocation.lat,
                    userLocation.lng,
                  ]}
                  icon={citizenIcon}
                >
                  <Popup>
                    Your current location
                  </Popup>
                </Marker>

                {EMERGENCY_CENTRES.map(
                  (centre) => {

                    let icon = hospitalIcon;

                    if (centre.type === "POLICE") {
                      icon = policeIcon;
                    }

                    if (centre.type === "FIRE") {
                      icon = fireIcon;
                    }

                    return (
                      <Marker
                        key={centre.id}
                        position={[
                          centre.lat,
                          centre.lng,
                        ]}
                        icon={icon}
                      >
                        <Popup>
                          <strong>
                            {centre.name}
                          </strong>

                          <br />

                          {centre.location}
                        </Popup>
                      </Marker>
                    );
                  }
                )}

              </MapContainer>

            ) : (

              <div className="citizen-centres-map-permission">

                <LocateFixed size={30} />

                <strong>
                  Location required
                </strong>

                <span>
                  Allow location access to view nearby
                  emergency services.
                </span>

                <button
                  type="button"
                  onClick={requestLocation}
                >
                  ENABLE LOCATION
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =================================================
          ROUTE MODAL / MAP
      ================================================= */}

      {showMap &&
        selectedCentre &&
        userLocation && (

          <div className="citizen-centres-route-overlay">

            <div className="citizen-centres-route-panel">

              <div className="citizen-centres-route-header">

                <div>

                  <span>
                    SAFE NAVIGATION
                  </span>

                  <h2>
                    {selectedCentre.name}
                  </h2>

                  <p>
                    {selectedCentre.location}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeMap}
                  aria-label="Close map"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="citizen-centres-route-stats">

                <div>

                  <Route size={17} />

                  <span>
                    <small>
                      DISTANCE
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

                  <Clock3 size={17} />

                  <span>
                    <small>
                      TRAVEL TIME
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

              </div>

              <div className="citizen-centres-route-map">

                {routeLoading && (

                  <div className="citizen-centres-route-loading">

                    <Navigation size={25} />

                    <strong>
                      Finding road route...
                    </strong>

                    <span>
                      Calculating a route from your
                      location to the emergency centre.
                    </span>

                  </div>

                )}

                <MapContainer
                  center={[
                    userLocation.lat,
                    userLocation.lng,
                  ]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="citizen-centres-full-map"
                >

                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapController
                    userLocation={userLocation}
                    centre={selectedCentre}
                    route={routeCoordinates}
                  />

                  {/* USER */}

                  <Marker
                    position={[
                      userLocation.lat,
                      userLocation.lng,
                    ]}
                    icon={citizenIcon}
                  >

                    <Popup>
                      <strong>
                        Your Location
                      </strong>
                    </Popup>

                  </Marker>

                  {/* CENTRE */}

                  <Marker
                    position={[
                      selectedCentre.lat,
                      selectedCentre.lng,
                    ]}
                    icon={
                      selectedCentre.type ===
                      "HOSPITAL"
                        ? hospitalIcon
                        : selectedCentre.type ===
                          "POLICE"
                        ? policeIcon
                        : fireIcon
                    }
                  >

                    <Popup>

                      <strong>
                        {selectedCentre.name}
                      </strong>

                      <br />

                      {selectedCentre.location}

                    </Popup>

                  </Marker>

                  {/* ROUTE */}

                  {routeCoordinates.length > 0 && (

                    <Polyline
                      positions={
                        routeCoordinates
                      }
                      pathOptions={{
                        color: "#16a34a",
                        weight: 6,
                        opacity: 0.9,
                      }}
                    />

                  )}

                </MapContainer>

                <div className="citizen-centres-map-legend">

                  <span>
                    <i className="user" />
                    Your Location
                  </span>

                  <span>
                    <i className="centre" />
                    Emergency Centre
                  </span>

                  <span>
                    <i className="route" />
                    Road Route
                  </span>

                </div>

              </div>

              <div className="citizen-centres-route-footer">

                <div>

                  <div className="citizen-centres-route-footer-icon">
                    {getCentreIcon(
                      selectedCentre.type
                    )}
                  </div>

                  <div>

                    <strong>
                      {selectedCentre.name}
                    </strong>

                    <span>
                      {selectedCentre.services.join(
                        " • "
                      )}
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCall(
                      selectedCentre.phone
                    )
                  }
                >
                  <Phone size={16} />
                  CALL
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}