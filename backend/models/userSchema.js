import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  designation: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  }
});

export default mongoose.model("User", userSchema);