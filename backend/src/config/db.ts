import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  return mongoose.connect(env.MONGODB_URI);
}
