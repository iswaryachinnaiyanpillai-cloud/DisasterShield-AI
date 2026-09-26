const SHELTER_KEY =
  "disasterShieldShelters";

/*
  Initial shelters.

  These are now the single source of truth
  for both Citizen and Authority platforms.
*/

const initialShelters = [
  {
    id: 1,
    name: "Community Safe Shelter",
    description:
      "Emergency shelter with essential facilities",

    capacity: 250,
    occupancy: 0,

    location: "Community Safe Shelter Area",

    latOffset: 0.012,
    lngOffset: 0.008,

    status: "READY",

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

    capacity: 400,
    occupancy: 0,

    location: "Government Relief Centre Area",

    latOffset: -0.009,
    lngOffset: 0.014,

    status: "READY",

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

    capacity: 180,
    occupancy: 0,

    location: "Emergency Support Centre Area",

    latOffset: 0.004,
    lngOffset: -0.014,

    status: "READY",

    accessibility: true,
    medical: true,
    food: true,
    water: true,
  },
];

/*
  Get all shelters.
*/
export function getShelters() {
  const saved =
    localStorage.getItem(SHELTER_KEY);

  if (!saved) {
    localStorage.setItem(
      SHELTER_KEY,
      JSON.stringify(initialShelters)
    );

    return initialShelters;
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(
      SHELTER_KEY,
      JSON.stringify(initialShelters)
    );

    return initialShelters;
  }
}

/*
  Save all shelters.
*/
export function saveShelters(shelters) {
  localStorage.setItem(
    SHELTER_KEY,
    JSON.stringify(shelters)
  );

  window.dispatchEvent(
    new CustomEvent(
      "disasterShieldSheltersChanged"
    )
  );

  return shelters;
}

/*
  Add a new shelter.
*/
export function addShelter(shelter) {
  const shelters = getShelters();

  const newShelter = {
    ...shelter,

    id:
      Date.now(),

    occupancy:
      Number(shelter.occupancy) || 0,

    capacity:
      Number(shelter.capacity) || 0,

    status:
      shelter.status || "READY",
  };

  const updatedShelters = [
    ...shelters,
    newShelter,
  ];

  saveShelters(updatedShelters);

  return newShelter;
}

/*
  Update an existing shelter.
*/
export function updateShelter(
  shelterId,
  updates
) {
  const shelters = getShelters();

  const updatedShelters =
    shelters.map((shelter) =>
      shelter.id === shelterId
        ? {
            ...shelter,
            ...updates,
          }
        : shelter
    );

  saveShelters(updatedShelters);

  return updatedShelters;
}

/*
  Citizen reached shelter.

  This increases the actual occupancy
  of that shelter.
*/
export function recordShelterArrival(
  shelterId
) {
  const shelters = getShelters();

  const updatedShelters =
    shelters.map((shelter) => {
      if (shelter.id !== shelterId) {
        return shelter;
      }

      const newOccupancy =
        Math.min(
          shelter.capacity,
          shelter.occupancy + 1
        );

      return {
        ...shelter,
        occupancy: newOccupancy,
      };
    });

  saveShelters(updatedShelters);

  return updatedShelters;
}

/*
  Calculate available capacity.
*/
export function getAvailableCapacity(
  shelter
) {
  return Math.max(
    0,
    shelter.capacity -
      shelter.occupancy
  );
}