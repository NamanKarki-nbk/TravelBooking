import express, { Router, Request, Response } from "express";
import Flight from "../models/Flight.js";

const router = Router();
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
