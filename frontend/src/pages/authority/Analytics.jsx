import {
  BarChart3,
  Activity,
  CloudRain,
  Droplets,
  Siren,
  Users,
  Route,
  Building2,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  riskTimeline,
  monitoringData,
} from "../../data/authorityData";

import { getEmergencyState } from "../../services/emergencyState";

function Analytics() {
  const state = getEmergencyState();

  const sosCount =
    state?.citizenSOS?.length || 0;

  const alertCount =
    state?.officialAlert ? 1 : 0;

  const evacuation =
    state?.evacuation || {};

  const rainfallData = [
    { time: "Now", value: 71 },
    { time: "Current", value: 84 },
    { time: "+5m", value: 89 },
    { time: "+10m", value: 96 },
  ];

  return (
    <div className="authority-page">
      <div className="authority-topbar">
        <div>
          <div className="authority-eyebrow">
            ANALYTICS & REPORTS
          </div>

          <h2>Analytics & Reports</h2>

          <p>
            Review risk progression, environmental
            trends and emergency response activity.
          </p>
        </div>

        <div className="intelligence-status">
          <BarChart3 size={18} />
          SYSTEM ANALYTICS
        </div>
      </div>

      <div className="analytics-summary">
        <div>
          <Activity size={21} />
          <span>Current Risk</span>
          <strong>72%</strong>
        </div>

        <div>
          <Activity size={21} />
          <span>Predicted Risk</span>
          <strong>87%</strong>
        </div>

        <div>
          <Siren size={21} />
          <span>Official Alerts</span>
          <strong>{alertCount}</strong>
        </div>

        <div>
          <Users size={21} />
          <span>Citizen SOS</span>
          <strong>{sosCount}</strong>
        </div>

        <div>
          <Route size={21} />
          <span>Evacuation</span>
          <strong>
            {evacuation.completion || 0}%
          </strong>
        </div>

        <div>
          <Building2 size={21} />
          <span>Shelter Utilization</span>
          <strong>0%</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="authority-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                RISK TREND
              </span>

              <h3>Risk Progression</h3>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={riskTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="risk"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="authority-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">
                RAINFALL TREND
              </span>

              <h3>Rainfall Monitoring</h3>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-metrics">
        <div className="analytics-metric">
          <CloudRain size={22} />
          <span>Rainfall</span>
          <strong>
            {monitoringData.rainfall.current} mm/hr
          </strong>
        </div>

        <div className="analytics-metric">
          <Droplets size={22} />
          <span>River Level</span>
          <strong>
            {monitoringData.river.current} m
          </strong>
        </div>

        <div className="analytics-metric">
          <Activity size={22} />
          <span>Soil Saturation</span>
          <strong>
            {monitoringData.soil.current}%
          </strong>
        </div>

        <div className="analytics-metric">
          <Activity size={22} />
          <span>Prediction Confidence</span>
          <strong>91%</strong>
        </div>
      </div>
    </div>
  );
}

export default Analytics;