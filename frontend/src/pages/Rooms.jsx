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

function Rooms({ rooms = [], setRooms }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingRoom, setEditingRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const safeRooms = Array.isArray(rooms) ? rooms : [];

  const [form, setForm] = useState({
    number: "",
    type: "Standard",
    price: "",
    status: "Available",
  });

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      number: "",
      type: "Standard",
      price: "",
      status: "Available",
    });

    setEditingRoom(null);
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    if (loading) return;

    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (room) => {
    if (loading || !room?._id) return;

    setForm({
      number: room?.number?.toString() || "",
      type: room?.type || "Standard",
      price:
        room?.price !== undefined && room?.price !== null
          ? room.price.toString()
          : "",
      status: room?.status || "Available",
    });

    setEditingRoom(room);
    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    if (loading) return;

    setShowForm(false);
    resetForm();
  };

  // ==========================================
  // ADD ROOM
  // ==========================================

  const addRoom = async () => {
    try {
      setLoading(true);

      const payload = {
        number: form.number.trim(),
        type: form.type,
        price: Number(form.price),
        status: form.status,
      };

      const response = await api.post("/rooms", payload);

      const newRoom = response?.data;

      if (!newRoom || typeof newRoom !== "object") {
        throw new Error("Invalid room response from server");
      }

      setRooms((prevRooms) => {
        const safePrevRooms = Array.isArray(prevRooms) ? prevRooms : [];

        return [...safePrevRooms, newRoom];
      });

      alert("Room added successfully!");

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Add room error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add room",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ROOM
  // ==========================================

  const updateRoom = async () => {
    if (!editingRoom?._id) {
      alert("Invalid room selected.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        number: form.number.trim(),
        type: form.type,
        price: Number(form.price),
        status: form.status,
      };

      const response = await api.put(`/rooms/${editingRoom._id}`, payload);

      const updatedRoom = response?.data;

      if (!updatedRoom || typeof updatedRoom !== "object") {
        throw new Error("Invalid room response from server");
      }

      setRooms((prevRooms) => {
        const safePrevRooms = Array.isArray(prevRooms) ? prevRooms : [];

        return safePrevRooms.map((room) =>
          room?._id === editingRoom._id ? updatedRoom : room,
        );
      });

      alert("Room updated successfully!");

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Update room error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update room",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const roomNumber = form.number.trim();
    const price = Number(form.price);

    if (!roomNumber) {
      alert("Please enter room number.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Please enter a valid room price.");
      return;
    }

    if (!form.type) {
      alert("Please select room type.");
      return;
    }

    if (!form.status) {
      alert("Please select room status.");
      return;
    }

    if (editingRoom?._id) {
      await updateRoom();
    } else {
      await addRoom();
    }
  };

  // ==========================================
  // DELETE ROOM
  // ==========================================

  const deleteRoom = async (id) => {
    if (!id) {
      alert("Invalid room ID.");
      return;
    }

    if (loading || deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this room?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/rooms/${id}`);

      setRooms((prevRooms) => {
        const safePrevRooms = Array.isArray(prevRooms) ? prevRooms : [];

        return safePrevRooms.filter((room) => room?._id !== id);
      });

      // If deleted room was being edited, close form.
      if (editingRoom?._id === id) {
        setShowForm(false);
        resetForm();
      }

      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Delete room error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete room",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

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

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return (status || "Unknown").toLowerCase().replace(/\s+/g, "-");
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const searchValue = search.trim().toLowerCase();

  const filteredRooms = safeRooms.filter((room) => {
    const roomNumber = String(room?.number ?? "").toLowerCase();
    const roomType = String(room?.type ?? "").toLowerCase();
    const roomStatus = String(room?.status ?? "").toLowerCase();

    return (
      roomNumber.includes(searchValue) ||
      roomType.includes(searchValue) ||
      roomStatus.includes(searchValue)
    );
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const availableRooms = safeRooms.filter(
    (room) => room?.status === "Available",
  ).length;

  const occupiedRooms = safeRooms.filter(
    (room) => room?.status === "Occupied",
  ).length;

  const maintenanceRooms = safeRooms.filter(
    (room) => room?.status === "Maintenance",
  ).length;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div>
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage rooms, availability and pricing.</p>
        </div>

        <button
          type="button"
          className="primary-btn booking-btn"
          onClick={openAddForm}
          disabled={loading || deletingId !== null}
        >
          <IonIcon icon={addOutline} />
          Add Room
        </button>
      </div>

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="room-stat-grid">
        <div className="room-stat-card">
          <div className="room-stat-icon blue">
            <IonIcon icon={bedOutline} />
          </div>

          <div>
            <span>Total Rooms</span>
            <strong>{safeRooms.length}</strong>
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

      {/* ========================================
          SEARCH
      ======================================== */}

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

        <span className="room-count">
          {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"}
        </span>
      </div>

      {/* ========================================
          ROOM GRID
      ======================================== */}

      <div className="room-grid">
        {filteredRooms.map((room, index) => {
          const roomId = room?._id;

          const roomNumber =
            room?.number !== undefined && room?.number !== null
              ? room.number
              : "N/A";

          const roomType = room?.type || "Standard";

          const roomStatus = room?.status || "Unknown";

          const roomPrice = Number(room?.price || 0);

          return (
            <div
              className="room-card modern-room-card"
              key={roomId || `room-${index}`}
            >
              {/* Top */}

              <div className="room-top">
                <div className="room-number-wrapper">
                  <div className="room-main-icon">
                    <IonIcon icon={bedOutline} />
                  </div>

                  <div>
                    <span className="room-label">ROOM</span>

                    <strong className="room-number">{roomNumber}</strong>
                  </div>
                </div>

                <span className={`room-status ${getStatusClass(roomStatus)}`}>
                  <IonIcon icon={getStatusIcon(roomStatus)} />

                  {roomStatus}
                </span>
              </div>

              {/* Room Information */}

              <div className="room-info">
                <div>
                  <span>Room Type</span>

                  <strong>{roomType}</strong>
                </div>

                <div className="room-price-box">
                  <span>Price / Night</span>

                  <strong>
                    ₹
                    {Number.isFinite(roomPrice)
                      ? roomPrice.toLocaleString("en-IN")
                      : "0"}
                  </strong>
                </div>
              </div>

              {/* Actions */}

              <div className="room-actions">
                <button
                  type="button"
                  className="edit-room-btn"
                  onClick={() => openEditForm(room)}
                  disabled={loading || deletingId !== null || !roomId}
                >
                  <IonIcon icon={createOutline} />
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-room-btn"
                  onClick={() => deleteRoom(roomId)}
                  disabled={loading || deletingId !== null || !roomId}
                >
                  <IonIcon icon={trashOutline} />

                  {deletingId === roomId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================
          EMPTY STATE
      ======================================== */}

      {filteredRooms.length === 0 && (
        <div className="empty-rooms">
          <IonIcon icon={bedOutline} />

          <h3>No rooms found</h3>

          <p>
            {search
              ? "Try changing your search."
              : "Add a new room to get started."}
          </p>
        </div>
      )}

      {/* ========================================
          ADD / EDIT MODAL
      ======================================== */}

      {showForm && (
        <div className="modal-backdrop">
          <div className="booking-modal room-modal">
            {/* Modal Header */}

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

            {/* Form */}

            <form onSubmit={handleSubmit}>
              <div className="booking-form-grid">
                {/* Room Number */}

                <div className="form-field">
                  <label htmlFor="room-number">Room Number</label>

                  <div className="input-icon">
                    <IonIcon icon={bedOutline} />

                    <input
                      id="room-number"
                      name="number"
                      value={form.number}
                      onChange={handleChange}
                      placeholder="107"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Room Type */}

                <div className="form-field">
                  <label htmlFor="room-type">Room Type</label>

                  <div className="input-icon">
                    <IonIcon icon={bedOutline} />

                    <select
                      id="room-type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="Standard">Standard</option>

                      <option value="Deluxe">Deluxe</option>

                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                </div>

                {/* Price */}

                <div className="form-field">
                  <label htmlFor="room-price">Price / Night</label>

                  <div className="input-icon">
                    <span className="currency-icon">₹</span>

                    <input
                      id="room-price"
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="3000"
                      min="0"
                      step="0.01"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Status */}

                <div className="form-field">
                  <label htmlFor="room-status">Room Status</label>

                  <div className="input-icon">
                    <IonIcon icon={checkmarkCircleOutline} />

                    <select
                      id="room-status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      disabled={loading}
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
