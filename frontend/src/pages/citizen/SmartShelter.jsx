import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapPin,
  Navigation,
  LocateFixed,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  Users,
  Accessibility,
  Route,
  Loader2,
  X,
} from "lucide-react";

/* =========================================================
   DEFAULT MAP CENTER
   ========================================================= */

const DEFAULT_CENTER = [8.0883, 77.5385];

/* =========================================================
   SHELTER DATA
   ========================================================= */

const shelterData = [
  {
    id: 1,
    name: "Community Safe Shelter",
    description:
      "Emergency shelter with essential facilities",
    latOffset: 0.012,
    lngOffset: 0.008,
    capacity: 250,
    available: 82,
    accessibility: true,
    medical: true,
    food: true,
    water: true,
  },

  {
    id: 2,
    name: "Government Relief Centre",
    description:
      "Government-managed emergency shelter",
    latOffset: -0.009,
    lngOffset: 0.014,
    capacity: 400,
    available: 145,
    accessibility: true,
    medical: true,
    food: true,
    water: true,
  },

  {
    id: 3,
    name: "Emergency Support Centre",
    description:
      "Emergency accommodation and support",
    latOffset: 0.004,
    lngOffset: -0.014,
    capacity: 180,
    available: 61,
    accessibility: true,
    medical: true,
    food: true,
    water: true,
  },
];

/* =========================================================
   SHELTER MARKER
   ========================================================= */

function createShelterIcon() {
  return L.divIcon({
    className: "custom-shelter-marker",

    html: `
      <div class="shelter-green-marker">
        <span>🏠</span>
      </div>
    `,

    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -22],
  });
}

/* =========================================================
   USER LOCATION MARKER
   ========================================================= */

function createUserIcon() {
  return L.divIcon({
    className: "live-location-marker",

    html: `
      <div class="live-location-pin">
        <div class="live-location-pulse"></div>
        <div class="live-location-dot"></div>
      </div>
    `,

    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

/* =========================================================
   DISTANCE CALCULATION
   ========================================================= */

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadius = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

/* =========================================================
   ROUTE FITTER
   Automatically zooms map to the complete route
   ========================================================= */

function RouteFitter({
  routeCoordinates,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      !routeCoordinates ||
      routeCoordinates.length === 0
    ) {
      return;
    }

    const bounds =
      L.latLngBounds(routeCoordinates);

    map.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 16,
      animate: true,
    });
  }, [routeCoordinates, map]);

  return null;
}

/* =========================================================
   LIVE LOCATION CONTROLLER
   ========================================================= */

function LocationController({
  liveLocation,
}) {
  const map = useMap();

  useEffect(() => {
    const handleCenter = () => {
      if (!liveLocation) {
        return;
      }

      map.flyTo(
        [
          liveLocation.latitude,
          liveLocation.longitude,
        ],
        16,
        {
          animate: true,
          duration: 1,
        }
      );
    };

    window.addEventListener(
      "centerLiveLocation",
      handleCenter
    );

    return () => {
      window.removeEventListener(
        "centerLiveLocation",
        handleCenter
      );
    };
  }, [liveLocation, map]);

  return null;
}

/* =========================================================
   SMART SHELTER PAGE
   ========================================================= */

