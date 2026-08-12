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

function Dashboard({ rooms, bookings, guests, setBookings, setRooms }) {
  const [showBooking, setShowBooking] = useState(false);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "Available",
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied",
  ).length;

  const revenue = bookings.reduce(
    (total, booking) => total + Number(booking.amount),
    0,
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">
            <h1>Dashboard</h1>
          </div>

          <p>Welcome back! Here's what's happening at your hotel.</p>
        </div>

        <button
          className="primary-btn booking-btn"
          onClick={() => setShowBooking(true)}
        >
          <IonIcon icon={addOutline} />
          New Booking
        </button>
      </div>

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
          value={guests.length}
          icon={<IonIcon icon={peopleOutline} />}
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Bookings</h2>
              <p>Latest hotel reservations</p>
            </div>

            <button className="view-btn">View All</button>
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
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="guest-cell">
                        <div className="avatar">
                          {booking.guest.name.charAt(0)}
                        </div>

                        <span>{booking.guest.name}</span>
                      </div>
                    </td>

                    <td>Room {booking.room.number}</td>

                    <td>
                      {new Date(booking.checkIn).toLocaleDateString("en-IN")}
                    </td>

                    <td>₹{Number(booking.amount).toLocaleString("en-IN")}</td>

                    <td>
                      <span
                        className={`badge ${booking.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

            <strong>₹{revenue.toLocaleString()}</strong>
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

      {showBooking && (
        <NewBooking
          rooms={rooms}
          guests={guests}
          bookings={bookings}
          setRooms={setRooms}
          setBookings={setBookings}
        />
      )}
    </div>
  );
}

export default Dashboard;
