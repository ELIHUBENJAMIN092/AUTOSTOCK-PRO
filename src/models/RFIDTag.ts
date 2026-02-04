import mongoose, { Schema } from "mongoose";

const RFIDTagSchema = new Schema(
  {
    epc: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const RFIDTag =
  mongoose.models.RFIDTag ||
  mongoose.model("RFIDTag", RFIDTagSchema);

export default RFIDTag;
