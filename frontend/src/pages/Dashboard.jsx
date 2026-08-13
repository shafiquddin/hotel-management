import { useState } from "react";
import { IonIcon } from "@ionic/react";

import {
  addOutline,
  bedOutline,
  checkmarkCircleOutline,
  peopleOutline,
  cashOutline,
  searchOutline,
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
  const [searchBooking, setSearchBooking] = useState("");

  // =========================================
  // SAFE ARRAYS
  // =========================================

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeGuests = Array.isArray(guests) ? guests : [];

  // =========================================
  // ROOM STATISTICS
  // =========================================

  const totalRooms = safeRooms.length;

  const availableRooms = safeRooms.filter(
    (room) => room?.status === "Available",
  ).length;

  const occupiedRooms = safeRooms.filter(
    (room) => room?.status === "Occupied",
  ).length;

  // =========================================
  // REVENUE
  // =========================================

  const revenue = safeBookings.reduce((total, booking) => {
    const amount = Number(booking?.amount);

    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  // =========================================
  // SAFE HELPERS
  // =========================================

  const getGuestName = (booking) => {
    if (!booking?.guest) {
      return "N/A";
    }

    // Populated guest object
    if (typeof booking.guest === "object") {
      return booking.guest?.name || "N/A";
    }

    // Backend returned only guest ID
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

    // Backend returned only room ID
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

  // =========================================
  // SEARCH + SORT RECENT BOOKINGS
  // =========================================

  const filteredBookings = [...safeBookings]
    .sort((a, b) => {
      const dateA = new Date(a?.checkIn || 0).getTime();
      const dateB = new Date(b?.checkIn || 0).getTime();

      return dateB - dateA;
    })
    .filter((booking) => {
      const search = searchBooking.trim().toLowerCase();

      if (!search) {
        return true;
      }

      const guestName = getGuestName(booking).toLowerCase();

      const roomNumber = String(getRoomNumber(booking)).toLowerCase();

      const status = getStatus(booking).toLowerCase();

      const checkIn = getCheckInDate(booking).toLowerCase();

      const amount = getAmount(booking).toLowerCase();

      return (
        guestName.includes(search) ||
        roomNumber.includes(search) ||
        status.includes(search) ||
        checkIn.includes(search) ||
        amount.includes(search)
      );
    })
    .slice(0, 10);

  // =========================================
  // CLEAR SEARCH
  // =========================================

  const handleClearSearch = () => {
    setSearchBooking("");
  };

  return (
    <div className="dashboard-page">
      {/* =========================================
          HEADER
      ========================================= */}

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

          <span>New Booking</span>
        </button>
      </div>

      {/* =========================================
          STATISTICS
      ========================================= */}

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

      {/* =========================================
          DASHBOARD GRID
      ========================================= */}

      <div className="dashboard-grid">
        {/* =========================================
            RECENT BOOKINGS
        ========================================= */}

        <div className="panel recent-bookings-panel">
          {/* HEADER */}

          <div className="panel-header recent-bookings-header">
            <div className="recent-bookings-title">
              <h2>Recent Bookings</h2>

              <p>Latest hotel reservations</p>
            </div>

            {/* SEARCH + VIEW ALL */}

            <div className="booking-actions">
              <div className="booking-search">
                <IonIcon icon={searchOutline} />

                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchBooking}
                  onChange={(event) => setSearchBooking(event.target.value)}
                  aria-label="Search bookings"
                />

                {searchBooking && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <button type="button" className="view-btn">
                View All
              </button>
            </div>
          </div>

          {/* SEARCH RESULT INFO */}

          {searchBooking && (
            <div className="search-result-info">
              Searching for:
              <strong>"{searchBooking}"</strong>
              <span>
                {filteredBookings.length} result
                {filteredBookings.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* TABLE */}

          <div className="table-container booking-table-container">
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
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-bookings">
                      {searchBooking
                        ? "No bookings match your search."
                        : "No bookings found."}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => {
                    const guestName = getGuestName(booking);

                    const roomNumber = getRoomNumber(booking);

                    const status = getStatus(booking);

                    const bookingKey =
                      booking?._id || booking?.id || `booking-${index}`;

                    return (
                      <tr key={bookingKey}>
                        {/* GUEST */}

                        <td>
                          <div className="guest-cell">
                            <div className="avatar">
                              {getGuestInitial(booking)}
                            </div>

                            <span>{guestName}</span>
                          </div>
                        </td>

                        {/* ROOM */}

                        <td>
                          {roomNumber === "N/A" ? "N/A" : `Room ${roomNumber}`}
                        </td>

                        {/* CHECK IN */}

                        <td>{getCheckInDate(booking)}</td>

                        {/* AMOUNT */}

                        <td>₹{getAmount(booking)}</td>

                        {/* STATUS */}

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

        {/* =========================================
            REVENUE
        ========================================= */}

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

      {/* =========================================
          NEW BOOKING MODAL
      ========================================= */}

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
