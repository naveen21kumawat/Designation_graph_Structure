import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/designation-graph', {

    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

export default dbconnect;