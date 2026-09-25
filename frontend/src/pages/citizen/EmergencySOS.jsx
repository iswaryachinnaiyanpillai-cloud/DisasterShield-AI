import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileImage,
  Info,
  MapPin,
  Navigation,
  Phone,
  Send,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";

import { submitCitizenSOS } from "../../services/emergencyState";

function EmergencySOS() {
  const [form, setForm] = useState({
    emergencyType: "",
    currentLocation: "",
    numberOfPeople: "1",
    injuredPeople: "0",
    assistanceRequirements: "",
    message: "",
  });

  const [photo, setPhoto] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sosId, setSosId] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus(
        "Location services are not available on this device."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setForm((previous) => ({
          ...previous,
          currentLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }));

        setLocationStatus("Current location detected");
      },
      () => {
        setLocationStatus(
          "Location permission was not granted. Enter your location manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhoto(file);
  }

  function removePhoto() {
    setPhoto(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.emergencyType) {
      alert("Please select an emergency type.");
      return;
    }

    if (!form.currentLocation.trim()) {
      alert("Please provide your current location.");
      return;
    }

    if (!form.numberOfPeople || Number(form.numberOfPeople) < 1) {
      alert("Number of people must be at least 1.");
      return;
    }

    if (
      form.injuredPeople === "" ||
      Number(form.injuredPeople) < 0
    ) {
      alert("Please enter the number of injured people.");
      return;
    }

    setIsSending(true);

    const sosData = {
      emergencyType: form.emergencyType,
      currentLocation: form.currentLocation.trim(),
      numberOfPeople: Number(form.numberOfPeople),
      injuredPeople: Number(form.injuredPeople),
      assistanceRequirements:
        form.assistanceRequirements.trim(),
      message: form.message.trim(),
      photoName: photo ? photo.name : "",
    };

    const createdSOS = submitCitizenSOS(sosData);

    setTimeout(() => {
      setSosId(createdSOS?.id || "SOS-" + Date.now());
      setSubmitted(true);
      setIsSending(false);
    }, 500);
  }

  function resetForm() {
    setForm({
      emergencyType: "",
      currentLocation: "",
      numberOfPeople: "1",
      injuredPeople: "0",
      assistanceRequirements: "",
      message: "",
    });

    setPhoto(null);
    setSubmitted(false);
    setSosId("");
    setLocationStatus("");
  }

  if (submitted) {
    return (
      <div className="citizen-sos-page">
        <div className="citizen-sos-success-wrapper">
          <div className="citizen-sos-success-card">
            <div className="citizen-sos-success-icon">
              <CheckCircle2 size={42} />
            </div>

            <div className="citizen-sos-success-badge">
              SOS SENT TO AUTHORITY
            </div>

            <h1>Emergency SOS Sent</h1>

            <p>
              Your emergency request has been sent to the Authority.
              Your information can now be reviewed and responded to by
              the emergency response team.
            </p>

            <div className="citizen-sos-reference">
              <span>SOS Reference</span>
              <strong>{sosId}</strong>
            </div>

            <div className="citizen-sos-success-actions">
              <Link
                to="/citizen"
                className="citizen-sos-dashboard-btn"
              >
                Return to Dashboard
              </Link>

              <button
                type="button"
                className="citizen-sos-new-btn"
                onClick={resetForm}
              >
                Send Another SOS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="citizen-sos-page">
      {/* HEADER */}
      <div className="citizen-sos-header">
        <div>
          <div className="citizen-sos-eyebrow">
            <ShieldAlert size={16} />
            EMERGENCY RESPONSE
          </div>

          <h1>Emergency SOS</h1>

          <p>
            Send your emergency situation and location directly to the
            Authority for assistance.
          </p>
        </div>

        <div className="citizen-sos-emergency-badge">
          <AlertTriangle size={16} />
          Emergency assistance
        </div>
      </div>

      {/* IMPORTANT INFORMATION */}
      <div className="citizen-sos-info-banner">
        <div className="citizen-sos-info-icon">
          <Info size={19} />
        </div>

        <div>
          <strong>Use SOS when you need emergency assistance</strong>

          <p>
            Provide accurate information so the Authority can understand
            your situation and coordinate the appropriate response.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="citizen-sos-layout">
        {/* FORM */}
        <section className="citizen-sos-form-card">
          <div className="citizen-sos-form-heading">
            <div>
              <span>EMERGENCY DETAILS</span>
              <h2>Tell us what is happening</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* EMERGENCY TYPE */}
            <div className="citizen-sos-field">
              <label htmlFor="emergencyType">
                Emergency Type
              </label>

              <div className="citizen-sos-select-wrapper">
                <select
                  id="emergencyType"
                  name="emergencyType"
                  value={form.emergencyType}
                  onChange={handleChange}
                >
                  <option value="">
                    Select emergency type
                  </option>
                  <option value="Medical">Medical</option>
                  <option value="Trapped">Trapped</option>
                  <option value="Missing">Missing</option>
                  <option value="Fire">Fire</option>
                  <option value="Flood">Flood</option>
                  <option value="Accident">Accident</option>
                  <option value="Assistance Required">
                    Assistance Required
                  </option>
                  <option value="Other">Other</option>
                </select>

                <ChevronDown size={17} />
              </div>
            </div>

            {/* LOCATION */}
            <div className="citizen-sos-field">
              <label htmlFor="currentLocation">
                Current Location
              </label>

              <div className="citizen-sos-location-input">
                <MapPin size={18} />

                <input
                  id="currentLocation"
                  name="currentLocation"
                  type="text"
                  placeholder="Enter your current location"
                  value={form.currentLocation}
                  onChange={handleChange}
                />
              </div>

              <div className="citizen-sos-location-status">
                <Navigation size={13} />

                <span>
                  {locationStatus ||
                    "Location can be detected automatically"}
                </span>
              </div>
            </div>

            {/* PEOPLE */}
            <div className="citizen-sos-two-column">
              <div className="citizen-sos-field">
                <label htmlFor="numberOfPeople">
                  Number of People
                </label>

                <div className="citizen-sos-number-input">
                  <Users size={17} />

                  <input
                    id="numberOfPeople"
                    name="numberOfPeople"
                    type="number"
                    min="1"
                    value={form.numberOfPeople}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="citizen-sos-field">
                <label htmlFor="injuredPeople">
                  Injured People
                </label>

                <div className="citizen-sos-number-input">
                  <AlertTriangle size={17} />

                  <input
                    id="injuredPeople"
                    name="injuredPeople"
                    type="number"
                    min="0"
                    value={form.injuredPeople}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ASSISTANCE */}
            <div className="citizen-sos-field">
              <label htmlFor="assistanceRequirements">
                Accessibility / Assistance Requirements
              </label>

              <textarea
                id="assistanceRequirements"
                name="assistanceRequirements"
                rows="3"
                placeholder="Mention elderly people, children, wheelchair assistance, medical support, or any other requirement..."
                value={form.assistanceRequirements}
                onChange={handleChange}
              />
            </div>

            {/* MESSAGE */}
            <div className="citizen-sos-field">
              <label htmlFor="message">
                Emergency Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Describe what is happening and what help you need..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {/* PHOTO */}
            <div className="citizen-sos-field">
              <label>Photo (Optional)</label>

              {!photo ? (
                <label
                  htmlFor="sosPhoto"
                  className="citizen-sos-upload-box"
                >
                  <FileImage size={23} />

                  <div>
                    <strong>Add a photo</strong>
                    <span>
                      Upload an image that can help the response team
                      understand the situation.
                    </span>
                  </div>

                  <input
                    id="sosPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              ) : (
                <div className="citizen-sos-photo-preview">
                  <div className="citizen-sos-photo-info">
                    <FileImage size={22} />

                    <div>
                      <strong>{photo.name}</strong>
                      <span>
                        {(photo.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="Remove photo"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <div className="citizen-sos-submit-area">
              <div className="citizen-sos-submit-note">
                <ShieldAlert size={16} />

                <span>
                  Your SOS will be sent to the Authority for emergency
                  response.
                </span>
              </div>

              <button
                type="submit"
                className="citizen-sos-submit-btn"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <span className="citizen-sos-spinner" />
                    Sending SOS...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Emergency SOS
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* SIDE INFORMATION */}
        <aside className="citizen-sos-side">
          <div className="citizen-sos-help-card">
            <div className="citizen-sos-help-icon">
              <Phone size={22} />
            </div>

            <h3>Need immediate assistance?</h3>

            <p>
              If you are in immediate danger, provide your location and
              situation as accurately as possible.
            </p>
          </div>

          <div className="citizen-sos-side-card">
            <div className="citizen-sos-side-card-title">
              <Clock3 size={18} />
              <h3>What happens next?</h3>
            </div>

            <div className="citizen-sos-process">
              <div className="citizen-sos-process-item">
                <div className="citizen-sos-process-number">
                  01
                </div>

                <div>
                  <strong>SOS received</strong>
                  <p>
                    Your emergency information is sent to the Authority.
                  </p>
                </div>
              </div>

              <div className="citizen-sos-process-item">
                <div className="citizen-sos-process-number">
                  02
                </div>

                <div>
                  <strong>Situation reviewed</strong>
                  <p>
                    Emergency personnel can review your request and
                    requirements.
                  </p>
                </div>
              </div>

              <div className="citizen-sos-process-item">
                <div className="citizen-sos-process-number">
                  03
                </div>

                <div>
                  <strong>Response coordinated</strong>
                  <p>
                    The Authority can assign an appropriate response team.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="citizen-sos-side-card">
            <div className="citizen-sos-side-card-title">
              <AlertTriangle size={18} />
              <h3>Provide accurate information</h3>
            </div>

            <ul className="citizen-sos-tips">
              <li>Give your current location.</li>
              <li>Specify how many people need help.</li>
              <li>Mention injuries clearly.</li>
              <li>Describe any accessibility requirements.</li>
              <li>Explain the situation briefly and clearly.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EmergencySOS;