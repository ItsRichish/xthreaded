import mongoose from "mongoose";
import { string } from "zod";

const knotSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Knot",
    },
  ],
});

const Knot = mongoose.models.Knot || mongoose.model("Knot", knotSchema);

export default Knot;

// Knot Original
//     -> Knot Comment1
//     -> Knot Comment2
//         -> Knot Comment2
