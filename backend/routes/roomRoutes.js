const express = require("express");
const Room = require("../models/Room");

const router = express.Router();

// GET all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ number: 1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET available rooms
router.get("/available", async (req, res) => {
  try {
    const rooms = await Room.find({
      status: "Available",
    }).sort({ number: 1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET single room
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE room
router.post("/", async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE room
router.put("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(room);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE room
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
