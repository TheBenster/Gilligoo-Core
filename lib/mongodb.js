import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  // Skip database connection during build time
  if (process.env.NODE_ENV === 'production' && !process.env.NETLIFY_BUILD_CONTEXT) {
    // This is likely a static build, skip DB connection
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection error:", error);
      // During build, return null instead of throwing
      if (process.env.NODE_ENV === 'production') {
        return null;
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // During build, return null instead of throwing
    if (process.env.NODE_ENV === 'production') {
      return null;
    }
    throw error;
  }
}