export default function SmartShelter() {
  const [liveLocation, setLiveLocation] =
    useState(null);

  const [locationName, setLocationName] =
    useState("");

  const [locationError, setLocationError] =
    useState("");

  const [selectedShelter, setSelectedShelter] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);

  const [routeDistance, setRouteDistance] =
    useState(null);

  const [routeDuration, setRouteDuration] =
    useState(null);

  const [routing, setRouting] =
    useState(false);

  /* =======================================================
     GET LIVE LOCATION
     ======================================================= */

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Location access is not supported by this browser."
      );

      return;
    }

    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        const location = {
          latitude,
          longitude,
          accuracy,
        };

        setLiveLocation(location);

        /* -----------------------------------------------
           REVERSE LOCATION
           ----------------------------------------------- */

        try {
          const response =
            await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

          if (!response.ok) {
            throw new Error(
              "Reverse location failed"
            );
          }

          const data =
            await response.json();

          setLocationName(
            data.display_name ||
              "Current Location"
          );
        } catch {
          setLocationName(
            "Current Location"
          );
        }
      },

      (error) => {
        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            "Your current location could not be detected."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /* =======================================================
     AUTOMATICALLY CHECK LOCATION PERMISSION
     ======================================================= */

  useEffect(() => {
    if (!navigator.permissions) {
      return;
    }

    navigator.permissions
      .query({
        name: "geolocation",
      })
      .then((permission) => {
        if (
          permission.state ===
          "granted"
        ) {
          getLiveLocation();
        }
      })
      .catch(() => {});
  }, []);

  /* =======================================================
     GENERATE SHELTER LOCATIONS
     ======================================================= */

  const shelters = useMemo(() => {
    const center = liveLocation
      ? [
          liveLocation.latitude,
          liveLocation.longitude,
        ]
      : DEFAULT_CENTER;

    return shelterData.map(
      (shelter) => {
        const latitude =
          center[0] +
          shelter.latOffset;

        const longitude =
          center[1] +
          shelter.lngOffset;

        const distance =
          calculateDistance(
            center[0],
            center[1],
            latitude,
            longitude
          );

        return {
          ...shelter,
          latitude,
          longitude,
          distance,
        };
      }
    );
  }, [liveLocation]);

  /* =======================================================
     FILTER SHELTERS
     ======================================================= */

  const filteredShelters =
    shelters.filter((shelter) =>
      shelter.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  /* =======================================================
     START SAFE NAVIGATION
     ======================================================= */

  const startNavigation = async (
    shelter
  ) => {
    /* -----------------------------------------------
       LOCATION REQUIRED
       ----------------------------------------------- */

    if (!liveLocation) {
      setLocationError(
        "Please allow location access before starting navigation."
      );

      return;
    }

    /* -----------------------------------------------
       SELECT SHELTER
       ----------------------------------------------- */

    setSelectedShelter(
      shelter
    );

    setRouting(true);

    setRouteCoordinates([]);

    setRouteDistance(null);

    setRouteDuration(null);

    setLocationError("");

    try {
      /* ---------------------------------------------
         OSRM ROAD ROUTE
         --------------------------------------------- */

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${liveLocation.longitude},${liveLocation.latitude};` +
        `${shelter.longitude},${shelter.latitude}` +
        `?overview=full&geometries=geojson&steps=true`;

      console.log(
        "Requesting route:",
        url
      );

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Route server returned ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "OSRM response:",
        data
      );

      /* ---------------------------------------------
         CHECK ROUTE
         --------------------------------------------- */

      if (
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
      ) {
        throw new Error(
          "No road route was found."
        );
      }

      const route =
        data.routes[0];

      /* ---------------------------------------------
         CONVERT OSRM COORDINATES

         OSRM:
         [longitude, latitude]

         Leaflet:
         [latitude, longitude]
         --------------------------------------------- */

      const coordinates =
        route.geometry.coordinates.map(
          ([longitude, latitude]) => [
            latitude,
            longitude,
          ]
        );

      if (
        coordinates.length === 0
      ) {
        throw new Error(
          "Route contains no coordinates."
        );
      }

      /* ---------------------------------------------
         SAVE ROUTE
         --------------------------------------------- */

      setRouteCoordinates(
        coordinates
      );

      /* ---------------------------------------------
         DISTANCE
         --------------------------------------------- */

      setRouteDistance(
        (
          route.distance / 1000
        ).toFixed(2)
      );

      /* ---------------------------------------------
         TIME
         --------------------------------------------- */

      setRouteDuration(
        Math.max(
          1,
          Math.round(
            route.duration / 60
          )
        )
      );

      /* ---------------------------------------------
         ROUTE SUCCESS
         --------------------------------------------- */

      setLocationError("");

    } catch (error) {
      console.error(
        "Navigation error:",
        error
      );

      setRouteCoordinates([]);

      setLocationError(
        "Unable to calculate the road route. Please check your internet connection and try again."
      );
    } finally {
      setRouting(false);
    }
  };

  /* =======================================================
     CLEAR ROUTE
     ======================================================= */

  const clearRoute = () => {
    setRouteCoordinates([]);

    setRouteDistance(null);

    setRouteDuration(null);

    setSelectedShelter(null);
  };

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="citizen-shelter-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="shelter-page-header">

        <div>

          <div className="shelter-title-row">

            <ShieldCheck
              size={28}
            />

            <h1>
              Smart Shelter
            </h1>

          </div>

          <p>
            Find a safe shelter using
            your current location and
            navigate through the available
            road route.
          </p>

        </div>

        <div
          className={`live-location-status ${
            liveLocation
              ? "active"
              : "inactive"
          }`}
        >

          <span className="status-dot"></span>

          {liveLocation
            ? "Live Location Active"
            : "Location Not Connected"}

        </div>

      </div>

      {/* =================================================
          LOCATION ACCESS
          ================================================= */}

      {!liveLocation && (
        <div className="location-access-banner">

          <div className="location-access-icon">

            <LocateFixed
              size={21}
            />

          </div>

          <div className="location-access-content">

            <strong>
              Allow location access
            </strong>

            <span>
              Your live location is
              required to find nearby
              shelters and calculate a
              road route.
            </span>

          </div>

          <button
            className="location-access-button"
            onClick={
              getLiveLocation
            }
          >

            <LocateFixed
              size={16}
            />

            Allow Location

          </button>

        </div>
      )}

      {/* =================================================
          ERROR
          ================================================= */}

      {locationError && (
        <div className="shelter-location-error">

          <AlertTriangle
            size={17}
          />

          <span>
            {locationError}
          </span>

          <button
            onClick={() =>
              setLocationError("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* =================================================
          MAP + SIDE PANEL
          ================================================= */}

      <div className="shelter-map-layout">

        {/* =================================================
            MAP
            ================================================= */}

        <div className="shelter-map-panel">

          <div className="map-top-overlay">

            <div className="map-heading">

              <ShieldCheck
                size={18}
              />

              <div>

                <strong>
                  Safety Map
                </strong>

                <span>
                  Green = Safe · Yellow =
                  Caution · Red = Danger
                </span>

              </div>

            </div>

            {liveLocation && (
              <button
                className="recenter-button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent(
                      "centerLiveLocation"
                    )
                  )
                }
              >

                <LocateFixed
                  size={15}
                />

                My Location

              </button>
            )}

          </div>

          {/* =================================================
              LEAFLET MAP
              ================================================= */}

          <MapContainer
            center={
              liveLocation
                ? [
                    liveLocation.latitude,
                    liveLocation.longitude,
                  ]
                : DEFAULT_CENTER
            }
            zoom={14}
            scrollWheelZoom={true}
            className="smart-shelter-map"
          >

            {/* OPEN STREET MAP */}

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* ROUTE AUTO ZOOM */}

            <RouteFitter
              routeCoordinates={
                routeCoordinates
              }
            />

            {/* LIVE LOCATION CONTROL */}

            <LocationController
              liveLocation={
                liveLocation
              }
            />

            {/* =================================================
                GREEN SAFE AREA
                ================================================= */}

            <Circle
              center={
                liveLocation
                  ? [
                      liveLocation.latitude,
                      liveLocation.longitude,
                    ]
                  : DEFAULT_CENTER
              }
              radius={650}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.08,
                weight: 2,
              }}
            />

            {/* =================================================
                YELLOW CAUTION AREA
                ================================================= */}

            <Circle
              center={
                liveLocation
                  ? [
                      liveLocation.latitude +
                        0.006,
                      liveLocation.longitude +
                        0.004,
                    ]
                  : [
                      DEFAULT_CENTER[0] +
                        0.006,
                      DEFAULT_CENTER[1] +
                        0.004,
                    ]
              }
              radius={420}
              pathOptions={{
                color: "#eab308",
                fillColor: "#facc15",
                fillOpacity: 0.07,
                weight: 2,
              }}
            />

            {/* =================================================
                RED DANGER AREA
                ================================================= */}

            <Circle
              center={
                liveLocation
                  ? [
                      liveLocation.latitude -
                        0.007,
                      liveLocation.longitude -
                        0.006,
                    ]
                  : [
                      DEFAULT_CENTER[0] -
                        0.007,
                      DEFAULT_CENTER[1] -
                        0.006,
                    ]
              }
              radius={380}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.08,
                weight: 2,
              }}
            />

            {/* =================================================
                CURRENT USER LOCATION
                ================================================= */}

            {liveLocation && (
              <>
                <Marker
                  position={[
                    liveLocation.latitude,
                    liveLocation.longitude,
                  ]}
                  icon={
                    createUserIcon()
                  }
                >

                  <Popup>

                    <div className="map-popup">

                      <strong>
                        Your Current
                        Location
                      </strong>

                      <span>
                        Live location
                        detected
                      </span>

                    </div>

                  </Popup>

                </Marker>

                <Circle
                  center={[
                    liveLocation.latitude,
                    liveLocation.longitude,
                  ]}
                  radius={Math.min(
                    liveLocation.accuracy ||
                      30,
                    100
                  )}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#2563eb",
                    fillOpacity: 0.07,
                    weight: 1,
                  }}
                />

              </>
            )}

            {/* =================================================
                SHELTERS
                ================================================= */}

            {shelters.map(
              (shelter) => (
                <Marker
                  key={shelter.id}
                  position={[
                    shelter.latitude,
                    shelter.longitude,
                  ]}
                  icon={
                    createShelterIcon()
                  }
                  eventHandlers={{
                    click: () =>
                      setSelectedShelter(
                        shelter
                      ),
                  }}
                >

                  <Popup>

                    <div className="map-popup">

                      <strong>
                        {shelter.name}
                      </strong>

                      <span className="popup-safe">
                        ● SAFE SHELTER
                      </span>

                      <span>
                        {shelter.distance.toFixed(
                          2
                        )}{" "}
                        km away
                      </span>

                      <button
                        onClick={() =>
                          startNavigation(
                            shelter
                          )
                        }
                      >

                        <Navigation
                          size={13}
                        />

                        Start Safe
                        Navigation

                      </button>

                    </div>

                  </Popup>

                </Marker>
              )
            )}

            {/* =================================================
                ACTUAL ROAD ROUTE
                ================================================= */}

            {routeCoordinates.length >
              0 && (
              <Polyline
                positions={
                  routeCoordinates
                }
                pathOptions={{
                  color: "#2563eb",
                  weight: 7,
                  opacity: 0.95,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            )}

          </MapContainer>

          {/* =================================================
              MAP LEGEND
              ================================================= */}

          <div className="map-legend">

            <div className="legend-title">
              Safety Zones
            </div>

            <div className="legend-item">

              <span className="legend-marker green"></span>

              Safe Area

            </div>

            <div className="legend-item">

              <span className="legend-marker yellow"></span>

              Caution Area

            </div>

            <div className="legend-item">

              <span className="legend-marker red"></span>

              Danger Area — Avoid

            </div>

            <div className="legend-item">

              <span className="legend-shelter">
                🏠
              </span>

              Safe Shelter

            </div>

            <div className="legend-item">

              <span className="legend-route"></span>

              Road Route

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT SHELTER PANEL
            ================================================= */}

        <div className="shelter-side-panel">

          <div className="side-panel-header">

            <h2>
              Nearby Shelters
            </h2>

            <p>
              Safe shelters available
              around your location.
            </p>

          </div>

          {/* SEARCH */}

          <div className="shelter-search">

            <Search size={16} />

            <input
              type="text"
              placeholder="Search shelters..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

          {/* SHELTER LIST */}

          <div className="shelter-card-list">

            {filteredShelters.length ===
            0 ? (
              <div className="route-placeholder">
                No shelters found.
              </div>
            ) : (
              filteredShelters.map(
                (shelter) => (
                  <div
                    key={shelter.id}
                    className={`shelter-card ${
                      selectedShelter?.id ===
                      shelter.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedShelter(
                        shelter
                      )
                    }
                  >

                    {/* CARD HEADER */}

                    <div className="shelter-card-top">

                      <div className="shelter-card-icon">
                        🏠
                      </div>

                      <div className="shelter-card-title">

                        <h3>
                          {shelter.name}
                        </h3>

                        <span className="safe-label">
                          SAFE SHELTER
                        </span>

                      </div>

                    </div>

                    {/* DISTANCE */}

                    <div className="shelter-distance-row">

                      <div>

                        <MapPin
                          size={13}
                        />

                        <strong>
                          {shelter.distance.toFixed(
                            2
                          )}{" "}
                          km
                        </strong>

                      </div>

                      <div>

                        <Users
                          size={13}
                        />

                        <strong>
                          {
                            shelter.available
                          }
                        </strong>{" "}
                        available

                      </div>

                    </div>

                    {/* FEATURES */}

                    <div className="shelter-features">

                      {shelter.accessibility && (
                        <span>
                          <Accessibility
                            size={12}
                          />
                          Accessible
                        </span>
                      )}

                      {shelter.medical && (
                        <span>
                          Medical
                        </span>
                      )}

                      {shelter.food && (
                        <span>
                          Food
                        </span>
                      )}

                      {shelter.water && (
                        <span>
                          Water
                        </span>
                      )}

                    </div>

                    {/* NAVIGATION BUTTON */}

                    <button
                      className="navigation-button"
                      onClick={(
                        event
                      ) => {
                        event.stopPropagation();

                        startNavigation(
                          shelter
                        );
                      }}
                      disabled={
                        routing
                      }
                    >

                      {routing &&
                      selectedShelter?.id ===
                        shelter.id ? (
                        <>
                          <Loader2
                            size={15}
                            className="spin"
                          />

                          Calculating
                          Route...
                        </>
                      ) : (
                        <>
                          <Route
                            size={15}
                          />

                          Start Safe
                          Navigation
                        </>
                      )}

                    </button>

                  </div>
                )
              )
            )}

          </div>

          {/* =================================================
              ROUTE CALCULATING
              ================================================= */}

          {routing && (
            <div className="route-information">

              <div className="route-loading">

                <Loader2
                  size={16}
                  className="spin"
                />

                Calculating road route...

              </div>

            </div>
          )}

          {/* =================================================
              ROUTE RESULT
              ================================================= */}

          {!routing &&
            routeCoordinates.length >
              0 &&
            selectedShelter && (
              <div className="route-information">

                <div className="route-info-heading">

                  <Route size={16} />

                  <strong>
                    Route Ready
                  </strong>

                </div>

                <h3>
                  To{" "}
                  {
                    selectedShelter.name
                  }
                </h3>

                <div className="route-details">

                  <div>

                    <MapPin
                      size={14}
                    />

                    {routeDistance}{" "}
                    km

                  </div>

                  <div>

                    <Clock3
                      size={14}
                    />

                    {routeDuration}{" "}
                    min

                  </div>

                </div>

                <div className="route-success">

                  ✓ Road route displayed
                  on the map

                </div>

                <button
                  className="clear-route-button"
                  onClick={
                    clearRoute
                  }
                >
                  Clear Route
                </button>

              </div>
            )}

        </div>

      </div>

      {/* =================================================
          CURRENT LOCATION FOOTER
          ================================================= */}

      {liveLocation && (
        <div className="current-location-footer">

          <MapPin size={17} />

          <div>

            <strong>
              Your Current Location
            </strong>

            <span>
              {locationName ||
                `${liveLocation.latitude.toFixed(
                  5
                )}, ${liveLocation.longitude.toFixed(
                  5
                )}`}
            </span>

          </div>

        </div>
      )}

    </div>
  );
}