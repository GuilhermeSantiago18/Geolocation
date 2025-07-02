import { CustomError } from "../errors/CustomError";
import { IRegion } from "../types/IRegion";

function assert(
  condition: boolean,
  message: string,
  status = 400,
): asserts condition {
  if (!condition) throw new CustomError(message, status);
}

export function validateUpdateRegion(data: Partial<IRegion>): void {
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
      });
    });
  }
}
