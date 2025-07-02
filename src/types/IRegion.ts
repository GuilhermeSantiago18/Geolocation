import { Types } from "mongoose";

export type Coordinates = number[][][];

export interface IRegion {
  _id?: string | Types.ObjectId;  
  name: string;
  type: 'Polygon';
  coordinates: Coordinates;
}
