import { Schema, model } from "mongoose";

const geometrySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
    coordinates: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

const regionSchema = new Schema({
  name: { type: String, required: true },
  geometry: {
    type: geometrySchema,
    required: true,
  },
});

regionSchema.index({ geometry: "2dsphere" });

export const Region = model("Region", regionSchema);
