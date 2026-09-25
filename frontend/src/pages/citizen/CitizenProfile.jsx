import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  HeartPulse,
  Globe,
  Bell,
  Pencil,
  Save,
  X,
  LogOut,
  CheckCircle2,
} from "lucide-react";

import {
  getCurrentUser,
  updateCurrentUser,
  logoutUser,
} from "../../services/authService";

import "./Citizen.css";

function CitizenProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    emergencyContact: "",
    assistanceRequirements: "",
    language: "English",
    notifications: true,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login/citizen", { replace: true });
      return;
    }

    setUser(currentUser);

    setForm({
      name: currentUser.name || "",
      phone: currentUser.phone || "",
      email: currentUser.identifier || currentUser.email || "",
      location: currentUser.location || "",
      emergencyContact: currentUser.emergencyContact || "",
      assistanceRequirements:
        currentUser.assistanceRequirements || "",
      language: currentUser.language || "English",
      notifications:
        currentUser.notifications !== undefined
          ? currentUser.notifications
          : true,
    });
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleEdit = () => {
    setSaved(false);
    setEditing(true);
  };

  const handleCancel = () => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phone: user.phone || "",
      email: user.identifier || user.email || "",
      location: user.location || "",
      emergencyContact: user.emergencyContact || "",
      assistanceRequirements:
        user.assistanceRequirements || "",
      language: user.language || "English",
      notifications:
        user.notifications !== undefined
          ? user.notifications
          : true,
    });

    setEditing(false);
    setSaved(false);
  };

  const handleSave = () => {
    const updatedUser = updateCurrentUser({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      emergencyContact: form.emergencyContact.trim(),
      assistanceRequirements:
        form.assistanceRequirements.trim(),
      language: form.language,
      notifications: form.notifications,
    });

    if (updatedUser) {
      setUser(updatedUser);
      setEditing(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="citizen-profile-loading">
        Loading profile...
      </div>
    );
  }

  const displayName = form.name || "Citizen";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="citizen-profile-page">

      {/* HEADER */}
      <div className="citizen-profile-header">
        <div>
          <span className="citizen-profile-eyebrow">
            CITIZEN ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and emergency
            preferences.
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            className="citizen-profile-edit-btn"
            onClick={handleEdit}
          >
            <Pencil size={17} />
            Edit Profile
          </button>
        ) : (
          <div className="citizen-profile-header-actions">
            <button
              type="button"
              className="citizen-profile-cancel-btn"
              onClick={handleCancel}
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="button"
              className="citizen-profile-save-btn"
              onClick={handleSave}
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* SUCCESS MESSAGE */}
      {saved && (
        <div className="citizen-profile-success">
          <CheckCircle2 size={19} />
          <span>Profile updated successfully.</span>
        </div>
      )}

      {/* PROFILE HERO */}
      <section className="citizen-profile-hero">

        <div className="citizen-profile-avatar">
          {initials || "C"}
        </div>

        <div className="citizen-profile-identity">
          <h2>{displayName}</h2>

          <span className="citizen-profile-role">
            <ShieldCheck size={15} />
            Citizen
          </span>

          <p>
            Keep your emergency information updated so
            authorities can respond effectively when needed.
          </p>
        </div>

        <div className="citizen-profile-account-status">
          <span className="citizen-profile-status-dot" />
          <div>
            <strong>Account Active</strong>
            <small>DisasterShield Citizen</small>
          </div>
        </div>

      </section>

      {/* MAIN GRID */}
      <div className="citizen-profile-grid">

        {/* PERSONAL INFORMATION */}
        <section className="citizen-profile-card">

          <div className="citizen-profile-card-header">
            <div className="citizen-profile-card-icon">
              <User size={19} />
            </div>

            <div>
              <h3>Personal Information</h3>
              <p>Your basic account details</p>
            </div>
          </div>

          <div className="citizen-profile-fields">

            <div className="citizen-profile-field">
              <label>Full Name</label>

              <div className="citizen-profile-input-wrap">
                <User size={17} />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="citizen-profile-field">
              <label>Phone Number</label>

              <div className="citizen-profile-input-wrap">
                <Phone size={17} />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="citizen-profile-field">
              <label>Email Address</label>

              <div className="citizen-profile-input-wrap">
                <Mail size={17} />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  placeholder="Your email address"
                />
              </div>

              <small className="citizen-profile-help">
                Email is linked to your account and cannot be
                changed here.
              </small>
            </div>

            <div className="citizen-profile-field">
              <label>Current Location</label>

              <div className="citizen-profile-input-wrap">
                <MapPin size={17} />

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter your location"
                />
              </div>
            </div>

          </div>
        </section>

        {/* EMERGENCY INFORMATION */}
        <section className="citizen-profile-card">

          <div className="citizen-profile-card-header">
            <div className="citizen-profile-card-icon emergency">
              <HeartPulse size={19} />
            </div>

            <div>
              <h3>Emergency Information</h3>
              <p>Information that can help during emergencies</p>
            </div>
          </div>

          <div className="citizen-profile-fields">

            <div className="citizen-profile-field">
              <label>Emergency Contact</label>

              <div className="citizen-profile-input-wrap">
                <Phone size={17} />

                <input
                  type="tel"
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div className="citizen-profile-field citizen-profile-field-full">
              <label>
                Accessibility / Assistance Requirements
              </label>

              <textarea
                name="assistanceRequirements"
                value={form.assistanceRequirements}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Example: wheelchair assistance, elderly person, hearing assistance, medical support..."
                rows="4"
              />
            </div>

          </div>

          <div className="citizen-profile-info-note">
            <HeartPulse size={17} />

            <span>
              This information may help authorities and rescue
              teams understand the assistance required during
              an emergency.
            </span>
          </div>

        </section>

        {/* PREFERENCES */}
        <section className="citizen-profile-card">

          <div className="citizen-profile-card-header">
            <div className="citizen-profile-card-icon">
              <Globe size={19} />
            </div>

            <div>
              <h3>Preferences</h3>
              <p>Customize your DisasterShield experience</p>
            </div>
          </div>

          <div className="citizen-profile-preferences">

            <div className="citizen-profile-preference-row">

              <div className="citizen-profile-preference-info">
                <div className="citizen-profile-preference-icon">
                  <Globe size={18} />
                </div>

                <div>
                  <strong>Language</strong>
                  <span>
                    Choose your preferred communication
                    language.
                  </span>
                </div>
              </div>

              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Hindi">Hindi</option>
              </select>

            </div>

            <div className="citizen-profile-preference-row">

              <div className="citizen-profile-preference-info">
                <div className="citizen-profile-preference-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <strong>Emergency Notifications</strong>
                  <span>
                    Receive important emergency alerts and
                    response notifications.
                  </span>
                </div>
              </div>

              <label className="citizen-profile-switch">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={form.notifications}
                  onChange={handleChange}
                  disabled={!editing}
                />

                <span className="citizen-profile-slider" />
              </label>

            </div>

          </div>
        </section>

        {/* SECURITY */}
        <section className="citizen-profile-card citizen-profile-security">

          <div className="citizen-profile-card-header">
            <div className="citizen-profile-card-icon security">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h3>Account Security</h3>
              <p>Your DisasterShield account</p>
            </div>
          </div>

          <div className="citizen-profile-security-content">

            <div>
              <strong>Citizen Access</strong>
              <span>
                Your account is protected by role-based access
                controls.
              </span>
            </div>

            <span className="citizen-profile-protected">
              <CheckCircle2 size={15} />
              Protected
            </span>

          </div>

        </section>

      </div>

      {/* LOGOUT */}
      <section className="citizen-profile-logout-card">

        <div>
          <h3>Sign out of DisasterShield</h3>

          <p>
            You will need to log in again to access your
            Citizen platform.
          </p>
        </div>

        <button
          type="button"
          className="citizen-profile-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>

      </section>

    </div>
  );
}

export default CitizenProfile;