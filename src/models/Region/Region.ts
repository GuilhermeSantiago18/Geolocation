import { Schema, model } from "mongoose";

const regionSchema = new Schema({
  name: { type: String, required: true },
  type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
  coordinates: {
      type: [[[Number]]],
      required: true,
    },
});


export const Region = model("Region", regionSchema);
