export type Coordinates = string[][];

export interface IRegion {
  _id?: string;
  name: string;
  type: 'Polygon';
  coordinates: Coordinates;
}
