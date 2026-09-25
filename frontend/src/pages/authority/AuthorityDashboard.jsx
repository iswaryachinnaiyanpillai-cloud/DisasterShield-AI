import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CloudRain,
  Droplets,
  Gauge,
  MapPin,
  Navigation,
  Radio,
  ShieldCheck,
  Users,
  Waves,
  Wind,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import { monitoringData } from "../../data/authorityData";
import { getEmergencyState } from "../../services/emergencyState";

import "./Authority.css";


// ---------------------------------------------------------
// FIX LEAFLET DEFAULT MARKER
// ---------------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ---------------------------------------------------------
// MAP LOCATION CENTER
// ---------------------------------------------------------

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, {
        duration: 1.2,
      });
    }
  }, [position, map]);

  return null;
}


// ---------------------------------------------------------
// AUTHORITY DASHBOARD
// ---------------------------------------------------------

export default function AuthorityDashboard() {

  const [emergencyState, setEmergencyState] = useState(
    getEmergencyState()
  );

  const [showLocationPrompt, setShowLocationPrompt] =
    useState(false);

  const [locationGranted, setLocationGranted] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [userLocation, setUserLocation] =
    useState(null);


  // -------------------------------------------------------
  // EMERGENCY STATE
  // -------------------------------------------------------

  useEffect(() => {

    const refreshState = () => {
      setEmergencyState(getEmergencyState());
    };

    window.addEventListener(
      "disasterShieldStateChanged",
      refreshState
    );

    window.addEventListener(
      "storage",
      refreshState
    );

    return () => {

      window.removeEventListener(
        "disasterShieldStateChanged",
        refreshState
      );

      window.removeEventListener(
        "storage",
        refreshState
      );
    };

  }, []);


  const officialAlert =
    emergencyState?.officialAlert;


  // -------------------------------------------------------
  // MONITORING DATA
  // -------------------------------------------------------

  const rainfall =
    Number(monitoringData?.rainfall?.current ?? 0);

  const river =
    Number(monitoringData?.river?.current ?? 0);

  const soil =
    Number(monitoringData?.soil?.current ?? 0);

  const temperature =
    Number(
      monitoringData?.weather?.temperature ?? 0
    );

  const humidity =
    Number(
      monitoringData?.weather?.humidity ?? 0
    );

  const windSpeed =
    Number(
      monitoringData?.weather?.windSpeed ?? 0
    );

  const activeSensors =
    Number(
      monitoringData?.sensors?.active ?? 0
    );

  const warningSensors =
    Number(
      monitoringData?.sensors?.warning ?? 0
    );

  const criticalSensors =
    Number(
      monitoringData?.sensors?.critical ?? 0
    );


  // -------------------------------------------------------
  // RISK CALCULATION
  // -------------------------------------------------------

  const rainfallRisk = Math.min(
    100,
    Math.max(
      0,
      (rainfall / 120) * 100
    )
  );

  const riverRisk = Math.min(
    100,
    Math.max(
      0,
      ((river - 2.5) / 3.5) * 100
    )
  );

  const sensorRisk = Math.min(
    100,
    warningSensors * 10 +
      criticalSensors * 20
  );

  const currentRisk = Math.round(
    Math.min(
      99,
      Math.max(
        0,
        rainfallRisk * 0.35 +
          riverRisk * 0.3 +
          soil * 0.2 +
          sensorRisk * 0.15 +
          2
      )
    )
  );


  // -------------------------------------------------------
  // RISK STATUS
  // -------------------------------------------------------

  const getRiskStatus = (score) => {

    if (score >= 90) {
      return {
        label: "PEAK RISK",
        className: "risk-critical",
      };
    }

    if (score >= 75) {
      return {
        label: "HIGH RISK",
        className: "risk-high",
      };
    }

    if (score >= 50) {
      return {
        label: "INCREASING RISK",
        className: "risk-increasing",
      };
    }

    return {
      label: "LOW / NORMAL",
      className: "risk-low",
    };
  };


  const riskStatus =
    getRiskStatus(currentRisk);


  // -------------------------------------------------------
  // MONITORING LOCATION
  // -------------------------------------------------------

  const monitoringLatitude =
    Number(
      monitoringData?.latitude ?? 8.0883
    );

  const monitoringLongitude =
    Number(
      monitoringData?.longitude ?? 77.5385
    );


  const monitoringPosition = [
    monitoringLatitude,
    monitoringLongitude,
  ];


  // -------------------------------------------------------
  // ASK FOR LIVE LOCATION
  // -------------------------------------------------------

  const handleRequestLocation = () => {

    setLocationError("");

    if (!navigator.geolocation) {

      setLocationError(
        "Live location is not supported by this browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setUserLocation([
          latitude,
          longitude,
        ]);

        setLocationGranted(true);

        setShowLocationPrompt(false);

        setLocationError("");
      },

      (error) => {

        setLocationGranted(false);

        setLocationError(
          "Location access was not granted. You can allow location access from your browser settings."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };


  // -------------------------------------------------------
  // CLOSE LOCATION REQUEST
  // -------------------------------------------------------

  const handleDenyLocation = () => {

    setShowLocationPrompt(false);

    setLocationError("");
  };


  // -------------------------------------------------------
  // OPEN LOCATION REQUEST
  // -------------------------------------------------------

  const handleOpenLocation = () => {

    setShowLocationPrompt(true);
  };


  // -------------------------------------------------------
  // DISPLAY LOCATION TEXT
  // -------------------------------------------------------

  const locationText = userLocation
    ? `${userLocation[0].toFixed(5)}, ${userLocation[1].toFixed(5)}`
    : "Live location not connected";


  return (

    <div className="authority-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="authority-page-header">

        <div>

          <div className="authority-eyebrow">

            <ShieldCheck size={18} />

            AUTHORITY COMMAND CENTER

          </div>

          <h1>
            Emergency Dashboard
          </h1>

          <p>
            Monitor environmental conditions,
            emergency risk and response intelligence
            from one command center.
          </p>

        </div>


        <div className="monitoring-location-card">

          <MapPin size={20} />

          <div>

            <span>
              MONITORING AREA
            </span>

            <strong>
              {monitoringData?.location ||
                "Monitored Flood-Susceptible Zone"}
            </strong>

          </div>

        </div>

      </div>


      {/* =================================================
          TOP STATUS CARDS
      ================================================= */}

      <div className="intelligence-stat-grid">


        {/* CURRENT RISK */}

        <div className="intelligence-stat-card">

          <div className="stat-card-icon blue">

            <Gauge size={22} />

          </div>

          <div className="stat-card-title">
            Current Risk
          </div>

          <div className="risk-number-row">

            <strong>
              {currentRisk}
            </strong>

            <span>
              / 100
            </span>

          </div>

          <div
            className={`risk-badge ${riskStatus.className}`}
          >
            {riskStatus.label}
          </div>

          <p>
            Current environmental conditions
            are being monitored continuously.
          </p>

        </div>


        {/* RAINFALL */}

        <div className="intelligence-stat-card">

          <div className="stat-card-icon blue">

            <CloudRain size={22} />

          </div>

          <div className="stat-card-title">
            Rainfall
          </div>

          <div className="impact-number">

            {rainfall}

            <span>
              mm/hr
            </span>

          </div>

          <div className="impact-label">
            Current rainfall
          </div>

          <p>
            Short-term rainfall trend is
            continuously monitored.
          </p>

        </div>


        {/* WATER LEVEL */}

        <div className="intelligence-stat-card">

          <div className="stat-card-icon purple">

            <Waves size={22} />

          </div>

          <div className="stat-card-title">
            River / Water Level
          </div>

          <div className="impact-number">

            {river.toFixed(1)}

            <span>
              m
            </span>

          </div>

          <div className="impact-label">
            Current water level
          </div>

          <p>
            Water-level movement contributes
            to emergency risk assessment.
          </p>

        </div>


        {/* SENSOR NETWORK */}

        <div className="intelligence-stat-card">

          <div className="stat-card-icon green">

            <Radio size={22} />

          </div>

          <div className="stat-card-title">
            Sensor Network
          </div>

          <div className="impact-number">

            {activeSensors}

            <span>
              active
            </span>

          </div>

          <div className="sensor-status-row">

            <span>
              {warningSensors} warning
            </span>

            <span>
              {criticalSensors} critical
            </span>

          </div>

          <p>
            Sensor readings are contributing
            to current intelligence.
          </p>

        </div>

      </div>


      {/* =================================================
          LIVE LOCATION + MAP
      ================================================= */}

      <section className="intelligence-section">

        <div className="section-heading-row">

          <div>

            <h2>
              Live Situation Map
            </h2>

            <p>
              Monitor the monitored area and,
              with your permission, view your
              current live location.
            </p>

          </div>


          <button
            type="button"
            className="issue-official-alert-btn"
            onClick={handleOpenLocation}
          >

            <Navigation size={18} />

            {locationGranted
              ? "Live Location Active"
              : "Access Live Location"}

          </button>

        </div>


        {/* LOCATION STATUS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            marginBottom: "18px",
            borderRadius: "12px",
            border: "1px solid #193754",
            background: "#0b1b2c",
          }}
        >

          <MapPin
            size={20}
            color={
              locationGranted
                ? "#4ade80"
                : "#60a5fa"
            }
          />

          <div>

            <strong
              style={{
                display: "block",
                marginBottom: "4px",
              }}
            >
              {locationGranted
                ? "Live Location Connected"
                : "Location Access"}
            </strong>

            <span
              style={{
                color: "#7190ad",
                fontSize: "13px",
              }}
            >
              {locationGranted
                ? `Current coordinates: ${locationText}`
                : "Your live location will only be accessed after you give permission."}
            </span>

          </div>

        </div>


        {/* MAP */}

        <div
          style={{
            width: "100%",
            height: "460px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #193754",
          }}
        >

          <MapContainer
            center={
              userLocation ||
              monitoringPosition
            }
            zoom={13}
            scrollWheelZoom={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {/* MONITORING AREA */}

            <Marker
              position={monitoringPosition}
            >

              <Popup>

                <strong>
                  Monitoring Area
                </strong>

                <br />

                {monitoringData?.location ||
                  "Monitored Area"}

              </Popup>

            </Marker>


            <Circle
              center={monitoringPosition}
              radius={2500}
              pathOptions={{
                color: "#f97316",
                fillColor: "#f97316",
                fillOpacity: 0.08,
              }}
            />


            {/* LIVE USER LOCATION */}

            {userLocation && (

              <>

                <Marker
                  position={userLocation}
                >

                  <Popup>

                    <strong>
                      Your Live Location
                    </strong>

                    <br />

                    Latitude:{" "}
                    {userLocation[0].toFixed(5)}

                    <br />

                    Longitude:{" "}
                    {userLocation[1].toFixed(5)}

                  </Popup>

                </Marker>


                <Circle
                  center={userLocation}
                  radius={80}
                  pathOptions={{
                    color: "#22c55e",
                    fillColor: "#22c55e",
                    fillOpacity: 0.2,
                  }}
                />

              </>

            )}


            <MapCenter
              position={
                userLocation ||
                monitoringPosition
              }
            />

          </MapContainer>

        </div>

      </section>


      {/* =================================================
          ENVIRONMENTAL OVERVIEW
      ================================================= */}

      <section className="intelligence-section">

        <div className="section-heading-row">

          <div>

            <h2>
              Environmental Overview
            </h2>

            <p>
              Current environmental readings
              contributing to the intelligence system.
            </p>

          </div>

          <div className="monitoring-active-badge">

            <span />

            Monitoring Active

          </div>

        </div>


        <div className="environment-grid">


          {/* SOIL */}

          <div className="environment-card">

            <div className="environment-card-top">

              <div className="environment-icon">

                <Droplets size={21} />

              </div>

              <div>

                <strong>
                  Soil Saturation
                </strong>

                <span>
                  Increasing Saturation
                </span>

              </div>

            </div>

            <div className="environment-value">

              {soil}

              <small>
                %
              </small>

            </div>

          </div>


          {/* WEATHER */}

          <div className="environment-card">

            <div className="environment-card-top">

              <div className="environment-icon">

                <Wind size={21} />

              </div>

              <div>

                <strong>
                  Weather
                </strong>

                <span>
                  Current
                </span>

              </div>

            </div>

            <div className="environment-value">

              {temperature.toFixed(1)}

              <small>
                °C
              </small>

            </div>

            <div className="environment-footer">

              <span>
                Humidity {humidity}%
              </span>

              <span>
                Wind {windSpeed} km/h
              </span>

            </div>

          </div>


          {/* SENSOR */}

          <div className="environment-card">

            <div className="environment-card-top">

              <div className="environment-icon">

                <Activity size={21} />

              </div>

              <div>

                <strong>
                  Sensor Status
                </strong>

                <span>
                  Network Monitoring
                </span>

              </div>

            </div>

            <div className="environment-value">

              {activeSensors}

              <small>
                active
              </small>

            </div>

            <div className="environment-footer">

              <span>
                {warningSensors} warning
              </span>

              <span>
                {criticalSensors} critical
              </span>

            </div>

          </div>


          {/* CITIZEN INTELLIGENCE */}

          <div className="environment-card">

            <div className="environment-card-top">

              <div className="environment-icon">

                <Users size={21} />

              </div>

              <div>

                <strong>
                  Citizen Intelligence
                </strong>

                <span>
                  Response Network
                </span>

              </div>

            </div>

            <div className="environment-value">

              {emergencyState?.citizenSOS?.length || 0}

              <small>
                SOS
              </small>

            </div>

            <div className="environment-footer">

              <span>
                Incoming reports
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          OFFICIAL ALERT STATUS
      ================================================= */}

      <section className="intelligence-section">

        <div className="section-heading-row">

          <div>

            <h2>
              Emergency Alert Status
            </h2>

            <p>
              Official public alerts are issued only
              after authority review.
            </p>

          </div>

        </div>


        {!officialAlert ? (

          <div
            style={{
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid #193754",
              background: "#0b1b2c",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >

            <ShieldCheck
              size={28}
              color="#60a5fa"
            />

            <div>

              <strong>
                No official emergency alert is active
              </strong>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#7190ad",
                }}
              >
                The authority platform is monitoring
                the current situation.
              </p>

            </div>

          </div>

        ) : (

          <div
            style={{
              padding: "22px",
              borderRadius: "14px",
              border: "1px solid #7f1d1d",
              background: "#260d13",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "18px",
              }}
            >

              <AlertTriangle
                size={24}
                color="#ff6464"
              />

              <strong
                style={{
                  color: "#ff6464",
                }}
              >
                OFFICIAL EMERGENCY ALERT ACTIVE
              </strong>

            </div>


            {/* IMPORTANT:
                VALUES ARE KEPT SIDE BY SIDE
                WITH CLEAR GAP
            */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: "24px",
              }}
            >

              <div>

                <span
                  style={{
                    display: "block",
                    color: "#8da6bd",
                    fontSize: "11px",
                    marginBottom: "7px",
                  }}
                >
                  DISASTER TYPE
                </span>

                <strong>
                  {officialAlert.disasterType}
                </strong>

              </div>


              <div>

                <span
                  style={{
                    display: "block",
                    color: "#8da6bd",
                    fontSize: "11px",
                    marginBottom: "7px",
                  }}
                >
                  LOCATION
                </span>

                <strong>
                  {officialAlert.location}
                </strong>

              </div>


              <div>

                <span
                  style={{
                    display: "block",
                    color: "#8da6bd",
                    fontSize: "11px",
                    marginBottom: "7px",
                  }}
                >
                  CURRENT RISK
                </span>

                <strong
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {officialAlert.currentRisk}
                  <span
                    style={{
                      marginLeft: "7px",
                      color: "#8da6bd",
                      fontWeight: 500,
                    }}
                  >
                    / 100
                  </span>
                </strong>

              </div>


              <div>

                <span
                  style={{
                    display: "block",
                    color: "#8da6bd",
                    fontSize: "11px",
                    marginBottom: "7px",
                  }}
                >
                  PREDICTED RISK
                </span>

                <strong
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {officialAlert.predictedRisk}
                  <span
                    style={{
                      marginLeft: "7px",
                      color: "#8da6bd",
                      fontWeight: 500,
                    }}
                  >
                    / 100
                  </span>
                </strong>

              </div>

            </div>

          </div>

        )}

      </section>


      {/* =================================================
          LOCATION PERMISSION MODAL
      ================================================= */}

      {showLocationPrompt && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background:
              "rgba(2, 8, 23, 0.78)",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              padding: "28px",
              borderRadius: "18px",
              border: "1px solid #24425f",
              background: "#0b1b2c",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.45)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#123354",
                }}
              >

                <MapPin
                  size={24}
                  color="#60a5fa"
                />

              </div>


              <button
                type="button"
                onClick={
                  handleDenyLocation
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "#8da6bd",
                  cursor: "pointer",
                }}
              >

                <X size={21} />

              </button>

            </div>


            <h2
              style={{
                margin: "0 0 10px",
              }}
            >
              Allow Live Location?
            </h2>


            <p
              style={{
                margin: "0 0 22px",
                color: "#8da6bd",
                lineHeight: 1.6,
              }}
            >
              Can DisasterShield AI access your
              current live location to display it
              on the emergency situation map?
            </p>


            {locationError && (

              <div
                style={{
                  padding: "12px 14px",
                  marginBottom: "18px",
                  borderRadius: "10px",
                  border:
                    "1px solid #7f1d1d",
                  background: "#260d13",
                  color: "#ff8b8b",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {locationError}
              </div>

            )}


            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >

              <button
                type="button"
                onClick={
                  handleDenyLocation
                }
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border:
                    "1px solid #29445e",
                  background:
                    "#0d2236",
                  color: "#b7c8d8",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Not Now
              </button>


              <button
                type="button"
                onClick={
                  handleRequestLocation
                }
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    "#2186e8",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Allow Location
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}