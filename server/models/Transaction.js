import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    transactionDate: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
