//typescript uses "import" (es modules) instead of "require"

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import flightRoutes from "./routes/flights.js";

//typescript enforces prope environment variable types
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//ensures MongoDb uri is a valid string, preventing runtime errors

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database not connected", err));

app.get("/", (req, res) => {
  res.send("Welcome To Travel Booking");
});

app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);

//Typescript ensures that PORT is always a number
const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server is runnning in the port ${PORT}`));
