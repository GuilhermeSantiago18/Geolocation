import { Schema, model } from "mongoose";

const regionSchema = new Schema({
  name: { type: String, required: true },
  geometry: {
    type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
    coordinates: {
      type: [[[Number]]],
      required: true,
    },
  },
});

regionSchema.index({ geometry: "2dsphere" });

export const Region = model("Region", regionSchema);
