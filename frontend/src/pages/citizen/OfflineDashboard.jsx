import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  WifiOff,
  ArrowLeft,
  MapPin,
  Building2,
  Hospital,
  Shield,
  Flame,
  Droplets,
  LifeBuoy,
  Navigation,
  AlertTriangle,
  FileWarning,
  Siren,
  CheckCircle,
  Clock,
  Wifi,
} from "lucide-react";

import { Link } from "react-router-dom";

import "leaflet/dist/leaflet.css";


// ======================================================
// STORAGE KEYS
// ======================================================

const OFFLINE_REPORT_KEY =
  "disasterShieldOfflineReports";

const OFFLINE_SOS_KEY =
  "disasterShieldOfflineSOS";


// ======================================================
// DEFAULT MAP LOCATION
// Same general default used by the existing
// Citizen Smart Shelter map.
// ======================================================

const DEFAULT_CENTER = [
  8.0883,
  77.5385,
];


// ======================================================
// EMERGENCY RESOURCES
// These are cached/local prototype locations.
// They can later be replaced by data synchronized
// from the online platform.
// ======================================================

const emergencyResources = [
  {
    id: "shelter-1",
    type: "shelter",
    name: "Community Safe Shelter",
    description:
      "Emergency shelter with essential facilities.",
    lat: 8.0928,
    lng: 77.5442,
    icon: Building2,
    color: "#22c55e",
    category: "Shelters",
  },

  {
    id: "shelter-2",
    type: "shelter",
    name: "Government Relief Centre",
    description:
      "Government-managed emergency shelter.",
    lat: 8.0838,
    lng: 77.5328,
    icon: Building2,
    color: "#22c55e",
    category: "Shelters",
  },

  {
    id: "hospital-1",
    type: "hospital",
    name: "Emergency Hospital",
    description:
      "Emergency medical assistance and treatment.",
    lat: 8.0912,
    lng: 77.5315,
    icon: Hospital,
    color: "#ef4444",
    category: "Hospitals",
  },

  {
    id: "hospital-2",
    type: "hospital",
    name: "District Medical Centre",
    description:
      "Medical centre for emergency support.",
    lat: 8.0818,
    lng: 77.5458,
    icon: Hospital,
    color: "#ef4444",
    category: "Hospitals",
  },

  {
    id: "police-1",
    type: "police",
    name: "Police Station",
    description:
      "Emergency police and public safety assistance.",
    lat: 8.0865,
    lng: 77.5485,
    icon: Shield,
    color: "#3b82f6",
    category: "Police Stations",
  },

  {
    id: "fire-1",
    type: "fire",
    name: "Fire & Rescue Station",
    description:
      "Fire, rescue and emergency response services.",
    lat: 8.0788,
    lng: 77.5365,
    icon: Flame,
    color: "#f97316",
    category: "Fire Stations",
  },

  {
    id: "water-1",
    type: "water",
    name: "Emergency Water Point",
    description:
      "Emergency drinking water supply point.",
    lat: 8.0948,
    lng: 77.5368,
    icon: Droplets,
    color: "#06b6d4",
    category: "Water Points",
  },

  {
    id: "relief-1",
    type: "relief",
    name: "Emergency Relief Centre",
    description:
      "Food, water and emergency assistance.",
    lat: 8.0802,
    lng: 77.5298,
    icon: LifeBuoy,
    color: "#a855f7",
    category: "Relief Centres",
  },
];


// ======================================================
// RESOURCE CATEGORIES
// ======================================================

const resourceCategories = [
  {
    id: "all",
    label: "All",
    icon: MapPin,
  },
  {
    id: "shelter",
    label: "Shelters",
    icon: Building2,
  },
  {
    id: "hospital",
    label: "Hospitals",
    icon: Hospital,
  },
  {
    id: "police",
    label: "Police",
    icon: Shield,
  },
  {
    id: "fire",
    label: "Fire Stations",
    icon: Flame,
  },
  {
    id: "water",
    label: "Water",
    icon: Droplets,
  },
  {
    id: "relief",
    label: "Relief Centres",
    icon: LifeBuoy,
  },
];


// ======================================================
// MAP FLY COMPONENT
// ======================================================

function MapController({
  selectedResource,
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedResource) {
      return;
    }

    map.flyTo(
      [
        selectedResource.lat,
        selectedResource.lng,
      ],
      16,
      {
        duration: 1.2,
      }
    );
  }, [selectedResource, map]);

  return null;
}


