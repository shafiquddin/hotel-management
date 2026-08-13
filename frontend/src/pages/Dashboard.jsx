import { useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  addOutline,
  bedOutline,
  checkmarkCircleOutline,
  peopleOutline,
  cashOutline,
} from "ionicons/icons";

import StatCard from "../components/StatCard";
import NewBooking from "../components/NewBooking";

function Dashboard({
  rooms = [],
  bookings = [],
  guests = [],
  setBookings,
  setRooms,
}) {
  const [showBooking, setShowBooking] = useState(false);

  // ------------------------------------
  // SAFE ARRAYS
  // ------------------------------------

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeGuests = Array.isArray(guests) ? guests : [];

  // ------------------------------------
  // ROOM STATISTICS
  // ------------------------------------

  const totalRooms = safeRooms.length;

  const availableRooms = safeRooms.filter(
    (room) => room?.status === "Available",
  ).length;

  const occupiedRooms = safeRooms.filter(
    (room) => room?.status === "Occupied",
  ).length;

  // ------------------------------------
  // REVENUE
  // ------------------------------------

  const revenue = safeBookings.reduce((total, booking) => {
    const amount = Number(booking?.amount);

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  // ------------------------------------
  // SAFE HELPERS
  // ------------------------------------

  const getGuestName = (booking) => {
    if (!booking?.guest) {
      return "N/A";
    }

    // Populated guest object
    if (typeof booking.guest === "object") {
      return booking.guest?.name || "N/A";
    }

    // If backend returns just an ID
    return "N/A";
  };

  const getRoomNumber = (booking) => {
    if (!booking?.room) {
      return "N/A";
    }

    // Populated room object
    if (typeof booking.room === "object") {
      return booking.room?.number || "N/A";
    }

    // If backend returns only room ID
    return "N/A";
  };

  const getGuestInitial = (booking) => {
    const name = getGuestName(booking);

    if (!name || name === "N/A") {
      return "?";
    }

    return name.charAt(0).toUpperCase();
  };

  const getStatus = (booking) => {
    return booking?.status || "Unknown";
  };

  const getStatusClass = (booking) => {
    return getStatus(booking).toLowerCase().replace(/\s+/g, "-");
  };

  const getCheckInDate = (booking) => {
    if (!booking?.checkIn) {
      return "N/A";
    }

    const date = new Date(booking.checkIn);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-IN");
  };

  const getAmount = (booking) => {
    const amount = Number(booking?.amount);

    if (!Number.isFinite(amount)) {
      return "0";
    }

    return amount.toLocaleString("en-IN");
  };

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <div className="page-title">
            <h1>Dashboard</h1>
          </div>

          <p>Welcome back! Here's what's happening at your hotel.</p>
        </div>

        <button
          type="button"
          className="primary-btn booking-btn"
          onClick={() => setShowBooking(true)}
        >
          <IonIcon icon={addOutline} />
          New Booking
        </button>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="stats-grid">
        <StatCard
          title="Total Rooms"
          value={totalRooms}
          icon={<IonIcon icon={bedOutline} />}
        />

        <StatCard
          title="Available Rooms"
          value={availableRooms}
          icon={<IonIcon icon={checkmarkCircleOutline} />}
        />

        <StatCard
          title="Occupied Rooms"
          value={occupiedRooms}
          icon={<IonIcon icon={bedOutline} />}
        />

        <StatCard
          title="Total Guests"
          value={safeGuests.length}
          icon={<IonIcon icon={peopleOutline} />}
        />
      </div>

      {/* =========================
          DASHBOARD GRID
      ========================= */}

      <div className="dashboard-grid">
        {/* =========================
            RECENT BOOKINGS
        ========================= */}

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Bookings</h2>
              <p>Latest hotel reservations</p>
            </div>

            <button type="button" className="view-btn">
              View All
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {safeBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  safeBookings.map((booking, index) => {
                    const guestName = getGuestName(booking);
                    const roomNumber = getRoomNumber(booking);
                    const status = getStatus(booking);

                    /*
                     * _id should normally always exist.
                     * index is only a fallback so a malformed API
                     * response doesn't cause a React key warning.
                     */
                    const bookingKey =
                      booking?._id || booking?.id || `booking-${index}`;

                    return (
                      <tr key={bookingKey}>
                        {/* Guest */}
                        <td>
                          <div className="guest-cell">
                            <div className="avatar">
                              {getGuestInitial(booking)}
                            </div>

                            <span>{guestName}</span>
                          </div>
                        </td>

                        {/* Room */}
                        <td>
                          {roomNumber === "N/A" ? "N/A" : `Room ${roomNumber}`}
                        </td>

                        {/* Check In */}
                        <td>{getCheckInDate(booking)}</td>

                        {/* Amount */}
                        <td>₹{getAmount(booking)}</td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${getStatusClass(booking)}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            REVENUE
        ========================= */}

        <div className="panel revenue-panel">
          <div className="panel-header">
            <div>
              <h2>Revenue</h2>
              <p>Current booking revenue</p>
            </div>

            <div className="revenue-icon">
              <IonIcon icon={cashOutline} />
            </div>
          </div>

          <div className="revenue">
            <span>Total Revenue</span>

            <strong>₹{revenue.toLocaleString("en-IN")}</strong>
          </div>

          <div className="revenue-bar">
            <div />
          </div>

          <div className="revenue-footer">
            <span>Monthly target</span>
            <strong>75%</strong>
          </div>
        </div>
      </div>

      {/* =========================
          NEW BOOKING MODAL
      ========================= */}
      {showBooking && (
        <NewBooking
          rooms={rooms}
          guests={guests}
          bookings={bookings}
          setRooms={setRooms}
          setBookings={setBookings}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
