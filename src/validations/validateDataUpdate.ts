import { CustomError } from "../errors/CustomError";
import { IRegion } from "../types/regionTypes";

function assert(
  condition: boolean,
  message: string,
  status = 400,
): asserts condition {
  if (!condition) throw new CustomError(message, status);
}

export function validateUpdateRegion(data: Partial<IRegion>): void {
  if (("type" in data || "coordinates" in data) && !("geometry" in data)) {
    throw new CustomError(
      "Invalid payload: 'type' and 'coordinates' must be inside the 'geometry' object",
      400,
    );
  }

  if ("name" in data) {
    assert(
      typeof data.name === "string" && data.name.trim().length > 0,
      "Name must be a non-empty string",
    );
  }

  if ("geometry" in data) {
    const geometry = data.geometry;
    assert(
      typeof geometry === "object" && geometry !== null,
      "Geometry must be an object",
    );

    assert(geometry.type === "Polygon", `Geometry.type must be "Polygon"`);

    assert(
      Array.isArray(geometry.coordinates),
      "Geometry.coordinates must be an array",
    );

    const coords = geometry.coordinates;

    coords.forEach((ring, ringIndex) => {
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];
      assert(
        firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1],
        `Ring ${ringIndex} must be closed (first and last points must be the same)`,
      );
    });
    assert(coords.length > 0, "Geometry.coordinates cannot be empty");

    coords.forEach((ring, ringIndex) => {
      assert(
        Array.isArray(ring),
        `Geometry.coordinates[${ringIndex}] must be an array`,
      );

      ring.forEach((point, pointIndex) => {
        assert(
          Array.isArray(point),
          `Geometry.coordinates[${ringIndex}][${pointIndex}] must be an array`,
        );
        assert(
          point.length === 2,
          `Geometry.coordinates[${ringIndex}][${pointIndex}] must have exactly 2 numbers`,
        );

        point.forEach((num, numIndex) => {
          assert(
            typeof num === "number",
            `Geometry.coordinates[${ringIndex}][${pointIndex}][${numIndex}] must be a number`,
          );
        });
        const [lng, lat] = point;
        assert(
          lng >= -180 && lng <= 180,
          `Longitude at coordinates[${ringIndex}][${pointIndex}] must be between -180 and 180`,
        );
        assert(
          lat >= -90 && lat <= 90,
          `Latitude at coordinates[${ringIndex}][${pointIndex}] must be between -90 and 90`,
        );
      });
    });
  }
}
