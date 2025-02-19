import mongoose from "mongoose";

export interface IBooking extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  flight: mongoose.Schema.Types.ObjectId;
  seatsBooked: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

const BookingSchema = new mongoose.Schema<IBooking>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  seatsBooked: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
