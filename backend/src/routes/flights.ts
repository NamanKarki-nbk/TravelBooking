import express, { Router, Request, Response } from "express";
import Flight from "../models/Flight.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = Router();

router.post(
  "/",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      // ✅ Ensure only admins can add flights
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can add flights" });
      }

      const {
        airline,
        flightNumber,
        departure,
        destination,
        date,
        price,
        seatAvailable,
      } = req.body; // 🔥 FIXED: Changed from `seatsAvailable`

      // ✅ Ensure flight number is unique
      const existingFlight = await Flight.findOne({ flightNumber }).exec();
      if (existingFlight) {
        return res
          .status(400)
          .json({ message: "Flight number already exists" });
      }

      const newFlight = new Flight({
        airline,
        flightNumber,
        departure,
        destination,
        date: new Date(date), // ✅ Convert string to Date
        price,
        seatAvailable, // 🔥 FIXED: Used correct field name
      });

      await newFlight.save();
      return res
        .status(201)
        .json({ message: "Flight added successfully", flight: newFlight });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ✅ Users & Admins: Search flights with valid date format
router.get("/search", async (req: Request, res: Response): Promise<any> => {
  try {
    const { destination, date } = req.query;

    // ✅ Ensure both parameters exist
    if (!destination || !date) {
      return res
        .status(400)
        .json({ message: "Destination and Date are required" });
    }

    // ✅ Convert date from string to Date object
    const searchDate = new Date(date as string);

    // ✅ Check if the date is valid
    if (isNaN(searchDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // ✅ Query MongoDB for matching flights
    const flights = await Flight.find({
      destination: destination as string,
      date: searchDate,
    });

    return res.json(flights);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ Users & Admins: Retrieve a single flight by ID
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // ✅ Validate ID before using it
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid flight ID" });
    }

    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    return res.status(200).json(flight);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ✅ Admin Only: Update flight details
router.put(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      // ✅ Ensure only admins can modify flights
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can update flights" });
      }

      const { id } = req.params;

      // ✅ Validate ID before using it
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid flight ID" });
      }

      const updatedFlight = await Flight.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updatedFlight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      return res.status(200).json({
        message: "Flight updated successfully",
        flight: updatedFlight,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ✅ Admin Only: Delete a flight by ID
router.delete(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      // ✅ Ensure only admins can delete flights
      if (!req.user || req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can delete flights" });
      }

      const { id } = req.params;

      // ✅ Validate ID before using it
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid flight ID" });
      }

      const deletedFlight = await Flight.findByIdAndDelete(id);
      if (!deletedFlight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      return res.status(200).json({ message: "Flight deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
