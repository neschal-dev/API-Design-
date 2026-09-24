import { db } from "../prisma/db.js";

export async function connectDB(): Promise<void> {
  await db.connect();
  console.info("Database connected");
}

export async function disconnectDB(): Promise<void> {
  await db.close();
  console.info("Database disconnected");
}
