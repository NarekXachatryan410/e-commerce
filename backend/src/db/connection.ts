import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectToDb() {
  try {
    await mongoose.connect(env.MONGO_URL!);
    console.log("DB CONNECTED");
  } catch (err: any) {
    console.log("Failed to connect:", err.message);
    process.exit(1); // stop script if DB fails
  }
}

export async function disconnectFromDb() {
  try {
    await mongoose.disconnect();
    console.log("DB DISCONNECTED");
  } catch (err: any) {
    console.log("Failed to disconnect:", err.message);
  }
}