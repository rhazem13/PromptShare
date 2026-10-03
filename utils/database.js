import mongoose from "mongoose";

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be configured");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "share_prompt",
    serverSelectionTimeoutMS: 5000,
  });
};
