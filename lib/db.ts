import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as typeof globalThis & { __mongoose?: MongooseCache })
  .__mongoose;
if (!cached)
  cached = (
    global as typeof globalThis & { __mongoose?: MongooseCache }
  ).__mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (!cached) cached = { conn: null, promise: null };
  if (cached.conn) return cached.conn;
  if (!cached.promise)
    cached.promise = mongoose.connect(process.env.MONGODB_URI!);
  cached.conn = await cached.promise;
  return cached.conn;
}
