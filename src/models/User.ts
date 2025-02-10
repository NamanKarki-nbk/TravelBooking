import mongoose from "mongoose";

//TypeScript "interface" defines strict object structure

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin"; //Enforced role values
}
// typescript enforces correct schema types at compile-time

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default mongoose.model<IUser>("User", UserSchema);
