import { useEffect, useState } from "react";
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
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
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
  // OPEN MODAL
  // ==============================
  const openBookingModal = () => {
    resetForm();
    setShowForm(true);
  };

  // ==============================
  // CLOSE MODAL
  // ==============================
  const closeBookingModal = () => {
    if (loading) return;

    resetForm();
    setShowForm(false);
  };

  // ==============================
  // ESCAPE KEY
  // ==============================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showForm && !loading) {
        closeBookingModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showForm, loading]);

  // ==============================
  // CREATE BOOKING
  // ==============================
  const addBooking = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.guest) {
      alert("Please select a guest.");
      return;
    }

    if (!form.room) {
      alert("Please select a room.");
      return;
    }

    if (!form.checkIn) {
      alert("Please select check-in date.");
      return;
    }

    if (!form.checkOut) {
      alert("Please select check-out date.");
      return;
    }

    if (form.checkOut <= form.checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
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

      // Add new booking
      setBookings((prevBookings) => [response.data, ...prevBookings]);

      // Mark room occupied
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

      // IMPORTANT:
      // Close modal BEFORE alert
      resetForm();
      setShowForm(false);

      alert("Booking created successfully!");
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
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await api.delete(`/bookings/${id}`);

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== id),
      );

      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Delete booking error:", error);

      alert(error.response?.data?.message || "Failed to delete booking");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CHECK IN
  // ==============================
  const checkInBooking = async (id) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await api.patch(`/bookings/${id}/check-in`);

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

            status: "Checked In",
          };
        }),
      );

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
    if (loading) return;

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
    const searchText = search.toLowerCase().trim();

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

        <button className="primary-btn" onClick={openBookingModal}>
          + New Booking
        </button>
      </div>

      {/* ==============================
          BOOKING MODAL
      ============================== */}

      {showForm && (
        <div
          className="booking-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !loading) {
              closeBookingModal();
            }
          }}
        >
          <div
            className="booking-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="booking-modal-header">
              <div>
                <h2>Create Booking</h2>
                <p>Add a new hotel reservation</p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeBookingModal}
                disabled={loading}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Form */}

            <form onSubmit={addBooking}>
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

              {/* Modal Footer */}

              <div className="booking-modal-footer">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={closeBookingModal}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================
          BOOKINGS TABLE
      ============================== */}

      <div className="panel">
        <div className="search-box">
          <input
            placeholder="Search by guest name, room or status..."
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
