import express, { Router, Request, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Flight from "../models/Flight.js";

const router = Router();

// ✅ User: Book a flight
router.post(
  "/",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { flightId, seats } = req.body;

      // ✅ Check if flight exists
      const flight = await Flight.findById(flightId);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      // ✅ Check seat availability
      if (flight.seatAvailable < seats) {
        return res.status(400).json({ message: "Not enough seats available" });
      }

      // ✅ Calculate total price
      const totalPrice = flight.price * seats;

      // ✅ Create booking
      const booking = new Booking({
        user: req.user?.id,
        flight: flightId,
        seatsBooked: seats,
        totalPrice,
        status: "confirmed",
      });

      await booking.save();

      // ✅ Deduct seats from flight
      flight.seatAvailable -= seats;
      await flight.save();

      return res.status(201).json({ message: "Booking successful", booking });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ✅ User: View My Bookings
router.get(
  "/",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const bookings = await Booking.find({ user: req.user?.id }).populate(
        "flight"
      );
      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ✅ Admin: View All Bookings
router.get(
  "/all",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      if (req.user?.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Only admins can view all bookings" });
      }

      const bookings = await Booking.find().populate("user flight");
      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// ✅ User: Cancel Booking
router.delete(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (
        booking.user.toString() !== req.user?.id &&
        req.user?.role !== "admin"
      ) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // ✅ Restore seats to flight
      const flight = await Flight.findById(booking.flight);
      if (flight) {
        flight.seatAvailable += booking.seatsBooked;
        await flight.save();
      }

      await booking.deleteOne();
      return res.json({ message: "Booking cancelled successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
