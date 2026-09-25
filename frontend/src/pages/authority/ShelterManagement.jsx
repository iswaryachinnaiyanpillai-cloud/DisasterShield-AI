import {
  Building2,
  Users,
  HeartPulse,
  Utensils,
  Droplets,
  Accessibility,
} from "lucide-react";

import { shelters } from "../../data/authorityData";

function ShelterManagement() {
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
      </div>

      <div className="shelter-management-grid">
        {shelters.map((shelter) => {
          const available =
            shelter.capacity - shelter.occupancy;

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
                  {shelter.status}
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
                  <strong>{available}</strong>
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

export default ShelterManagement;