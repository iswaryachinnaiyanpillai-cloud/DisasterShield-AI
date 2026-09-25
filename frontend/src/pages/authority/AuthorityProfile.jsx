import {
  BellRing,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { getCurrentUser } from "../../services/authService";

export default function AuthorityProfile() {
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    identifier: currentUser?.identifier || "",
    organization:
      currentUser?.organizationName ||
      "Emergency Management Authority",
    phone: currentUser?.phone || "",
    location: currentUser?.location || "",
    notifications: true,
  });

  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  }

  function handleSave(event) {
    event.preventDefault();

    const updatedUser = {
      ...currentUser,
      name: form.name,
      identifier: form.identifier,
      organizationName: form.organization,
      phone: form.phone,
      location: form.location,
    };

    localStorage.setItem(
      "disasterShieldCurrentUser",
      JSON.stringify(updatedUser)
    );

    setSaved(true);
  }

  return (
    <div className="authority-page authority-profile-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="authority-page-header profile-page-header">

        <div>
          <div className="authority-eyebrow">
            <UserRound size={17} />
            AUTHORITY ACCOUNT
          </div>

          <h1>Profile</h1>

          <p>
            Manage authority account and command center information.
          </p>
        </div>

        <div className="profile-security-badge">
          <ShieldCheck size={19} />

          <div>
            <span>Account Security</span>
            <strong>Role-based access enabled</strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          PROFILE SUMMARY
      ====================================================== */}

      <section className="profile-summary-card">

        <div className="profile-avatar">
          {form.name
            ? form.name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div className="profile-summary-info">
          <h2>{form.name || "Authority User"}</h2>

          <p>
            <Building2 size={16} />
            {form.organization}
          </p>

          <div className="profile-status">
            <span />
            Authority Account Active
          </div>
        </div>

        <div className="profile-role-card">
          <ShieldCheck size={20} />

          <div>
            <span>Role</span>
            <strong>Authority</strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          ACCOUNT INFORMATION
      ====================================================== */}

      <form
        className="authority-profile-form"
        onSubmit={handleSave}
      >

        <section className="profile-form-card">

          <div className="profile-section-title">
            <div className="profile-section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h2>Account Information</h2>
              <p>
                Basic authority identity and organization details.
              </p>
            </div>
          </div>

          <div className="profile-form-grid">

            <div className="profile-field">
              <label htmlFor="name">
                Full Name
              </label>

              <div className="profile-input-wrapper">
                <UserRound size={17} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="identifier">
                Official Email / Authority ID
              </label>

              <div className="profile-input-wrapper">
                <Mail size={17} />

                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="authority@example.com"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="organization">
                Authority / Department
              </label>

              <div className="profile-input-wrapper">
                <Building2 size={17} />

                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Authority / Department"
                />
              </div>
            </div>

            <div className="profile-field">
              <label htmlFor="phone">
                Phone
              </label>

              <div className="profile-input-wrapper">
                <Phone size={17} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="profile-field profile-field-full">
              <label htmlFor="location">
                Location
              </label>

              <div className="profile-input-wrapper">
                <MapPin size={17} />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter command center location"
                />
              </div>
            </div>

          </div>

        </section>

        {/* ===================================================
            NOTIFICATIONS
        ==================================================== */}

        <section className="profile-form-card">

          <div className="profile-section-title">
            <div className="profile-section-icon">
              <BellRing size={19} />
            </div>

            <div>
              <h2>Emergency Notifications</h2>

              <p>
                Control emergency intelligence and response
                notifications for this authority account.
              </p>
            </div>
          </div>

          <label className="notification-setting">

            <div className="notification-setting-icon">
              <BellRing size={18} />
            </div>

            <div className="notification-setting-content">
              <strong>
                Receive emergency intelligence and response
                notifications
              </strong>

              <span>
                Get notified about emergency signals, official
                alerts and response activity.
              </span>
            </div>

            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />

            <span className="custom-checkbox">
              {form.notifications && "✓"}
            </span>

          </label>

        </section>

        {/* ===================================================
            SAVE
        ==================================================== */}

        <div className="profile-save-row">

          {saved && (
            <div className="profile-saved-message">
              <CheckCircle2 size={17} />
              Profile saved successfully
            </div>
          )}

          <button
            type="submit"
            className="profile-save-button"
          >
            <Save size={18} />
            Save Profile
          </button>

        </div>

      </form>

    </div>
  );
}