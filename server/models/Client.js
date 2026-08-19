import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
      match: [/^[0-9+\-()\s]{7,20}$/, "Please enter a valid mobile number"],
    },
    totalCredit: { type: Number, default: 0 },
    totalDebit: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    lastTransactionDate: { type: Date, default: null },
  },
  { timestamps: true },
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
