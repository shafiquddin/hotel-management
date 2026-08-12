import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Guests from "./pages/Guests";
import Bookings from "./pages/Bookings";

import api from "./api/api";

function App() {
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [roomsResponse, guestsResponse, bookingsResponse] =
          await Promise.all([
            api.get("/rooms"),
            api.get("/guests"),
            api.get("/bookings"),
          ]);

        setRooms(roomsResponse.data);
        setGuests(guestsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Failed to load hotel data:", error);

        alert(error.response?.data?.message || "Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <h2>Loading Hotel Management...</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Dashboard rooms={rooms} bookings={bookings} guests={guests} />
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
      </Route>
    </Routes>
  );
}

export default App;
