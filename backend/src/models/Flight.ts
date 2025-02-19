import mongoose, { Date } from "mongoose";

interface IFlight extends mongoose.Document {
  airline: string;
  flightNumber: string;
  departure: string;
  destination: string;
  date: Date;
  price: number;
  seatAvailable: number;
}

const FlightSchema = new mongoose.Schema<IFlight>({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  seatAvailable: { type: Number, required: true },
});

export default mongoose.model<IFlight>("Flight", FlightSchema);
