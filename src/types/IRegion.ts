import { Types } from "mongoose";

export type Coordinates = string[][];

export interface IRegion {
  _id?: string | Types.ObjectId;
  name: string;
  type: 'Polygon';
  coordinates: Coordinates;
}
