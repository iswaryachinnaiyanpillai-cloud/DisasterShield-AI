import React, {
  Component,
  Suspense,
  lazy,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  getCurrentUser,
} from "./services/authService";


// ======================================================
// AUTH PAGES
// ======================================================

import Login from "./pages/auth/Login";
import CitizenLogin from "./pages/auth/CitizenLogin";
import AuthorityLogin from "./pages/auth/AuthorityLogin";


// ======================================================
// LAYOUTS
// ======================================================

const CitizenLayout = lazy(
  () => import("./layouts/CitizenLayout")
);

const AuthorityLayout = lazy(
  () => import("./layouts/AuthorityLayout")
);


// ======================================================
// CITIZEN PAGES
// ======================================================

const CitizenDashboard = lazy(
  () => import("./pages/citizen/CitizenDashboard")
);

const SmartShelter = lazy(
  () => import("./pages/citizen/SmartShelter")
);

const ActionPlan = lazy(
  () => import("./pages/citizen/ActionPlan")
);

const EmergencySOS = lazy(
  () => import("./pages/citizen/EmergencySOS")
);

const EmergencyCentres = lazy(
  () => import("./pages/citizen/EmergencyCentres")
);

const CitizenProfile = lazy(
  () => import("./pages/citizen/CitizenProfile")
);


// ======================================================
// AUTHORITY PAGES
// ======================================================

const AuthorityDashboard = lazy(
  () => import("./pages/authority/AuthorityDashboard")
);

const EmergencyIntelligence = lazy(
  () => import("./pages/authority/EmergencyIntelligence")
);

const WhatIfPrediction = lazy(
  () => import("./pages/authority/WhatIfPrediction")
);

const AuthoritySOS = lazy(
  () => import("./pages/authority/AuthoritySOS")
);

const RescueTeam = lazy(
  () => import("./pages/authority/RescueTeam")
);

const Evacuation = lazy(
  () => import("./pages/authority/Evacuation")
);

const ShelterManagement = lazy(
  () => import("./pages/authority/ShelterManagement")
);

const Analytics = lazy(
  () => import("./pages/authority/Analytics")
);

const AuthorityProfile = lazy(
  () => import("./pages/authority/AuthorityProfile")
);


// ======================================================
// ERROR BOUNDARY
// ======================================================

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage:
        error?.message ||
        "An unexpected application error occurred.",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "DisasterShield AI Error:",
      error
    );

    console.error(
      "Component Error Info:",
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleLogin = () => {
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #07111f, #0b1728)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "650px",
              background: "#101d30",
              border: "1px solid #263852",
              borderRadius: "18px",
              padding: "32px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "#7f1d1d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "25px",
              }}
            >
              !
            </div>

            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "25px",
              }}
            >
              DisasterShield AI
            </h1>

            <p
              style={{
                margin: "0 0 18px",
                color: "#b8c5d6",
                lineHeight: 1.6,
              }}
            >
              The page encountered an application
              error. Your project has not been
              permanently changed.
            </p>

            <div
              style={{
                background: "#07111f",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "22px",
                overflowX: "auto",
              }}
            >
              <code
                style={{
                  color: "#fca5a5",
                  fontSize: "13px",
                }}
              >
                {this.state.errorMessage}
              </code>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  background: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Reload Application
              </button>

              <button
                type="button"
                onClick={this.handleLogin}
                style={{
                  border:
                    "1px solid #40536d",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  background: "transparent",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


// ======================================================
// LOADING SCREEN
// ======================================================

function LoadingScreen() {
  return (
    <div className="app-loading-screen">
      <div className="app-loading-card">
        <div className="app-loading-spinner"></div>

        <h2>DisasterShield AI</h2>

        <p>
          Loading emergency intelligence platform...
        </p>
      </div>
    </div>
  );
}


// ======================================================
// ROLE GUARD
// ======================================================

function RoleGuard({
  role,
  children,
}) {
  const user = getCurrentUser();

  if (!user) {
    return (
      <Navigate
        to={`/login/${role}`}
        replace
      />
    );
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={`/login/${user.role}`}
        replace
      />
    );
  }

  return children;
}


// ======================================================
// SAFE LAZY ROUTES
// ======================================================

function LazyPage({
  children,
}) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {children}
    </Suspense>
  );
}


// ======================================================
// APPLICATION
// ======================================================

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>

          {/* ==========================================
              PUBLIC / LOGIN
          ========================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/login/citizen"
            element={<CitizenLogin />}
          />

          <Route
            path="/login/authority"
            element={<AuthorityLogin />}
          />


          {/* ==========================================
              CITIZEN PLATFORM
          ========================================== */}

          <Route
            path="/citizen"
            element={
              <RoleGuard role="citizen">
                <LazyPage>
                  <CitizenLayout />
                </LazyPage>
              </RoleGuard>
            }
          >
            <Route
              index
              element={
                <LazyPage>
                  <CitizenDashboard />
                </LazyPage>
              }
            />

            <Route
              path="shelter"
              element={
                <LazyPage>
                  <SmartShelter />
                </LazyPage>
              }
            />

            <Route
              path="action-plan"
              element={
                <LazyPage>
                  <ActionPlan />
                </LazyPage>
              }
            />

            <Route
              path="sos"
              element={
                <LazyPage>
                  <EmergencySOS />
                </LazyPage>
              }
            />

            <Route
              path="emergency-centres"
              element={
                <LazyPage>
                  <EmergencyCentres />
                </LazyPage>
              }
            />

            <Route
              path="profile"
              element={
                <LazyPage>
                  <CitizenProfile />
                </LazyPage>
              }
            />
          </Route>


          {/* ==========================================
              AUTHORITY PLATFORM
          ========================================== */}

          <Route
            path="/authority"
            element={
              <RoleGuard role="authority">
                <LazyPage>
                  <AuthorityLayout />
                </LazyPage>
              </RoleGuard>
            }
          >
            <Route
              index
              element={
                <LazyPage>
                  <AuthorityDashboard />
                </LazyPage>
              }
            />

            <Route
              path="emergency-intelligence"
              element={
                <LazyPage>
                  <EmergencyIntelligence />
                </LazyPage>
              }
            />

            <Route
              path="what-if"
              element={
                <LazyPage>
                  <WhatIfPrediction />
                </LazyPage>
              }
            />

            <Route
              path="sos"
              element={
                <LazyPage>
                  <AuthoritySOS />
                </LazyPage>
              }
            />

            <Route
              path="rescue"
              element={
                <LazyPage>
                  <RescueTeam />
                </LazyPage>
              }
            />

            <Route
              path="evacuation"
              element={
                <LazyPage>
                  <Evacuation />
                </LazyPage>
              }
            />

            <Route
              path="shelters"
              element={
                <LazyPage>
                  <ShelterManagement />
                </LazyPage>
              }
            />

            <Route
              path="analytics"
              element={
                <LazyPage>
                  <Analytics />
                </LazyPage>
              }
            />

            <Route
              path="profile"
              element={
                <LazyPage>
                  <AuthorityProfile />
                </LazyPage>
              }
            />
          </Route>


          {/* ==========================================
              UNKNOWN ROUTES
          ========================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
import "./App.css";