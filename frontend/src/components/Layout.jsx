import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IonIcon } from "@ionic/react";

import {
  gridOutline,
  bedOutline,
  peopleOutline,
  calendarOutline,
  settingsOutline,
  logOutOutline,
  businessOutline,
} from "ionicons/icons";

function Layout() {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* ================= MOBILE HEADER ================= */}

      <header className="mobile-header">
        <div className="mobile-header-title">
          <IonIcon icon={businessOutline} />
          <span>Hotel Management</span>
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* ================= OVERLAY ================= */}

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <h2>Hotel Management</h2>

        <nav>
          <NavLink to="/" onClick={closeSidebar}>
            <IonIcon class="icon" icon={gridOutline} />
            Dashboard
          </NavLink>

          <NavLink to="/rooms" onClick={closeSidebar}>
            <IonIcon class="icon" icon={bedOutline} />
            Rooms
          </NavLink>

          <NavLink to="/guests" onClick={closeSidebar}>
            <IonIcon class="icon" icon={peopleOutline} />
            Guests
          </NavLink>

          <NavLink to="/bookings" onClick={closeSidebar}>
            <IonIcon class="icon" icon={calendarOutline} />
            Bookings
          </NavLink>

          <NavLink to="/settings" onClick={closeSidebar}>
            <IonIcon class="icon" icon={settingsOutline} />
            Settings
          </NavLink>
        </nav>

        {/* ================= USER ================= */}

        <div className="sidebar-user">
          <div>
            <strong>{user?.name || "Admin"}</strong>

            <small>{user?.email || ""}</small>
          </div>

          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= OUTLET ================= */}

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
