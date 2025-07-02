import { Types } from "mongoose";

export type GeometryType = "Polygon" | "Point";
export type Coordinates = number[][][];

export interface IPoint {
  lng: number;
  lat: number;
}

export interface IRegion {
  _id?: string | Types.ObjectId;
  name: string;
  geometry: {
    type: GeometryType;
    coordinates: Coordinates;
  };
}
