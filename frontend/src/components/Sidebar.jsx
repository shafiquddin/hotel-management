import { NavLink } from "react-router-dom";
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

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <IonIcon icon={businessOutline} />
        </div>

        <div>
          <strong>HotelPro</strong>
          <span>Management</span>
        </div>
      </div>

      <div className="menu-title">MAIN MENU</div>

      <nav>
        <NavLink to="/" end>
          <IonIcon icon={gridOutline} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/rooms">
          <IonIcon icon={bedOutline} />
          <span>Rooms</span>
        </NavLink>

        <NavLink to="/guests">
          <IonIcon icon={peopleOutline} />
          <span>Guests</span>
        </NavLink>

        <NavLink to="/bookings">
          <IonIcon icon={calendarOutline} />
          <span>Bookings</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings">
          <IonIcon icon={settingsOutline} />
          <span>Settings</span>
        </NavLink>

        <button className="logout-btn">
          <IonIcon icon={logOutOutline} />
          <span>Logout</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">A</div>

          <div>
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
