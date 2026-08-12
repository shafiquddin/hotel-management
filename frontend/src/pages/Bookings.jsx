import { useState } from "react";
import api from "../api/api";

function Bookings({ bookings, setBookings, rooms, guests, setRooms }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    guest: "",
    room: "",
    checkIn: "",
    checkOut: "",
    amount: "",
  });

  // ==============================
  // FORM CHANGE
  // ==============================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==============================
  // RESET FORM
  // ==============================
  const resetForm = () => {
    setForm({
      guest: "",
      room: "",
      checkIn: "",
      checkOut: "",
      amount: "",
    });
  };

  // ==============================
  // CREATE BOOKING
  // ==============================
  const addBooking = async (e) => {
    e.preventDefault();

    if (form.checkOut <= form.checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/bookings", {
        guest: form.guest,
        room: form.room,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        amount: Number(form.amount),
      });

      console.log("Created booking:", response.data);

      /*
       * The backend should return:
       *
       * {
       *   _id: "...",
       *   guest: {
       *     _id: "...",
       *     name: "Rahul Sharma",
       *     email: "...",
       *     phone: "..."
       *   },
       *   room: {
       *     _id: "...",
       *     number: "102",
       *     type: "Deluxe"
       *   },
       *   ...
       * }
       */

      setBookings((prevBookings) => [response.data, ...prevBookings]);

      // Mark room as occupied
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === form.room
            ? {
                ...room,
                status: "Occupied",
              }
            : room,
        ),
      );

      alert("Booking created successfully!");

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Create booking error:", error);

      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE BOOKING
  // ==============================
  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/bookings/${id}`);

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== id),
      );

      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(error.response?.data?.message || "Failed to delete booking");
    }
  };

  // ==============================
  // CHECK IN
  // ==============================
  const checkInBooking = async (id) => {
    try {
      setLoading(true);

      const response = await api.patch(`/bookings/${id}/check-in`);

      const updatedBooking = response.data;

      /*
       * If backend returns only IDs after check-in,
       * preserve the existing populated guest/room.
       */
      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          if (booking._id !== id) {
            return booking;
          }

          return {
            ...booking,
            ...updatedBooking,

            guest:
              updatedBooking.guest && typeof updatedBooking.guest === "object"
                ? updatedBooking.guest
                : booking.guest,

            room:
              updatedBooking.room && typeof updatedBooking.room === "object"
                ? updatedBooking.room
                : booking.room,

            status: "Checked In",
          };
        }),
      );

      // Get room ID safely
      const roomId =
        typeof updatedBooking.room === "object"
          ? updatedBooking.room?._id
          : updatedBooking.room;

      if (roomId) {
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId
              ? {
                  ...room,
                  status: "Occupied",
                }
              : room,
          ),
        );
      }

      alert("Guest checked in successfully!");
    } catch (error) {
      console.error("Check-in error:", error);

      alert(error.response?.data?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CHECK OUT
  // ==============================
  const checkOutBooking = async (id) => {
    try {
      setLoading(true);

      const response = await api.patch(`/bookings/${id}/check-out`);

      const updatedBooking = response.data;

      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          if (booking._id !== id) {
            return booking;
          }

          return {
            ...booking,
            ...updatedBooking,

            guest:
              updatedBooking.guest && typeof updatedBooking.guest === "object"
                ? updatedBooking.guest
                : booking.guest,

            room:
              updatedBooking.room && typeof updatedBooking.room === "object"
                ? updatedBooking.room
                : booking.room,

            status: "Checked Out",
          };
        }),
      );

      // Get room ID safely
      const roomId =
        typeof updatedBooking.room === "object"
          ? updatedBooking.room?._id
          : updatedBooking.room;

      if (roomId) {
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room._id === roomId
              ? {
                  ...room,
                  status: "Available",
                }
              : room,
          ),
        );
      }

      alert("Guest checked out successfully!");
    } catch (error) {
      console.error("Check-out error:", error);

      alert(error.response?.data?.message || "Check-out failed");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SEARCH
  // ==============================
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    return (
      booking.guest?.name?.toLowerCase().includes(searchText) ||
      booking.guest?.email?.toLowerCase().includes(searchText) ||
      booking.room?.number?.toString().includes(searchText) ||
      booking.status?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      {/* ==============================
          HEADER
      ============================== */}

      <div className="page-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage reservations and guest stays.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + New Booking
        </button>
      </div>

      {/* ==============================
          CREATE BOOKING FORM
      ============================== */}

      {showForm && (
        <form className="form-panel" onSubmit={addBooking}>
          <h2>Create Booking</h2>

          <div className="form-grid">
            {/* Guest */}

            <div>
              <label>Guest</label>

              <select
                name="guest"
                value={form.guest}
                onChange={handleChange}
                required
              >
                <option value="">Select guest</option>

                {guests.map((guest) => (
                  <option key={guest._id} value={guest._id}>
                    {guest.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room */}

            <div>
              <label>Room</label>

              <select
                name="room"
                value={form.room}
                onChange={handleChange}
                required
              >
                <option value="">Select room</option>

                {rooms
                  .filter((room) => room.status === "Available")
                  .map((room) => (
                    <option key={room._id} value={room._id}>
                      Room {room.number} - {room.type}
                    </option>
                  ))}
              </select>
            </div>

            {/* Check In */}

            <div>
              <label>Check In</label>

              <input
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
                required
              />
            </div>

            {/* Check Out */}

            <div>
              <label>Check Out</label>

              <input
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
                required
              />
            </div>

            {/* Amount */}

            <div>
              <label>Total Amount</label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                required
              />
            </div>
          </div>

          {/* Form buttons */}

          <div className="action-buttons">
            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      )}

      {/* ==============================
          BOOKINGS TABLE
      ============================== */}

      <div className="panel">
        {/* Search */}

        <div className="search-box">
          <input
            placeholder="Search by guest name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  {/* Guest */}

                  <td>
                    <div className="guest-cell">
                      <div className="avatar">
                        {booking.guest?.name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      <span>{booking.guest?.name || "Unknown"}</span>
                    </div>
                  </td>

                  {/* Room */}

                  <td>Room {booking.room?.number || "-"}</td>

                  {/* Check In */}

                  <td>
                    {booking.checkIn
                      ? new Date(booking.checkIn).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  {/* Check Out */}

                  <td>
                    {booking.checkOut
                      ? new Date(booking.checkOut).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  {/* Amount */}

                  <td>
                    ₹{Number(booking.amount || 0).toLocaleString("en-IN")}
                  </td>

                  {/* Status */}

                  <td>
                    <span
                      className={`badge ${booking.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  {/* Actions */}

                  <td>
                    <div className="action-buttons">
                      {booking.status === "Confirmed" && (
                        <button
                          type="button"
                          className="small-btn"
                          disabled={loading}
                          onClick={() => checkInBooking(booking._id)}
                        >
                          Check In
                        </button>
                      )}

                      {booking.status === "Checked In" && (
                        <button
                          type="button"
                          className="small-btn"
                          disabled={loading}
                          onClick={() => checkOutBooking(booking._id)}
                        >
                          Check Out
                        </button>
                      )}

                      <button
                        type="button"
                        className="delete-btn"
                        disabled={loading}
                        onClick={() => deleteBooking(booking._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bookings;
