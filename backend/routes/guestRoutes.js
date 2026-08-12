const express = require("express");
const Guest = require("../models/Guest");

const router = express.Router();

// GET guests
router.get("/", async (req, res) => {
  try {
    const guests = await Guest.find().sort({
      createdAt: -1,
    });

    res.json(guests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET single guest
router.get("/:id", async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    res.json(guest);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE guest
router.post("/", async (req, res) => {
  try {
    const guest = await Guest.create(req.body);

    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE guest
router.put("/:id", async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    res.json(guest);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE guest
router.delete("/:id", async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    res.json({
      message: "Guest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
