import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    customerEmail: String,
    crackers: [
      {
        cracker: { type: mongoose.Schema.Types.ObjectId, ref: "Cracker" },
        quantity: Number,
      },
    ],
    totalAmount: Number,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
