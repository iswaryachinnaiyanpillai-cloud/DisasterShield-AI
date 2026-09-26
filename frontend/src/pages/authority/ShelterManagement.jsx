import { useEffect, useState } from "react";

import {
  Building2,
  Users,
  HeartPulse,
  Utensils,
  Droplets,
  Accessibility,
  Plus,
  X,
} from "lucide-react";

import {
  getShelters,
  addShelter,
  getAvailableCapacity,
} from "../../services/shelterService";

function ShelterManagement() {
  const [shelters, setShelters] = useState(
    getShelters()
  );

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    occupancy: "0",
    latOffset: "0.006",
    lngOffset: "0.006",
    accessibility: true,
    medical: true,
    food: true,
    water: true,
  });

  useEffect(() => {
    const refreshShelters = () => {
      setShelters(getShelters());
    };

    window.addEventListener(
      "disasterShieldSheltersChanged",
      refreshShelters
    );

    window.addEventListener(
      "storage",
      refreshShelters
    );

    return () => {
      window.removeEventListener(
        "disasterShieldSheltersChanged",
        refreshShelters
      );

      window.removeEventListener(
        "storage",
        refreshShelters
      );
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: checked,
    }));
  };

  const handleAddShelter = (event) => {
    event.preventDefault();

    const capacity = Number(form.capacity);
    const occupancy = Number(form.occupancy);

    if (!form.name.trim()) {
      alert("Please enter a shelter name.");
      return;
    }

    if (!form.location.trim()) {
      alert("Please enter the shelter location.");
      return;
    }

    if (!capacity || capacity <= 0) {
      alert("Please enter a valid capacity.");
      return;
    }

    if (occupancy < 0 || occupancy > capacity) {
      alert(
        "Occupancy must be between 0 and the shelter capacity."
      );
      return;
    }

    addShelter({
      name: form.name.trim(),

      description:
        "Emergency shelter with essential facilities",

      location: form.location.trim(),

      capacity,

      occupancy,

      latOffset: Number(form.latOffset) || 0.006,

      lngOffset: Number(form.lngOffset) || 0.006,

      status:
        occupancy >= capacity
          ? "FULL"
          : "READY",

      accessibility:
        form.accessibility,

      medical:
        form.medical,

      food:
        form.food,

      water:
        form.water,
    });

    setForm({
      name: "",
      location: "",
      capacity: "",
      occupancy: "0",
      latOffset: "0.006",
      lngOffset: "0.006",
      accessibility: true,
      medical: true,
      food: true,
      water: true,
    });

    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="authority-page">
      <div className="authority-topbar">
        <div>
          <div className="authority-eyebrow">
            SHELTER OPERATIONS
          </div>

          <h2>Shelter Management</h2>

          <p>
            Monitor shelter capacity, facilities and
            operational readiness.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowAddForm(!showAddForm)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {showAddForm ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Shelter
            </>
          )}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddShelter}
          style={{
            marginBottom: "24px",
            padding: "24px",
            borderRadius: "16px",
            background: "white",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
            }}
          >
            Add New Shelter
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <label>
              <strong>Shelter Name</strong>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Example: City Relief Shelter"
                style={inputStyle}
              />
            </label>

            <label>
              <strong>Location</strong>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Example: Anna Nagar"
                style={inputStyle}
              />
            </label>

            <label>
              <strong>Capacity</strong>

              <input
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                placeholder="500"
                style={inputStyle}
              />
            </label>

            <label>
              <strong>Current Occupancy</strong>

              <input
                type="number"
                name="occupancy"
                min="0"
                value={form.occupancy}
                onChange={handleChange}
                placeholder="0"
                style={inputStyle}
              />
            </label>

            <label>
              <strong>Map Latitude Offset</strong>

              <input
                type="number"
                step="0.000001"
                name="latOffset"
                value={form.latOffset}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>

            <label>
              <strong>Map Longitude Offset</strong>

              <input
                type="number"
                step="0.000001"
                name="lngOffset"
                value={form.lngOffset}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </div>

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <strong>Available Facilities</strong>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "18px",
                marginTop: "12px",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="accessibility"
                  checked={form.accessibility}
                  onChange={
                    handleCheckboxChange
                  }
                />{" "}
                Accessibility
              </label>

              <label>
                <input
                  type="checkbox"
                  name="medical"
                  checked={form.medical}
                  onChange={
                    handleCheckboxChange
                  }
                />{" "}
                Medical
              </label>

              <label>
                <input
                  type="checkbox"
                  name="food"
                  checked={form.food}
                  onChange={
                    handleCheckboxChange
                  }
                />{" "}
                Food
              </label>

              <label>
                <input
                  type="checkbox"
                  name="water"
                  checked={form.water}
                  onChange={
                    handleCheckboxChange
                  }
                />{" "}
                Water
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <button
              type="submit"
              style={primaryButtonStyle}
            >
              <Plus size={17} />
              Add Shelter
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="shelter-management-grid">
        {shelters.map((shelter) => {
          const available =
            getAvailableCapacity(shelter);

          const status =
            shelter.occupancy >= shelter.capacity
              ? "FULL"
              : "READY";

          return (
            <div
              className="shelter-management-card"
              key={shelter.id}
            >
              <div className="shelter-header">
                <div className="shelter-icon">
                  <Building2 size={23} />
                </div>

                <div>
                  <h3>{shelter.name}</h3>

                  <span>
                    {shelter.location}
                  </span>
                </div>

                <strong className="ready-badge">
                  {status}
                </strong>
              </div>

              <div className="capacity-section">
                <div>
                  <span>Capacity</span>

                  <strong>
                    {shelter.capacity}
                  </strong>
                </div>

                <div>
                  <span>Occupancy</span>

                  <strong>
                    {shelter.occupancy}
                  </strong>
                </div>

                <div>
                  <span>Available</span>

                  <strong>
                    {available}
                  </strong>
                </div>
              </div>

              <div className="facility-grid">
                <span
                  className={
                    shelter.accessibility
                      ? "facility-active"
                      : ""
                  }
                >
                  <Accessibility size={16} />
                  Accessibility
                </span>

                <span
                  className={
                    shelter.medical
                      ? "facility-active"
                      : ""
                  }
                >
                  <HeartPulse size={16} />
                  Medical
                </span>

                <span
                  className={
                    shelter.food
                      ? "facility-active"
                      : ""
                  }
                >
                  <Utensils size={16} />
                  Food
                </span>

                <span
                  className={
                    shelter.water
                      ? "facility-active"
                      : ""
                  }
                >
                  <Droplets size={16} />
                  Water
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginTop: "7px",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
  fontSize: "14px",
};

const primaryButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "7px",
  padding: "10px 16px",
  border: "none",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "600",
  background: "white",
};

export default ShelterManagement;