import { useState } from "react";
import { IonIcon } from "@ionic/react";

import {
  personOutline,
  lockClosedOutline,
  settingsOutline,
  warningOutline,
  saveOutline,
} from "ionicons/icons";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      ...form,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and hotel preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile */}

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <IonIcon icon={personOutline} />
            </div>

            <div>
              <h2>Profile</h2>
              <p>Update your personal information.</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-field">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Admin"
              />
            </div>

            <div className="form-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@hotel.com"
              />
            </div>

            <div className="form-field">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="settings-actions">
              <button type="submit" className="primary-btn">
                <IonIcon icon={saveOutline} />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Account */}

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <IonIcon icon={settingsOutline} />
            </div>

            <div>
              <h2>Account Information</h2>
              <p>Information about your current account.</p>
            </div>
          </div>

          <div className="account-info">
            <div className="account-info-row">
              <span>Name</span>
              <strong>{user.name || "Admin"}</strong>
            </div>

            <div className="account-info-row">
              <span>Email</span>
              <strong>{user.email || "admin@hotel.com"}</strong>
            </div>

            <div className="account-info-row">
              <span>Role</span>
              <strong>{user.role || "Administrator"}</strong>
            </div>

            <div className="account-info-row">
              <span>Status</span>
              <strong>Active</strong>
            </div>
          </div>
        </div>

        {/* Security */}

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <IonIcon icon={lockClosedOutline} />
            </div>

            <div>
              <h2>Security</h2>
              <p>Manage your account security.</p>
            </div>
          </div>

          <div className="form-field">
            <label>Current Password</label>

            <input type="password" placeholder="Current password" />
          </div>

          <div className="form-field">
            <label>New Password</label>

            <input type="password" placeholder="New password" />
          </div>

          <div className="form-field">
            <label>Confirm Password</label>

            <input type="password" placeholder="Confirm password" />
          </div>

          <div className="settings-actions">
            <button className="primary-btn">Update Password</button>
          </div>
        </div>

        {/* Danger Zone */}

        <div className="settings-card danger-settings">
          <div className="settings-card-header">
            <div className="settings-icon danger-icon">
              <IonIcon icon={warningOutline} />
            </div>

            <div>
              <h2>Danger Zone</h2>

              <p>Be careful when performing these actions.</p>
            </div>
          </div>

          <p className="settings-danger-text">
            Deleting your account is permanent and cannot be undone.
          </p>

          <div className="settings-actions">
            <button className="settings-danger-btn">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
