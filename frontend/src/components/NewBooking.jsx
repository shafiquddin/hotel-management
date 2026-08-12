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

function NewBooking({ rooms, guests, setBookings, setRooms, onClose }) {
  const [form, setForm] = useState({
    guest: "",
    room: "",
    checkIn: "",
    checkOut: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBooking = async (e) => {
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

      console.log("Booking created:", response.data);

      // Add newly created booking to React state
      setBookings((prevBookings) => [response.data, ...prevBookings]);

      // Mark selected room as occupied
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

      // Reset form
      setForm({
        guest: "",
        room: "",
        checkIn: "",
        checkOut: "",
        amount: "",
      });

      onClose();
    } catch (error) {
      console.error("Booking error:", error);

      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const availableRooms = rooms.filter((room) => room.status === "Available");

  return (
    <div className="modal-backdrop">
      <div className="booking-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>New Booking</h2>
            <p>Create a new hotel reservation</p>
          </div>

          <button type="button" className="close-btn" onClick={onClose}>
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
                >
                  <option value="">Select guest</option>

                  {guests.map((guest) => (
                    <option key={guest._id} value={guest._id}>
                      {guest.name}
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
                >
                  <option value="">Select room</option>

                  {availableRooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      Room {room.number} - {room.type}
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
                  required
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
