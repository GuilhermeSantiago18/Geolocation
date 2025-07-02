import { CustomError } from "../errors/CustomError";

interface Geometry {
  type: "Polygon";
  coordinates: number[][][];
}

interface RegionInput {
  name: string;
  geometry: Geometry;
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new CustomError(message, 400);
}

function validatePolygonCoordinates(
  coordinates: number[][][],
): asserts coordinates is number[][][] {
  assert(
    Array.isArray(coordinates),
    "Field 'geometry coordinates' must be an array",
  );
  assert(
    coordinates.length > 0,
    "Field 'geometry coordinates' must have at least one ring",
  );

  const outerRing = coordinates[0];
  assert(Array.isArray(outerRing), "Outer ring must be an array");
  assert(outerRing.length >= 4, "Polygon ring must have at least 4 points");

  const firstPoint = outerRing[0];
  const lastPoint = outerRing[outerRing.length - 1];
  assert(
    Array.isArray(firstPoint) && firstPoint.length === 2,
    "Points must be [lng, lat]",
  );
  assert(
    Array.isArray(lastPoint) && lastPoint.length === 2,
    "Points must be [lng, lat]",
  );

  assert(
    firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1],
    "First and last point of the polygon ring must be the same to close the polygon",
  );
}

export function validateCreateRegion(data: unknown): RegionInput {
  assert(
    typeof data === "object" && data !== null,
    "Invalid input: expected an object",
  );

  const obj = data as Partial<RegionInput>;

  assert(
    typeof obj.name === "string" && obj.name.trim() !== "",
    "Field 'name' is required and must be a non-empty string",
  );

  assert(
    typeof obj.geometry === "object" && obj.geometry !== null,
    "Field 'geometry' is required and must be an object",
  );

  const geometry = obj.geometry as Partial<Geometry>;

  assert(
    geometry.type === "Polygon",
    "Field 'geometry type' must be 'Polygon'",
  );

  validatePolygonCoordinates(geometry.coordinates);

  return {
    name: obj.name,
    geometry: {
      type: geometry.type,
      coordinates: geometry.coordinates,
    },
  };
}
