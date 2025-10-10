import mongoose from "mongoose";

const crackerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: {
      type: String,
      default:
        "https://png.pngtree.com/png-clipart/20240508/original/pngtree-diwali-fire-crackers-set-png-image_15041998.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cracker", crackerSchema);
