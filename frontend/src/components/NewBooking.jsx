import { useState } from "react";
import { IonIcon } from "@ionic/react";
import api from "../api/api";

import {
  closeOutline,
  personOutline,
  bedOutline,
  calendarOutline,
  cashOutline,
} from "ionicons/icons";

function NewBooking({
  rooms = [],
  guests = [],
  setBookings,
  setRooms,
  onClose,
}) {
  const [form, setForm] = useState({
    guest: "",
    room: "",
    checkIn: "",
    checkOut: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Find selected guest safely
  // --------------------------------------------------
  const getSelectedGuest = () => {
    if (!form.guest) return null;

    return (
      guests.find((guest) => String(guest?._id || "") === String(form.guest)) ||
      null
    );
  };

  // --------------------------------------------------
  // Find selected room safely
  // --------------------------------------------------
  const getSelectedRoom = () => {
    if (!form.room) return null;

    return (
      rooms.find((room) => String(room?._id || "") === String(form.room)) ||
      null
    );
  };

  // --------------------------------------------------
  // Normalize booking received from backend
  // --------------------------------------------------
  const normalizeBooking = (booking) => {
    if (!booking || typeof booking !== "object") {
      return null;
    }

    const selectedGuest = getSelectedGuest();
    const selectedRoom = getSelectedRoom();

    // Backend guest
    let guest = booking.guest;

    // If backend returns only guest ID/string
    if (typeof guest === "string" || typeof guest === "number") {
      guest =
        guests.find((item) => String(item?._id || "") === String(guest)) ||
        selectedGuest;
    }

    // If backend returns incomplete guest object
    if (!guest || typeof guest !== "object") {
      guest = selectedGuest;
    }

    // Make sure guest always has safe values
    guest = {
      _id: guest?._id || selectedGuest?._id || form.guest,
      name: guest?.name || selectedGuest?.name || "Unknown Guest",
      email: guest?.email || selectedGuest?.email || "",
      phone: guest?.phone || selectedGuest?.phone || "",
    };

    // Backend room
    let room = booking.room;

    // If backend returns only room ID/string
    if (typeof room === "string" || typeof room === "number") {
      room =
        rooms.find((item) => String(item?._id || "") === String(room)) ||
        selectedRoom;
    }

    // If backend returns incomplete room object
    if (!room || typeof room !== "object") {
      room = selectedRoom;
    }

    // Make sure room always has safe values
    room = {
      _id: room?._id || selectedRoom?._id || form.room,
      number: room?.number || selectedRoom?.number || "N/A",
      type: room?.type || selectedRoom?.type || "Room",
      price: room?.price ?? selectedRoom?.price ?? 0,
      status: room?.status || "Occupied",
    };

    return {
      ...booking,

      // Always use MongoDB ID
      _id: booking._id || booking.id || Date.now().toString(),

      guest,
      room,

      checkIn: booking.checkIn || form.checkIn,
      checkOut: booking.checkOut || form.checkOut,

      amount: Number(booking.amount ?? form.amount ?? 0),

      status: booking.status || "Confirmed",
    };
  };

  // --------------------------------------------------
  // Create booking
  // --------------------------------------------------
  const handleBooking = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Validate guest
    const selectedGuest = getSelectedGuest();

    if (!selectedGuest) {
      alert("Please select a valid guest.");
      return;
    }

    // Validate room
    const selectedRoom = getSelectedRoom();

    if (!selectedRoom) {
      alert("Please select a valid room.");
      return;
    }

    // Validate dates
    if (!form.checkIn || !form.checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (form.checkOut <= form.checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    // Validate amount
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      alert("Please enter a valid booking amount.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        guest: selectedGuest._id,
        room: selectedRoom._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        amount,
      };

      const response = await api.post("/bookings", payload);

      // --------------------------------------------------
      // Normalize backend response
      // --------------------------------------------------
      const newBooking = normalizeBooking(response.data);

      if (!newBooking) {
        throw new Error("Invalid booking response from server.");
      }

      // --------------------------------------------------
      // Update bookings
      // --------------------------------------------------
      setBookings((prevBookings) => {
        const safeBookings = Array.isArray(prevBookings) ? prevBookings : [];

        return [newBooking, ...safeBookings];
      });

      // --------------------------------------------------
      // Update room status
      // --------------------------------------------------
      setRooms((prevRooms) => {
        if (!Array.isArray(prevRooms)) {
          return [];
        }

        return prevRooms.map((room) =>
          room?._id === selectedRoom._id
            ? {
                ...room,
                status: "Occupied",
              }
            : room,
        );
      });

      alert("Booking created successfully!");

      // --------------------------------------------------
      // Reset form
      // --------------------------------------------------
      setForm({
        guest: "",
        room: "",
        checkIn: "",
        checkOut: "",
        amount: "",
      });

      onClose();
    } catch (error) {
      console.error("Booking creation error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create booking",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Available rooms
  // --------------------------------------------------
  const availableRooms = Array.isArray(rooms)
    ? rooms.filter((room) => room?.status === "Available")
    : [];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="modal-backdrop">
      <div className="booking-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>New Booking</h2>
            <p>Create a new hotel reservation</p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleBooking}>
          <div className="booking-form-grid">
            {/* Guest */}
            <div className="form-field">
              <label>Guest</label>

              <div className="input-icon">
                <IonIcon icon={personOutline} />

                <select
                  name="guest"
                  value={form.guest}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select guest</option>

                  {Array.isArray(guests) &&
                    guests.map((guest) => (
                      <option key={guest?._id} value={guest?._id || ""}>
                        {guest?.name || "Unknown Guest"}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Room */}
            <div className="form-field">
              <label>Room</label>

              <div className="input-icon">
                <IonIcon icon={bedOutline} />

                <select
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select room</option>

                  {availableRooms.map((room) => (
                    <option key={room?._id} value={room?._id || ""}>
                      Room {room?.number || "N/A"} - {room?.type || "Room"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Check In */}
            <div className="form-field">
              <label>Check In</label>

              <div className="input-icon">
                <IonIcon icon={calendarOutline} />

                <input
                  type="date"
                  name="checkIn"
                  value={form.checkIn}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="form-field">
              <label>Check Out</label>

              <div className="input-icon">
                <IonIcon icon={calendarOutline} />

                <input
                  type="date"
                  name="checkOut"
                  value={form.checkOut}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="form-field full-width">
              <label>Total Amount</label>

              <div className="input-icon">
                <IonIcon icon={cashOutline} />

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter booking amount"
                  min="0"
                  step="1"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBooking;
