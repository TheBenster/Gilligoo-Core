import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log("MONGODB_URI not found in environment variables");
  if (process.env.NODE_ENV === 'production') {
    // During build, don't throw error
    console.log("Skipping MongoDB connection during build");
  } else {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  // Only skip if no URI provided
  if (!MONGODB_URI) {
    console.log("⚠️ Skipping database connection - no MONGODB_URI provided");
    return null;
  }

  // Return existing connection if available
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        cached.promise = null; // Reset promise on failure
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ Failed to establish MongoDB connection:", error.message);
    throw error;
  }
}
