import {
  LayoutDashboard,
  Brain,
  SlidersHorizontal,
  Siren,
  Users,
  Route,
  Building2,
  BarChart3,
  UserCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
  logoutUser,
} from "../services/authService";

import "../pages/authority/Authority.css";

function AuthorityLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const menu = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/authority",
      end: true,
    },
    {
      label: "Emergency Intelligence",
      icon: Brain,
      path: "/authority/emergency-intelligence",
    },
    {
      label: "What-If Prediction",
      icon: SlidersHorizontal,
      path: "/authority/what-if",
    },
    {
      label: "Emergency SOS",
      icon: Siren,
      path: "/authority/sos",
    },
    {
      label: "Rescue Team",
      icon: Users,
      path: "/authority/rescue",
    },
    {
      label: "Evacuation",
      icon: Route,
      path: "/authority/evacuation",
    },
    {
      label: "Shelter Management",
      icon: Building2,
      path: "/authority/shelters",
    },
    {
      label: "Analytics & Reports",
      icon: BarChart3,
      path: "/authority/analytics",
    },
    {
      label: "Profile",
      icon: UserCircle,
      path: "/authority/profile",
    },
  ];

  function handleLogout() {
    logoutUser();
    navigate("/login", { replace: true });
  }

  return (
    <div className="authority-shell">
      <aside className="authority-sidebar">
        <div className="authority-brand">
          <div className="authority-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1>DisasterShield</h1>
            <span>AI COMMAND CENTER</span>
          </div>
        </div>

        <div className="authority-user-box">
          <div className="authority-avatar">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>

          <div className="authority-user-details">
            <strong>{user?.name || "Authority User"}</strong>
            <span>
              {user?.organizationName ||
                "Emergency Management Authority"}
            </span>
          </div>
        </div>

        <nav className="authority-nav">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `authority-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          className="authority-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="authority-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthorityLayout;