import { useState } from "react";
import api from "../api/api";

function Guests({ guests = [], setGuests }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
      name: "",
      email: "",
      phone: "",
    });

    setEditingGuest(null);
    setShowForm(false);
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setEditingGuest(null);
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const editGuest = (guest) => {
    if (!guest?._id) {
      alert("Guest ID is missing.");
      return;
    }

    setEditingGuest(guest);

    setForm({
      name: guest.name || "",
      email: guest.email || "",
      phone: guest.phone || "",
    });

    setShowForm(true);
  };

  // =========================
  // ADD / UPDATE GUEST
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name) {
      alert("Please enter guest name.");
      return;
    }

    if (!email) {
      alert("Please enter guest email.");
      return;
    }

    if (!phone) {
      alert("Please enter guest phone number.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // UPDATE
      // =========================

      if (editingGuest?._id) {
        const response = await api.put(`/guests/${editingGuest._id}`, {
          name,
          email,
          phone,
        });

        const updatedGuest = response?.data;

        if (!updatedGuest?._id) {
          throw new Error("Invalid guest data received from server.");
        }

        setGuests((prevGuests) =>
          (Array.isArray(prevGuests) ? prevGuests : []).map((guest) =>
            guest?._id === editingGuest._id ? updatedGuest : guest,
          ),
        );

        alert("Guest updated successfully!");

        resetForm();

        return;
      }

      // =========================
      // ADD
      // =========================

      const response = await api.post("/guests", {
        name,
        email,
        phone,
      });

      const newGuest = response?.data;

      if (!newGuest?._id) {
        throw new Error("Invalid guest data received from server.");
      }

      setGuests((prevGuests) => [
        newGuest,
        ...(Array.isArray(prevGuests) ? prevGuests : []),
      ]);

      alert("Guest added successfully!");

      resetForm();
    } catch (error) {
      console.error("Guest save error:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          (editingGuest ? "Failed to update guest" : "Failed to add guest"),
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE GUEST
  // =========================

  const deleteGuest = async (id) => {
    if (!id) {
      alert("Guest ID is missing.");
      return;
    }

    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this guest?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await api.delete(`/guests/${id}`);

      setGuests((prevGuests) =>
        (Array.isArray(prevGuests) ? prevGuests : []).filter(
          (guest) => guest?._id !== id,
        ),
      );

      // If deleted guest was being edited
      if (editingGuest?._id === id) {
        resetForm();
      }

      alert("Guest deleted successfully!");
    } catch (error) {
      console.error("Delete guest error:", error);

      alert(error?.response?.data?.message || "Failed to delete guest");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const safeGuests = Array.isArray(guests) ? guests : [];

  const searchText = search.trim().toLowerCase();

  const filteredGuests = safeGuests.filter((guest) => {
    if (!guest) return false;

    const name = String(guest.name || "").toLowerCase();
    const email = String(guest.email || "").toLowerCase();
    const phone = String(guest.phone || "").toLowerCase();

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      phone.includes(searchText)
    );
  });

  // =========================
  // RENDER
  // =========================

  return (
    <div>
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Guests</h1>
          <p>Manage your hotel guests.</p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={openAddForm}
          disabled={loading}
        >
          + Add Guest
        </button>
      </div>

      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      {showForm && (
        <form className="form-panel" onSubmit={handleSubmit}>
          <h2>{editingGuest ? "Edit Guest" : "Add Guest"}</h2>

          <div className="form-grid">
            {/* NAME */}

            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter guest name"
                disabled={loading}
                required
              />
            </div>

            {/* EMAIL */}

            <div>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter guest email"
                disabled={loading}
                required
              />
            </div>

            {/* PHONE */}

            <div>
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading
                ? editingGuest
                  ? "Updating..."
                  : "Adding..."
                : editingGuest
                  ? "Update Guest"
                  : "Add Guest"}
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* =========================
          GUEST LIST
      ========================= */}

      <div className="panel">
        {/* SEARCH */}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredGuests.map((guest) => {
                const id = guest?._id;

                const name = guest?.name || "Unknown Guest";
                const email = guest?.email || "N/A";
                const phone = guest?.phone || "N/A";

                const firstLetter = name.charAt(0).toUpperCase();

                return (
                  <tr key={id || `guest-${name}`}>
                    <td>
                      <div className="guest-name">
                        <div className="avatar">{firstLetter}</div>

                        <span>{name}</span>
                      </div>
                    </td>

                    <td>{email}</td>

                    <td>{phone}</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="small-btn"
                          onClick={() => editGuest(guest)}
                          disabled={loading || !id}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteGuest(id)}
                          disabled={loading || !id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* EMPTY STATE */}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state">
                      {search ? "No guests found." : "No guests available."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Guests;
