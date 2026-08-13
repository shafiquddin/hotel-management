import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IonIcon } from "@ionic/react";

import {
  gridOutline,
  bedOutline,
  peopleOutline,
  calendarOutline,
  cashOutline,
  restaurantOutline,
  settingsOutline,
  logOutOutline,
  menuOutline,
  closeOutline,
  personOutline,
} from "ionicons/icons";

import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: gridOutline,
    },
    {
      label: "Rooms",
      path: "/rooms",
      icon: bedOutline,
    },
    {
      label: "Guests",
      path: "/guests",
      icon: peopleOutline,
    },
    {
      label: "Bookings",
      path: "/bookings",
      icon: calendarOutline,
    },
    {
      label: "Revenue",
      path: "/revenue",
      icon: cashOutline,
    },
    {
      label: "Restaurant",
      path: "/restaurant",
      icon: restaurantOutline,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: settingsOutline,
    },
  ];

  return (
    <div className="app">
      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <IonIcon icon={menuOutline} />
        </button>

        <div className="mobile-logo">
          <div className="mobile-logo-icon">
            <IonIcon icon={bedOutline} />
          </div>

          <strong>Hotel Management</strong>
        </div>

        <div className="mobile-user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </header>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          {/* LOGO */}
          <div className="logo">
            <div className="logo-icon">
              <IonIcon icon={bedOutline} />
            </div>

            <div>
              <strong>Hotel Management</strong>
              <span>Admin Panel</span>
            </div>

            {/* MOBILE CLOSE */}
            <button
              type="button"
              className="mobile-sidebar-close"
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <IonIcon icon={closeOutline} />
            </button>
          </div>

          {/* NAVIGATION */}
          <div className="menu-title">MAIN MENU</div>

          <nav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <IonIcon icon={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="user-info">
              <strong>{user?.name || "User"}</strong>

              <small>{user?.role || "Staff"}</small>
            </div>
          </div>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">{children}</main>
    </div>
  );
}

export default DashboardLayout;
