import express, { Router, Request, Response } from "express";
import Flight from "../models/Flight.js";

const router = Router();

//post: add a new flight
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      airline,
      flightNumber,
      departure,
      destination,
      date,
      price,
      seatAvailable,
    } = req.body;

    //ensure flight number is unique
    const existingFlight = await Flight.findOne({ flightNumber }).exec();
    if (existingFlight) {
      res.status(400).json({ message: "Flight number already exists" });
      return;
    }
    const newFlight = new Flight({
      airline,
      flightNumber,
      departure,
      destination,
      date: new Date(date), //Convert string  to Date
      price,
      seatAvailable,
    });

    await newFlight.save();
    res
      .status(201)
      .json({ message: "Flight added successfully", flight: newFlight });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//get: retrieve a single flight by id
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }
    res.status(200).json(flight);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//put: update flight details
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedFlight) {
      res.status(404).json({ message: "Flights not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Flight updated successfullt", flight: updatedFlight });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//Delete: remove a flight by id

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);

    if (!deletedFlight) {
      res.status(404).json({ message: "Flight not found" });
      return;
    }
    res.status(200).json({ message: "Flight deleted successfullt" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { destination, date } = req.query;

    if (!destination || !date) {
      res.status(400).json({ message: "Destination and Date are required" });
      return;
    }

    //convert date from string to date before quering

    const searchDate = new Date(date as string);

    if (isNaN(searchDate.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
    }

    //Query MongoDb using a `Date` object

    const flights = await Flight.find({
      destination: destination as string,
      date: searchDate,
    });
    res.json(flights);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
