import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Guests from "./pages/Guests";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

import api from "./api/api";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't load hotel data when user is not logged in
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        const [roomsResponse, guestsResponse, bookingsResponse] =
          await Promise.all([
            api.get("/rooms"),
            api.get("/guests"),
            api.get("/bookings"),
          ]);

        setRooms(Array.isArray(roomsResponse.data) ? roomsResponse.data : []);

        setGuests(
          Array.isArray(guestsResponse.data) ? guestsResponse.data : [],
        );

        setBookings(
          Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [],
        );
      } catch (error) {
        console.error("Failed to load hotel data:", error);

        if (error.response?.status !== 401) {
          alert(error.response?.data?.message || "Unable to connect to server");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  if (loading && isAuthenticated) {
    return (
      <div className="app-loading">
        <h2>Loading Hotel Management...</h2>
      </div>
    );
  }

  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route path="/login" element={<Login />} />

      {/* =========================
          PROTECTED ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Dashboard
                rooms={rooms}
                bookings={bookings}
                guests={guests}
                setBookings={setBookings}
                setRooms={setRooms}
              />
            }
          />

          <Route
            path="/rooms"
            element={<Rooms rooms={rooms} setRooms={setRooms} />}
          />

          <Route
            path="/guests"
            element={<Guests guests={guests} setGuests={setGuests} />}
          />

          <Route
            path="/bookings"
            element={
              <Bookings
                bookings={bookings}
                setBookings={setBookings}
                rooms={rooms}
                guests={guests}
                setGuests={setGuests}
                setRooms={setRooms}
              />
            }
          />

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
