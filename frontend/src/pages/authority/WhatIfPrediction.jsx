import { useMemo, useState } from "react";

import {
  SlidersHorizontal,
  CloudRain,
  Droplets,
  Activity,
  MapPin,
  Users,
  Hospital,
  Building2,
  Route,
  AlertTriangle,
} from "lucide-react";

import {
  calculateRisk,
  getRiskMeta,
  monitoringData,
} from "../../data/authorityData";

function WhatIfPrediction() {
  const [rainfallIncrease, setRainfallIncrease] =
    useState(0);

  const [riverIncrease, setRiverIncrease] =
    useState(0);

  const [soilIncrease, setSoilIncrease] =
    useState(0);

  const rainfall =
    monitoringData.rainfall.current *
    (1 + rainfallIncrease / 100);

  const river =
    monitoringData.river.current +
    riverIncrease;

  const soil = Math.min(
    monitoringData.soil.current + soilIncrease,
    100
  );

  const projectedRisk = useMemo(
    () =>
      calculateRisk({
        rainfall,
        riverLevel: river,
        soilSaturation: soil,
        sensorStress: 70,
      }),
    [rainfall, river, soil]
  );

  const riskMeta = getRiskMeta(projectedRisk);

  function applyScenario(type) {
    if (type === "rainfall") {
      setRainfallIncrease(30);
      setRiverIncrease(0);
      setSoilIncrease(5);
    }

    if (type === "river") {
      setRainfallIncrease(0);
      setRiverIncrease(1);
      setSoilIncrease(5);
    }

    if (type === "combined") {
      setRainfallIncrease(30);
      setRiverIncrease(1);
      setSoilIncrease(10);
    }

    if (type === "reset") {
      setRainfallIncrease(0);
      setRiverIncrease(0);
      setSoilIncrease(0);
    }
  }

  return (
    <div className="authority-page">
      <div className="authority-topbar">
        <div>
          <div className="authority-eyebrow">
            DECISION SUPPORT
          </div>

          <h2>What-If Prediction</h2>

          <p>
            Explore possible future environmental
            conditions and understand their potential
            effect on disaster risk.
          </p>
        </div>

        <div className="intelligence-status">
          <SlidersHorizontal size={18} />
          SCENARIO ANALYSIS
        </div>
      </div>

      <section className="scenario-buttons">
        <button
          onClick={() => applyScenario("rainfall")}
        >
          Rainfall +30%
        </button>

        <button
          onClick={() => applyScenario("river")}
        >
          River Level +1m
        </button>

        <button
          onClick={() => applyScenario("combined")}
        >
          Combined Scenario
        </button>

        <button
          className="outline-button"
          onClick={() => applyScenario("reset")}
        >
          Reset
        </button>
      </section>

      <section className="scenario-layout">
        <div className="authority-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                ENVIRONMENT CONTROLS
              </span>

              <h3>Modify Conditions</h3>
            </div>
          </div>

          <div className="slider-block">
            <div className="slider-label">
              <div>
                <CloudRain size={19} />
                <span>Rainfall Increase</span>
              </div>

              <strong>
                +{rainfallIncrease}%
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={rainfallIncrease}
              onChange={(e) =>
                setRainfallIncrease(
                  Number(e.target.value)
                )
              }
            />

            <small>
              Projected rainfall:{" "}
              {rainfall.toFixed(1)} mm/hr
            </small>
          </div>

          <div className="slider-block">
            <div className="slider-label">
              <div>
                <Droplets size={19} />
                <span>River Level Increase</span>
              </div>

              <strong>
                +{riverIncrease.toFixed(1)} m
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={riverIncrease}
              onChange={(e) =>
                setRiverIncrease(
                  Number(e.target.value)
                )
              }
            />

            <small>
              Projected river level:{" "}
              {river.toFixed(1)} m
            </small>
          </div>

          <div className="slider-block">
            <div className="slider-label">
              <div>
                <Activity size={19} />
                <span>Soil Saturation Increase</span>
              </div>

              <strong>
                +{soilIncrease} pts
              </strong>
            </div>

            <input
              type="range"
              min="0"
              max="20"
              value={soilIncrease}
              onChange={(e) =>
                setSoilIncrease(
                  Number(e.target.value)
                )
              }
            />

            <small>
              Projected soil saturation: {soil}%
            </small>
          </div>
        </div>

        <div className="authority-panel scenario-result">
          <span className="section-kicker">
            PROJECTED RESULT
          </span>

          <h3>Potential Risk</h3>

          <div className="scenario-risk">
            {projectedRisk}%
          </div>

          <div
            className={`risk-badge ${riskMeta.className}`}
          >
            {riskMeta.label}
          </div>

          <p>
            This scenario suggests how risk may
            change if the selected environmental
            conditions occur.
          </p>

          <div className="scenario-impact">
            <div>
              <MapPin size={18} />
              <span>Potential affected zones</span>
              <strong>
                {projectedRisk >= 90
                  ? 9
                  : projectedRisk >= 75
                  ? 7
                  : 4}
              </strong>
            </div>

            <div>
              <Users size={18} />
              <span>Potential population</span>
              <strong>
                {projectedRisk >= 90
                  ? "24,800"
                  : projectedRisk >= 75
                  ? "17,300"
                  : "8,500"}
              </strong>
            </div>

            <div>
              <Hospital size={18} />
              <span>Hospitals</span>
              <strong>3</strong>
            </div>

            <div>
              <Building2 size={18} />
              <span>Shelters</span>
              <strong>2</strong>
            </div>

            <div>
              <Route size={18} />
              <span>Potential roads</span>
              <strong>
                {projectedRisk >= 90 ? 11 : 7}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="authority-panel">
        <div className="panel-heading">
          <div>
            <span className="section-kicker">
              DISASTER PROGRESSION
            </span>

            <h3>Potential Timeline</h3>
          </div>
        </div>

        <div className="scenario-timeline">
          <div>
            <span>NOW</span>
            <strong>72%</strong>
            <small>Current condition</small>
          </div>

          <div className="timeline-arrow">→</div>

          <div>
            <span>+5 MIN</span>
            <strong>
              {Math.min(projectedRisk + 2, 100)}%
            </strong>
            <small>Initial progression</small>
          </div>

          <div className="timeline-arrow">→</div>

          <div>
            <span>+15 MIN</span>
            <strong>
              {Math.min(projectedRisk + 6, 100)}%
            </strong>
            <small>Increasing exposure</small>
          </div>

          <div className="timeline-arrow">→</div>

          <div>
            <span>+30 MIN</span>
            <strong>{projectedRisk}%</strong>
            <small>Scenario projection</small>
          </div>
        </div>
      </section>

      <div className="scenario-warning">
        <AlertTriangle size={20} />

        <div>
          <strong>
            Decision-support prediction
          </strong>

          <p>
            This analysis does not issue a citizen
            emergency alert. The authority must review
            the information and make the official
            emergency decision separately.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WhatIfPrediction;