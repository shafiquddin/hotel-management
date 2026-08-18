const express = require("express");

const Booking = require("../models/Booking");
const Room = require("../models/Room");

const router = express.Router();

// GET bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("guest", "name email phone")
      .populate("room", "number type price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE booking
router.post("/", async (req, res) => {
  try {
    const { guest, room, checkIn, checkOut, amount } = req.body;

    const selectedRoom = await Room.findById(room);

    if (!selectedRoom) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (selectedRoom.status !== "Available") {
      return res.status(400).json({
        message: "Room is not available",
      });
    }

    const booking = await Booking.create({
      guest,
      room,
      checkIn,
      checkOut,
      amount,
      status: "Confirmed",
    });

    selectedRoom.status = "Occupied";

    await selectedRoom.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("guest", "name email phone")
      .populate("room", "number type price");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Check in
router.patch("/:id/check-in", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "Checked In",
      },
      {
        new: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Check out
router.patch("/:id/check-out", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "Checked Out",
      },
      {
        new: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    await Room.findByIdAndUpdate(booking.room, {
      status: "Available",
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