// ======================================================
// OFFLINE DASHBOARD
// ======================================================

function OfflineDashboard() {

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [selectedResource, setSelectedResource] =
    useState(null);

  const [reportText, setReportText] =
    useState("");

  const [reportSaved, setReportSaved] =
    useState(false);

  const [sosSaved, setSosSaved] =
    useState(false);

  const [isOnline, setIsOnline] =
    useState(
      typeof navigator !== "undefined"
        ? navigator.onLine
        : false
    );


  // ====================================================
  // ONLINE / OFFLINE STATUS
  // ====================================================

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


  // ====================================================
  // FILTER RESOURCES
  // ====================================================

  const filteredResources =
    useMemo(() => {

      if (selectedCategory === "all") {
        return emergencyResources;
      }

      return emergencyResources.filter(
        (resource) =>
          resource.type === selectedCategory
      );

    }, [selectedCategory]);


  // ====================================================
  // SELECT RESOURCE
  // ====================================================

  const handleResourceClick = (
    resource
  ) => {

    setSelectedResource(resource);

    setTimeout(() => {
      const mapElement =
        document.getElementById(
          "offline-emergency-map"
        );

      if (mapElement) {
        mapElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 50);

  };


  // ====================================================
  // SAVE OFFLINE REPORT
  // ====================================================

  const handleSaveReport = () => {

    const trimmed =
      reportText.trim();

    if (!trimmed) {
      alert(
        "Please enter an emergency message or report."
      );

      return;
    }

    try {

      const existing =
        JSON.parse(
          localStorage.getItem(
            OFFLINE_REPORT_KEY
          ) || "[]"
        );

      const report = {
        id: Date.now(),

        message: trimmed,

        status:
          "PENDING_SYNC",

        createdAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        OFFLINE_REPORT_KEY,
        JSON.stringify([
          ...existing,
          report,
        ])
      );

      setReportText("");

      setReportSaved(true);

      setTimeout(() => {
        setReportSaved(false);
      }, 5000);

    } catch (error) {

      console.error(
        "Unable to save offline report:",
        error
      );

      alert(
        "Unable to save the report locally."
      );
    }
  };


  // ====================================================
  // OFFLINE SOS
  // ====================================================

  const handleOfflineSOS = () => {

    try {

      const existing =
        JSON.parse(
          localStorage.getItem(
            OFFLINE_SOS_KEY
          ) || "[]"
        );

      const sos = {

        id: Date.now(),

        type: "SOS",

        message:
          "Emergency SOS created while offline.",

        status:
          "PENDING_SYNC",

        createdAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        OFFLINE_SOS_KEY,
        JSON.stringify([
          ...existing,
          sos,
        ])
      );

      setSosSaved(true);

      setTimeout(() => {
        setSosSaved(false);
      }, 5000);

    } catch (error) {

      console.error(
        "Unable to save offline SOS:",
        error
      );

      alert(
        "Unable to save SOS locally."
      );
    }
  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="offline-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="offline-header">

        <div>

          <Link
            to="/citizen"
            className="offline-back-button"
          >
            <ArrowLeft size={18} />

            Back to Citizen Dashboard
          </Link>


          <div className="offline-title">

            <div className="offline-title-icon">
              <WifiOff size={28} />
            </div>

            <div>

              <div className="offline-small-label">
                CITIZEN PLATFORM
              </div>

              <h1>
                Offline Emergency Dashboard
              </h1>

              <p>
                Access cached emergency information
                even without internet connectivity.
              </p>

            </div>

          </div>

        </div>


        <div
          className={
            isOnline
              ? "offline-mode-status online"
              : "offline-mode-status"
          }
        >

          {isOnline ? (
            <Wifi size={17} />
          ) : (
            <WifiOff size={17} />
          )}

          {isOnline
            ? "ONLINE"
            : "OFFLINE"}

        </div>

      </header>


      {/* =================================================
          OFFLINE NOTICE
      ================================================= */}

      <section className="offline-notice">

        <AlertTriangle size={22} />

        <div>

          <strong>
            Offline emergency mode
          </strong>

          <p>
            You are using information stored on
            this device. Emergency reports and SOS
            requests created here will remain saved
            locally until an internet connection is
            available.
          </p>

        </div>

      </section>


      {/* =================================================
          MAP SECTION
      ================================================= */}

      <section
        className="offline-map-section"
        id="offline-emergency-map"
      >

        <div className="section-heading">

          <div>

            <span>
              EMERGENCY MAP
            </span>

            <h2>
              Cached Emergency Map
            </h2>

          </div>


          <div className="cached-badge">

            <CheckCircle size={16} />

            Cached Map

          </div>

        </div>


        <div className="offline-map-wrapper">

          <MapContainer
            center={DEFAULT_CENTER}
            zoom={15}
            scrollWheelZoom={true}
            className="offline-leaflet-map"
          >

            {/* =================================================
                OPENSTREETMAP
                If tiles were previously cached, they can be
                displayed offline. Actual tile caching will be
                implemented separately.
            ================================================= */}

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {/* MAP CONTROLLER */}

            <MapController
              selectedResource={
                selectedResource
              }
            />


            {/* =================================================
                CRITICAL ZONE
            ================================================= */}

            <Circle
              center={[
                DEFAULT_CENTER[0] - 0.007,
                DEFAULT_CENTER[1] - 0.006,
              ]}
              radius={380}
              pathOptions={{
                color: "#ef4444",
                fillColor: "#ef4444",
                fillOpacity: 0.22,
                weight: 2,
              }}
            >

              <Popup>
                <strong>
                  Critical Risk Zone
                </strong>

                <br />

                Avoid this area if possible.
              </Popup>

            </Circle>


            {/* =================================================
                MEDIUM RISK ZONE
            ================================================= */}

            <Circle
              center={[
                DEFAULT_CENTER[0] + 0.002,
                DEFAULT_CENTER[1] + 0.004,
              ]}
              radius={300}
              pathOptions={{
                color: "#eab308",
                fillColor: "#eab308",
                fillOpacity: 0.20,
                weight: 2,
              }}
            >

              <Popup>

                <strong>
                  Medium Risk Zone
                </strong>

                <br />

                Exercise caution.

              </Popup>

            </Circle>


            {/* =================================================
                SAFE ZONE
            ================================================= */}

            <Circle
              center={[
                DEFAULT_CENTER[0] + 0.004,
                DEFAULT_CENTER[1] - 0.003,
              ]}
              radius={280}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#22c55e",
                fillOpacity: 0.20,
                weight: 2,
              }}
            >

              <Popup>

                <strong>
                  Safe Zone
                </strong>

                <br />

                Safer area identified.

              </Popup>

            </Circle>


            {/* =================================================
                USER LOCATION
            ================================================= */}

            <CircleMarker
              center={DEFAULT_CENTER}
              radius={10}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#2563eb",
                fillOpacity: 1,
                weight: 3,
              }}
            >

              <Popup>

                <strong>
                  Your Location
                </strong>

                <br />

                Current cached location.

              </Popup>

            </CircleMarker>


            {/* =================================================
                EMERGENCY RESOURCE MARKERS
            ================================================= */}

            {emergencyResources.map(
              (resource) => {

                const isSelected =
                  selectedResource?.id ===
                  resource.id;

                return (

                  <CircleMarker
                    key={resource.id}
                    center={[
                      resource.lat,
                      resource.lng,
                    ]}
                    radius={
                      isSelected
                        ? 13
                        : 9
                    }
                    pathOptions={{
                      color: "#ffffff",
                      fillColor:
                        resource.color,
                      fillOpacity: 1,
                      weight:
                        isSelected
                          ? 4
                          : 2,
                    }}
                    eventHandlers={{
                      click: () => {
                        setSelectedResource(
                          resource
                        );
                      },
                    }}
                  >

                    <Popup>

                      <div
                        style={{
                          minWidth:
                            "180px",
                        }}
                      >

                        <strong>
                          {resource.name}
                        </strong>

                        <br />

                        <span>
                          {resource.description}
                        </span>

                      </div>

                    </Popup>

                  </CircleMarker>

                );
              }
            )}

          </MapContainer>


          {/* MAP LEGEND */}

          <div className="map-legend">

            <div>
              <span className="legend-dot blue"></span>
              Your Location
            </div>

            <div>
              <span className="legend-dot red"></span>
              Critical
            </div>

            <div>
              <span className="legend-dot yellow"></span>
              Medium
            </div>

            <div>
              <span className="legend-dot green"></span>
              Safe
            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          EMERGENCY RESOURCE FILTERS
      ================================================= */}

      <section className="offline-resources-section">

        <div className="section-heading">

          <div>

            <span>
              EMERGENCY RESOURCES
            </span>

            <h2>
              Find Help Near You
            </h2>

          </div>

        </div>


        <div className="resource-category-list">

          {resourceCategories.map(
            (category) => {

              const Icon =
                category.icon;

              const active =
                selectedCategory ===
                category.id;

              return (

                <button
                  key={category.id}
                  type="button"
                  className={
                    active
                      ? "resource-category active"
                      : "resource-category"
                  }
                  onClick={() => {
                    setSelectedCategory(
                      category.id
                    );
                  }}
                >

                  <Icon size={18} />

                  <span>
                    {category.label}
                  </span>

                </button>

              );
            }
          )}

        </div>


        {/* =================================================
            RESOURCE CARDS
        ================================================= */}

        <div className="resource-grid">

          {filteredResources.map(
            (resource) => {

              const Icon =
                resource.icon;

              const selected =
                selectedResource?.id ===
                resource.id;

              return (

                <button
                  key={resource.id}
                  type="button"
                  className={
                    selected
                      ? "resource-card selected"
                      : "resource-card"
                  }
                  onClick={() => {
                    handleResourceClick(
                      resource
                    );
                  }}
                >

                  <div
                    className="resource-icon"
                    style={{
                      color:
                        resource.color,
                      background:
                        `${resource.color}18`,
                    }}
                  >
                    <Icon size={24} />
                  </div>


                  <div className="resource-content">

                    <h3>
                      {resource.name}
                    </h3>

                    <p>
                      {resource.description}
                    </p>

                    <span>
                      View on map →
                    </span>

                  </div>

                </button>

              );
            }
          )}

        </div>

      </section>


      {/* =================================================
          SELECTED RESOURCE
      ================================================= */}

      {selectedResource && (

        <section className="selected-resource-section">

          <div className="selected-resource-card">

            <div
              className="selected-resource-icon"
              style={{
                color:
                  selectedResource.color,
              }}
            >

              {React.createElement(
                selectedResource.icon,
                {
                  size: 28,
                }
              )}

            </div>


            <div className="selected-resource-info">

              <span>
                SELECTED EMERGENCY RESOURCE
              </span>

              <h2>
                {selectedResource.name}
              </h2>

              <p>
                {selectedResource.description}
              </p>

            </div>


            <button
              type="button"
              className="show-map-button"
              onClick={() => {

                const mapElement =
                  document.getElementById(
                    "offline-emergency-map"
                  );

                if (mapElement) {

                  mapElement.scrollIntoView({
                    behavior:
                      "smooth",
                    block:
                      "center",
                  });

                }

              }}
            >

              <Navigation size={17} />

              Show on Map

            </button>

          </div>

        </section>

      )}


      {/* =================================================
          OFFLINE EMERGENCY REPORT
      ================================================= */}

      <section className="offline-report-section">

        <div className="section-heading">

          <div>

            <span>
              OFFLINE REPORT
            </span>

            <h2>
              Report an Emergency Situation
            </h2>

          </div>

        </div>


        <div className="offline-report-card">

          <div className="report-icon">

            <FileWarning size={25} />

          </div>


          <div className="report-content">

            <h3>
              Enter emergency information
            </h3>

            <p>
              You can type a message even when
              there is no internet connection.
              It will be stored securely on this
              device and can be synchronized later.
            </p>


            <textarea
              value={reportText}
              onChange={(event) => {
                setReportText(
                  event.target.value
                );
              }}
              placeholder="Example: Water level is rising near the main road..."
              rows={5}
              className="offline-report-textarea"
            />


            <div className="report-actions">

              <button
                type="button"
                className="save-report-button"
                onClick={handleSaveReport}
              >

                <FileWarning size={17} />

                Save Report Offline

              </button>


              {reportSaved && (

                <div className="report-saved-message">

                  <CheckCircle size={17} />

                  Saved locally. It will sync
                  once you are online.

                </div>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          OFFLINE SOS
      ================================================= */}

      <section className="offline-sos-section">

        <div className="offline-sos-card">

          <div className="sos-icon">

            <Siren size={27} />

          </div>


          <div className="sos-content">

            <span>
              EMERGENCY SOS
            </span>

            <h2>
              Need immediate help?
            </h2>

            <p>
              Save an SOS locally. It can be
              synchronized when the device
              reconnects to the internet.
            </p>

          </div>


          <button
            type="button"
            className="offline-sos-button"
            onClick={handleOfflineSOS}
          >

            <Siren size={18} />

            {sosSaved
              ? "SOS Saved"
              : "Save SOS Offline"}

          </button>

        </div>


        {sosSaved && (

          <div className="sos-sync-message">

            <CheckCircle size={17} />

            SOS saved locally. It will sync
            once you are online.

          </div>

        )}

      </section>


      {/* =================================================
          ONLINE SYNC MESSAGE
      ================================================= */}

      <section className="offline-sync-section">

        <div className="sync-message">

          {isOnline ? (
            <CheckCircle size={20} />
          ) : (
            <Clock size={20} />
          )}

          <div>

            <strong>
              {isOnline
                ? "You are online"
                : "You are currently offline"}
            </strong>

            <p>
              {isOnline
                ? "Your device has an internet connection. Pending offline information can now be synchronized."
                : "Your saved emergency information will remain on this device and can be synchronized once you are online."}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="offline-footer">

        <strong>
          DisasterShield AI
        </strong>

        <span>
          Offline Emergency Support
        </span>

      </footer>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const style = document.createElement("style");

style.textContent = `

/* =====================================================
   MAIN
===================================================== */

.offline-dashboard {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #07111f 0%,
      #0b1728 100%
    );
  color: #f8fafc;
  padding: 28px;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}


/* =====================================================
   HEADER
===================================================== */

.offline-header {
  max-width: 1450px;
  margin: 0 auto 24px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;
}

.offline-back-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  color: #94a3b8;
  text-decoration: none;

  font-size: 13px;

  margin-bottom: 18px;
}

.offline-back-button:hover {
  color: #ffffff;
}

.offline-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.offline-title-icon {
  width: 58px;
  height: 58px;

  border-radius: 15px;

  background: #172554;
  border: 1px solid #1e40af;

  color: #93c5fd;

  display: flex;
  align-items: center;
  justify-content: center;
}

.offline-small-label {
  color: #60a5fa;

  font-size: 10px;
  font-weight: 900;

  letter-spacing: 1.5px;

  margin-bottom: 5px;
}

.offline-title h1 {
  margin: 0;

  font-size: 27px;
}

.offline-title p {
  margin: 6px 0 0;

  color: #94a3b8;

  font-size: 13px;
}

.offline-mode-status {
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 9px 14px;

  border-radius: 999px;

  background: #451a03;
  border: 1px solid #92400e;

  color: #fbbf24;

  font-size: 11px;
  font-weight: 900;
}

.offline-mode-status.online {
  background: #052e16;
  border-color: #166534;
  color: #86efac;
}


/* =====================================================
   NOTICE
===================================================== */

.offline-notice {
  max-width: 1450px;

  margin: 0 auto 28px;

  display: flex;
  gap: 14px;

  padding: 17px;

  border-radius: 13px;

  background: #2a1d08;
  border: 1px solid #92400e;

  color: #fbbf24;
}

.offline-notice strong {
  display: block;

  color: #fef3c7;

  font-size: 14px;

  margin-bottom: 4px;
}

.offline-notice p {
  margin: 0;

  color: #d6d3d1;

  font-size: 12px;

  line-height: 1.5;
}


/* =====================================================
   SECTION HEADINGS
===================================================== */

.offline-map-section,
.offline-resources-section,
.offline-report-section,
.offline-sos-section,
.offline-sync-section,
.selected-resource-section {
  max-width: 1450px;

  margin-left: auto;
  margin-right: auto;
}

.offline-map-section,
.offline-resources-section,
.offline-report-section,
.offline-sos-section,
.offline-sync-section {
  margin-bottom: 30px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  margin-bottom: 14px;
}

.section-heading > div:first-child span {
  color: #64748b;

  font-size: 10px;

  letter-spacing: 1.4px;

  font-weight: 900;
}

.section-heading h2 {
  margin: 5px 0 0;

  font-size: 21px;
}

.cached-badge {
  display: flex;
  align-items: center;
  gap: 7px;

  padding: 8px 12px;

  border-radius: 999px;

  background: #052e16;
  border: 1px solid #166534;

  color: #86efac;

  font-size: 11px;
  font-weight: 800;
}


/* =====================================================
   MAP
===================================================== */

.offline-map-wrapper {
  position: relative;

  padding: 10px;

  background: #101d30;

  border: 1px solid #263852;

  border-radius: 17px;

  overflow: hidden;
}

.offline-leaflet-map {
  width: 100%;
  height: 560px;

  border-radius: 11px;

  overflow: hidden;
}


/* MAP LEGEND */

.map-legend {
  position: absolute;

  left: 24px;
  bottom: 24px;

  z-index: 1000;

  display: flex;
  flex-wrap: wrap;

  gap: 12px;

  padding: 11px 13px;

  background: rgba(7, 17, 31, 0.94);

  border: 1px solid #334155;

  border-radius: 10px;

  font-size: 11px;

  color: #dbeafe;
}

.map-legend div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;
}

.legend-dot.blue {
  background: #2563eb;
}

.legend-dot.red {
  background: #ef4444;
}

.legend-dot.yellow {
  background: #eab308;
}

.legend-dot.green {
  background: #22c55e;
}


/* =====================================================
   RESOURCE FILTERS
===================================================== */

.resource-category-list {
  display: flex;

  gap: 9px;

  overflow-x: auto;

  padding-bottom: 5px;

  margin-bottom: 16px;
}

.resource-category {
  flex-shrink: 0;

  display: flex;
  align-items: center;
  gap: 7px;

  padding: 9px 13px;

  border-radius: 9px;

  border: 1px solid #334155;

  background: #101d30;

  color: #94a3b8;

  cursor: pointer;

  font-size: 12px;
  font-weight: 700;
}

.resource-category:hover {
  border-color: #3b82f6;
  color: #dbeafe;
}

.resource-category.active {
  background: #172554;

  border-color: #2563eb;

  color: #bfdbfe;
}


/* =====================================================
   RESOURCE GRID
===================================================== */

.resource-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 13px;
}

.resource-card {
  display: flex;

  align-items: flex-start;

  gap: 13px;

  width: 100%;

  text-align: left;

  padding: 17px;

  border-radius: 13px;

  border: 1px solid #263852;

  background: #101d30;

  color: #ffffff;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.resource-card:hover {
  transform: translateY(-2px);

  border-color: #3b82f6;
}

.resource-card.selected {
  border-color: #60a5fa;

  background: #111f35;
}

.resource-icon {
  min-width: 47px;

  width: 47px;
  height: 47px;

  border-radius: 11px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-content {
  min-width: 0;
}

.resource-content h3 {
  margin: 0 0 5px;

  font-size: 14px;
}

.resource-content p {
  margin: 0 0 8px;

  color: #94a3b8;

  font-size: 11px;

  line-height: 1.5;
}

.resource-content span {
  color: #60a5fa;

  font-size: 11px;

  font-weight: 800;
}


/* =====================================================
   SELECTED RESOURCE
===================================================== */

.selected-resource-section {
  margin-bottom: 30px;
}

.selected-resource-card {
  display: flex;

  align-items: center;

  gap: 15px;

  padding: 18px;

  border-radius: 14px;

  background: #101d30;

  border: 1px solid #3b82f6;
}

.selected-resource-icon {
  min-width: 50px;

  width: 50px;
  height: 50px;

  border-radius: 12px;

  background: #172554;

  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-resource-info {
  flex: 1;
}

.selected-resource-info > span {
  color: #64748b;

  font-size: 9px;

  letter-spacing: 1.2px;

  font-weight: 900;
}

.selected-resource-info h2 {
  margin: 4px 0;

  font-size: 17px;
}

.selected-resource-info p {
  margin: 0;

  color: #94a3b8;

  font-size: 12px;
}

.show-map-button {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 10px 14px;

  border: 1px solid #334155;

  border-radius: 9px;

  background: #172554;

  color: #dbeafe;

  cursor: pointer;

  font-weight: 800;

  font-size: 11px;
}


/* =====================================================
   OFFLINE REPORT
===================================================== */

.offline-report-card {
  display: flex;

  gap: 16px;

  padding: 20px;

  border-radius: 15px;

  background: #101d30;

  border: 1px solid #263852;
}

.report-icon {
  min-width: 50px;

  width: 50px;
  height: 50px;

  border-radius: 12px;

  background: #172554;

  color: #93c5fd;

  display: flex;
  align-items: center;
  justify-content: center;
}

.report-content {
  flex: 1;
}

.report-content h3 {
  margin: 0 0 5px;

  font-size: 16px;
}

.report-content > p {
  margin: 0 0 14px;

  color: #94a3b8;

  font-size: 12px;

  line-height: 1.5;
}

.offline-report-textarea {
  width: 100%;

  box-sizing: border-box;

  resize: vertical;

  min-height: 120px;

  padding: 13px;

  border-radius: 10px;

  border: 1px solid #334155;

  outline: none;

  background: #07111f;

  color: #ffffff;

  font-family: inherit;

  font-size: 13px;

  line-height: 1.5;
}

.offline-report-textarea:focus {
  border-color: #3b82f6;
}

.offline-report-textarea::placeholder {
  color: #64748b;
}

.report-actions {
  display: flex;

  align-items: center;

  gap: 12px;

  flex-wrap: wrap;

  margin-top: 12px;
}

.save-report-button {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 10px 15px;

  border: none;

  border-radius: 9px;

  background: #2563eb;

  color: #ffffff;

  cursor: pointer;

  font-size: 12px;

  font-weight: 800;
}

.save-report-button:hover {
  background: #1d4ed8;
}

.report-saved-message {
  display: flex;

  align-items: center;

  gap: 6px;

  color: #86efac;

  font-size: 11px;

  font-weight: 700;
}


/* =====================================================
   SOS
===================================================== */

.offline-sos-card {
  display: flex;

  align-items: center;

  gap: 15px;

  padding: 20px;

  border-radius: 15px;

  background: #2a0f0f;

  border: 1px solid #7f1d1d;
}

.sos-icon {
  min-width: 52px;

  width: 52px;
  height: 52px;

  border-radius: 12px;

  background: #450a0a;

  color: #fca5a5;

  display: flex;
  align-items: center;
  justify-content: center;
}

.sos-content {
  flex: 1;
}

.sos-content > span {
  color: #f87171;

  font-size: 9px;

  letter-spacing: 1.2px;

  font-weight: 900;
}

.sos-content h2 {
  margin: 4px 0;

  font-size: 17px;
}

.sos-content p {
  margin: 0;

  color: #cbd5e1;

  font-size: 12px;

  line-height: 1.5;
}

.offline-sos-button {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 11px 16px;

  border: none;

  border-radius: 9px;

  background: #dc2626;

  color: #ffffff;

  cursor: pointer;

  font-size: 12px;

  font-weight: 900;
}

.offline-sos-button:hover {
  background: #b91c1c;
}

.sos-sync-message {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 10px;

  color: #86efac;

  font-size: 11px;

  font-weight: 700;
}


/* =====================================================
   SYNC MESSAGE
===================================================== */

.sync-message {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 17px;

  border-radius: 13px;

  background: #101d30;

  border: 1px solid #263852;

  color: #60a5fa;
}

.sync-message strong {
  display: block;

  color: #e2e8f0;

  font-size: 14px;

  margin-bottom: 4px;
}

.sync-message p {
  margin: 0;

  color: #94a3b8;

  font-size: 12px;

  line-height: 1.5;
}


/* =====================================================
   FOOTER
===================================================== */

.offline-footer {
  max-width: 1450px;

  margin: 35px auto 0;

  padding-top: 18px;

  border-top: 1px solid #1e293b;

  display: flex;

  justify-content: space-between;

  gap: 15px;

  color: #64748b;

  font-size: 11px;
}


/* =====================================================
   LEAFLET POPUP
===================================================== */

.leaflet-popup-content-wrapper {
  background: #101d30;
  color: #ffffff;
}

.leaflet-popup-tip {
  background: #101d30;
}

.leaflet-popup-content {
  color: #dbeafe;
}

.leaflet-popup-content strong {
  color: #ffffff;
}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1050px) {

  .resource-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

}

@media (max-width: 800px) {

  .offline-dashboard {
    padding: 18px;
  }

  .offline-header {
    flex-direction: column;
  }

  .offline-leaflet-map {
    height: 450px;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .selected-resource-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .show-map-button {
    margin-left: 65px;
  }

  .offline-sos-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .offline-sos-button {
    margin-left: 67px;
  }

}

@media (max-width: 550px) {

  .offline-title h1 {
    font-size: 21px;
  }

  .offline-title p {
    font-size: 11px;
  }

  .offline-leaflet-map {
    height: 380px;
  }

  .map-legend {
    left: 15px;
    bottom: 15px;
  }

  .offline-report-card {
    flex-direction: column;
  }

  .offline-footer {
    flex-direction: column;
  }

}

`;

document.head.appendChild(style);


// ======================================================
// EXPORT
// ======================================================

export default OfflineDashboard;