import { useState } from "react";
import api from "../api/api"; // adjust path according to your project

function Guests({ guests, setGuests }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // ADD / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingGuest) {
        // UPDATE
        const response = await api.put(`/guests/${editingGuest._id}`, form);

        setGuests((prevGuests) =>
          prevGuests.map((guest) =>
            guest._id === editingGuest._id ? response.data : guest,
          ),
        );
      } else {
        // ADD
        const response = await api.post("/guests", form);

        setGuests((prevGuests) => [response.data, ...prevGuests]);
      }

      resetForm();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          (editingGuest ? "Failed to update guest" : "Failed to add guest"),
      );
    }
  };

  // =========================
  // EDIT
  // =========================
  const editGuest = (guest) => {
    setEditingGuest(guest);

    setForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
    });

    setShowForm(true);
  };

  // =========================
  // DELETE
  // =========================
  const deleteGuest = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this guest?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/guests/${id}`);

      setGuests((prevGuests) => prevGuests.filter((guest) => guest._id !== id));
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to delete guest");
    }
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
  // SEARCH
  // =========================
  const filteredGuests = guests.filter((guest) => {
    const searchText = search.toLowerCase();

    return (
      guest.name?.toLowerCase().includes(searchText) ||
      guest.email?.toLowerCase().includes(searchText) ||
      guest.phone?.includes(search)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Guests</h1>
          <p>Manage your hotel guests.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Guest
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form className="form-panel" onSubmit={handleSubmit}>
          <h2>{editingGuest ? "Edit Guest" : "Add Guest"}</h2>

          <div className="form-grid">
            {/* Name */}
            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="primary-btn">
              {editingGuest ? "Update Guest" : "Add Guest"}
            </button>

            <button type="button" className="delete-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Guest List */}
      <div className="panel">
        <div className="search-box">
          <input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              {filteredGuests.map((guest) => (
                <tr key={guest._id}>
                  <td>
                    <div className="guest-name">
                      <div className="avatar">
                        {guest.name?.charAt(0).toUpperCase()}
                      </div>

                      {guest.name}
                    </div>
                  </td>

                  <td>{guest.email}</td>

                  <td>{guest.phone}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="small-btn"
                        onClick={() => editGuest(guest)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteGuest(guest._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Guests;
