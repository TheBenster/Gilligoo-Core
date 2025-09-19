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
  // Skip database connection during build time or if no URI
  if (!MONGODB_URI || (process.env.NODE_ENV === 'production' && !process.env.NETLIFY_BUILD_CONTEXT)) {
    console.log("Skipping database connection - build time or missing URI");
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
      // During build or missing URI, return null instead of throwing
      if (process.env.NODE_ENV === 'production' || !MONGODB_URI) {
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
    // During build or missing URI, return null instead of throwing
    if (process.env.NODE_ENV === 'production' || !MONGODB_URI) {
      return null;
    }
    throw error;
  }
}
