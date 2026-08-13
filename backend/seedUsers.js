import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    name: "Admin",
    email: "admin@hotel.com",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  },
  {
    name: "Manager",
    email: "manager@hotel.com",
    password: await bcrypt.hash("manager123", 10),
    role: "manager",
  },
  {
    name: "Receptionist",
    email: "reception@hotel.com",
    password: await bcrypt.hash("reception123", 10),
    role: "receptionist",
  },
];

await User.deleteMany({});

await User.insertMany(users);

console.log("Users created successfully");

await mongoose.disconnect();
