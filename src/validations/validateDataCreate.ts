import { HttpStatusCode } from "../constants/httpStatus";
import { CustomError } from "../errors/CustomError";

interface Geometry {
  type: "Polygon";
  coordinates: number[][][];
}

interface RegionInput {
  name: string;
  geometry: Geometry;
}

function assert(
  condition: boolean,
  message: string,
  options?: Record<string, unknown>,
): asserts condition {
  if (!condition)
    throw new CustomError(message, HttpStatusCode.BAD_REQUEST, options);
}

function validatePolygonCoordinates(
  coordinates: number[][][],
): asserts coordinates is number[][][] {
  assert(Array.isArray(coordinates), "region.geometryCoordinatesInvalid");

  assert(coordinates.length > 0, "region.geometryCoordinatesEmpty");

  const outerRing = coordinates[0];

  assert(Array.isArray(outerRing), "region.geometryCoordinatesInvalid");
  assert(outerRing.length >= 4, "region.ringTooShort");

  outerRing.forEach((point, i) => {
    assert(Array.isArray(point) && point.length === 2, "region.pointInvalid", {
      index: i,
    });

    const [lng, lat] = point;

    assert(
      typeof lng === "number" && lng >= -180 && lng <= 180,
      "region.longitudeInvalid",
      { index: i },
    );
    assert(
      typeof lat === "number" && lat >= -90 && lat <= 90,
      "region.latitudeInvalid",
      { index: i },
    );
  });

  const firstPoint = outerRing[0];
  const lastPoint = outerRing[outerRing.length - 1];

  assert(
    Array.isArray(firstPoint) && firstPoint.length === 2,
    "region.pointInvalid",
    { index: 0 },
  );
  assert(
    Array.isArray(lastPoint) && lastPoint.length === 2,
    "region.pointInvalid",
    { index: outerRing.length - 1 },
  );

  assert(
    firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1],
    "region.ringNotClosed",
  );
}

export function validateCreateRegion(data: unknown): RegionInput {
  assert(typeof data === "object" && data !== null, "region.invalidObject");

  const obj = data as Partial<RegionInput>;

  assert(
    typeof obj.name === "string" && obj.name.trim() !== "",
    "region.nameRequired",
  );

  assert(
    typeof obj.geometry === "object" && obj.geometry !== null,
    "region.geometryRequired",
  );

  const geometry = obj.geometry as Partial<Geometry>;

  assert(geometry.type === "Polygon", "region.geometryTypeInvalid");

  validatePolygonCoordinates(geometry.coordinates);

  return {
    name: obj.name,
    geometry: {
      type: geometry.type,
      coordinates: geometry.coordinates,
    },
  };
}
