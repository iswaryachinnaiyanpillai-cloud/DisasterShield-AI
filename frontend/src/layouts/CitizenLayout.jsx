import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPinned,
  ClipboardList,
  Siren,
  Building2,
  UserCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { getCurrentUser, logoutUser } from "../services/authService";
import "./CitizenLayout.css";

export default function CitizenLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login/citizen", { replace: true });
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/citizen",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Smart Shelter",
      path: "/citizen/shelter",
      icon: MapPinned,
    },
    {
      label: "Action Plan",
      path: "/citizen/action-plan",
      icon: ClipboardList,
    },
    {
      label: "Emergency SOS",
      path: "/citizen/sos",
      icon: Siren,
    },
    {
      label: "Emergency Centre",
      path: "/citizen/emergency-centres",
      icon: Building2,
    },
    {
      label: "Profile",
      path: "/citizen/profile",
      icon: UserCircle,
    },
  ];

  return (
    <div className="citizen-shell">
      <aside className="citizen-sidebar">
        <div className="citizen-brand">
          <div className="citizen-brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <strong>DisasterShield</strong>
            <span>AI SAFETY PLATFORM</span>
          </div>
        </div>

        <div className="citizen-user-card">
          <div className="citizen-avatar">
            {(user?.name || "C").charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.name || "Citizen"}</strong>
            <span>Citizen Account</span>
          </div>
        </div>

        <nav className="citizen-navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `citizen-nav-item ${
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
          type="button"
          className="citizen-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="citizen-main">
        <Outlet />
      </main>
    </div>
  );
}