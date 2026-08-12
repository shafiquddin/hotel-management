import { useState } from "react";
import { IonIcon } from "@ionic/react";
import api from "../api/api";

import {
  addOutline,
  bedOutline,
  closeOutline,
  createOutline,
  trashOutline,
  searchOutline,
  checkmarkCircleOutline,
  warningOutline,
  constructOutline,
} from "ionicons/icons";

function Rooms({ rooms, setRooms }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    number: "",
    type: "Standard",
    price: "",
    status: "Available",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      number: "",
      type: "Standard",
      price: "",
      status: "Available",
    });

    setEditingRoom(null);
  };

  // =========================
  // OPEN ADD FORM
  // =========================
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================
  const openEditForm = (room) => {
    setForm({
      number: room.number?.toString() || "",
      type: room.type || "Standard",
      price: room.price?.toString() || "",
      status: room.status || "Available",
    });

    setEditingRoom(room);
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // =========================
  // ADD ROOM
  // =========================
  const addRoom = async () => {
    try {
      setLoading(true);

      const response = await api.post("/rooms", {
        number: form.number,
        type: form.type,
        price: Number(form.price),
        status: form.status,
      });

      console.log("Room created:", response.data);

      setRooms((prevRooms) => [...prevRooms, response.data]);

      alert("Room added successfully!");

      closeForm();
    } catch (error) {
      console.error("Add room error:", error);

      alert(error.response?.data?.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE ROOM
  // =========================
  const updateRoom = async () => {
    if (!editingRoom?._id) return;

    try {
      setLoading(true);

      const response = await api.put(`/rooms/${editingRoom._id}`, {
        number: form.number,
        type: form.type,
        price: Number(form.price),
        status: form.status,
      });

      console.log("Room updated:", response.data);

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === editingRoom._id ? response.data : room,
        ),
      );

      alert("Room updated successfully!");

      closeForm();
    } catch (error) {
      console.error("Update room error:", error);

      alert(error.response?.data?.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORM SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.number.trim()) {
      alert("Please enter room number.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      alert("Please enter a valid room price.");
      return;
    }

    if (editingRoom) {
      await updateRoom();
    } else {
      await addRoom();
    }
  };

  // =========================
  // DELETE ROOM
  // =========================
  const deleteRoom = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await api.delete(`/rooms/${id}`);

      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== id));

      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Delete room error:", error);

      alert(error.response?.data?.message || "Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STATUS ICON
  // =========================
  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return checkmarkCircleOutline;

      case "Occupied":
        return bedOutline;

      case "Maintenance":
        return constructOutline;

      default:
        return warningOutline;
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredRooms = rooms.filter((room) => {
    const searchValue = search.toLowerCase();

    return (
      room.number?.toString().toLowerCase().includes(searchValue) ||
      room.type?.toLowerCase().includes(searchValue) ||
      room.status?.toLowerCase().includes(searchValue)
    );
  });

  // =========================
  // STATISTICS
  // =========================
  const availableRooms = rooms.filter(
    (room) => room.status === "Available",
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied",
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "Maintenance",
  ).length;

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage rooms, availability and pricing.</p>
        </div>

        <button
          className="primary-btn booking-btn"
          onClick={openAddForm}
          disabled={loading}
        >
          <IonIcon icon={addOutline} />
          Add Room
        </button>
      </div>

      {/* =========================
          ROOM STATISTICS
      ========================= */}

      <div className="room-stat-grid">
        <div className="room-stat-card">
          <div className="room-stat-icon blue">
            <IonIcon icon={bedOutline} />
          </div>

          <div>
            <span>Total Rooms</span>
            <strong>{rooms.length}</strong>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon green">
            <IonIcon icon={checkmarkCircleOutline} />
          </div>

          <div>
            <span>Available</span>
            <strong>{availableRooms}</strong>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon red">
            <IonIcon icon={bedOutline} />
          </div>

          <div>
            <span>Occupied</span>
            <strong>{occupiedRooms}</strong>
          </div>
        </div>

        <div className="room-stat-card">
          <div className="room-stat-icon orange">
            <IonIcon icon={warningOutline} />
          </div>

          <div>
            <span>Maintenance</span>
            <strong>{maintenanceRooms}</strong>
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

      <div className="rooms-toolbar">
        <div className="room-search">
          <IonIcon icon={searchOutline} />

          <input
            type="text"
            placeholder="Search room, type or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="room-count">{filteredRooms.length} rooms</span>
      </div>

      {/* =========================
          ROOM GRID
      ========================= */}

      <div className="room-grid">
        {filteredRooms.map((room) => (
          <div className="room-card modern-room-card" key={room._id}>
            {/* Top */}

            <div className="room-top">
              <div className="room-number-wrapper">
                <div className="room-main-icon">
                  <IonIcon icon={bedOutline} />
                </div>

                <div>
                  <span className="room-label">ROOM</span>

                  <strong className="room-number">{room.number}</strong>
                </div>
              </div>

              <span
                className={`room-status ${room.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <IonIcon icon={getStatusIcon(room.status)} />

                {room.status}
              </span>
            </div>

            {/* Room Information */}

            <div className="room-info">
              <div>
                <span>Room Type</span>
                <strong>{room.type}</strong>
              </div>

              <div className="room-price-box">
                <span>Price / Night</span>

                <strong>
                  ₹{Number(room.price || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {/* Actions */}

            <div className="room-actions">
              <button
                type="button"
                className="edit-room-btn"
                onClick={() => openEditForm(room)}
                disabled={loading}
              >
                <IonIcon icon={createOutline} />
                Edit
              </button>

              <button
                type="button"
                className="delete-room-btn"
                onClick={() => deleteRoom(room._id)}
                disabled={loading}
              >
                <IonIcon icon={trashOutline} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {filteredRooms.length === 0 && (
        <div className="empty-rooms">
          <IonIcon icon={bedOutline} />

          <h3>No rooms found</h3>

          <p>Try changing your search or add a new room.</p>
        </div>
      )}

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (
        <div className="modal-backdrop">
          <div className="booking-modal room-modal">
            <div className="modal-header">
              <div>
                <h2>{editingRoom ? "Edit Room" : "Add New Room"}</h2>

                <p>
                  {editingRoom
                    ? "Update room information"
                    : "Add a new room to your hotel"}
                </p>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeForm}
                disabled={loading}
              >
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="booking-form-grid">
                {/* Room Number */}

                <div className="form-field">
                  <label>Room Number</label>

                  <div className="input-icon">
                    <IonIcon icon={bedOutline} />

                    <input
                      name="number"
                      value={form.number}
                      onChange={handleChange}
                      placeholder="107"
                      required
                    />
                  </div>
                </div>

                {/* Room Type */}

                <div className="form-field">
                  <label>Room Type</label>

                  <div className="input-icon">
                    <IonIcon icon={bedOutline} />

                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="Standard">Standard</option>

                      <option value="Deluxe">Deluxe</option>

                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                </div>

                {/* Price */}

                <div className="form-field">
                  <label>Price / Night</label>

                  <div className="input-icon">
                    <span className="currency-icon">₹</span>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="3000"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Status */}

                <div className="form-field">
                  <label>Room Status</label>

                  <div className="input-icon">
                    <IonIcon icon={checkmarkCircleOutline} />

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Available">Available</option>

                      <option value="Occupied">Occupied</option>

                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  <IonIcon icon={editingRoom ? createOutline : addOutline} />

                  {loading
                    ? "Saving..."
                    : editingRoom
                      ? "Update Room"
                      : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
