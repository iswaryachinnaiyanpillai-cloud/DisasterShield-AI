export const monitoringData = {
  location: "Monitored Flood-Susceptible Zone",

  latitude: 8.0883,
  longitude: 77.5385,

  rainfall: {
    current: 84,
    previous: 71,
    forecast10m: 96,
    unit: "mm/hr",
    trend: "Rising",
  },

  river: {
    current: 4.8,
    previous: 4.4,
    forecast5m: 5.0,
    forecast10m: 5.3,
    unit: "m",
    trend: "Rising",
  },

  soil: {
    current: 78,
    previous: 69,
    forecast10m: 83,
    unit: "%",
    trend: "Increasing Saturation",
  },

  weather: {
    temperature: 29.4,
    previousTemperature: 28.7,
    humidity: 86,
    previousHumidity: 81,
    windSpeed: 18,
    previousWindSpeed: 14,
  },

  sensors: {
    active: 24,
    warning: 4,
    critical: 1,
    previousWarning: 2,
    previousCritical: 0,
  },

  citizenReports: 0,

  population: 17300,
  hospitals: 3,
  shelters: 2,
  affectedRoads: 7,
};

export const riskTimeline = [
  {
    time: "Now",
    risk: 72,
  },
  {
    time: "+5 min",
    risk: 76,
  },
  {
    time: "+10 min",
    risk: 82,
  },
  {
    time: "+15 min",
    risk: 84,
  },
  {
    time: "+20 min",
    risk: 87,
  },
  {
    time: "+30 min",
    risk: 91,
  },
];

export const shelters = [
  {
    id: 1,
    name: "Community Relief Centre A",
    location: "Zone A",
    capacity: 500,
    occupancy: 0,
    accessibility: true,
    medical: true,
    food: true,
    water: true,
    status: "READY",
  },
  {
    id: 2,
    name: "Government Higher Secondary School",
    location: "Zone B",
    capacity: 800,
    occupancy: 0,
    accessibility: true,
    medical: false,
    food: true,
    water: true,
    status: "READY",
  },
  {
    id: 3,
    name: "Municipal Community Hall",
    location: "Zone C",
    capacity: 350,
    occupancy: 0,
    accessibility: false,
    medical: true,
    food: true,
    water: true,
    status: "READY",
  },
];

export const rescueTeams = [
  {
    id: "TEAM-A",
    name: "Rescue Team Alpha",
    members: 6,
    vehicle: "Emergency Response Vehicle",
    status: "AVAILABLE",
  },
  {
    id: "TEAM-B",
    name: "Rescue Team Bravo",
    members: 5,
    vehicle: "Rescue Van",
    status: "AVAILABLE",
  },
];

export function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

export function calculateRisk({
  rainfall,
  riverLevel,
  soilSaturation,
  sensorStress = 50,
}) {
  const rainfallScore = clamp((rainfall / 120) * 100);

  const riverScore = clamp(
    ((riverLevel - 2.5) / (6 - 2.5)) * 100
  );

  const soilScore = clamp(soilSaturation);

  const score =
    rainfallScore * 0.35 +
    riverScore * 0.35 +
    soilScore * 0.2 +
    sensorStress * 0.1;

  return Math.round(clamp(score));
}

export function getRiskMeta(score) {
  if (score >= 100) {
    return {
      label: "PEAK RISK",
      className: "peak",
    };
  }

  if (score >= 90) {
    return {
      label: "CRITICAL",
      className: "critical",
    };
  }

  if (score >= 75) {
    return {
      label: "HIGH RISK",
      className: "high",
    };
  }

  if (score >= 50) {
    return {
      label: "INCREASING RISK",
      className: "increasing",
    };
  }

  return {
    label: "LOW / NORMAL",
    className: "normal",
  };
}