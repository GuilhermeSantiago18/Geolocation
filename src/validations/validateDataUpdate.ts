import { HttpStatusCode } from "../constants/httpStatus";
import { CustomError } from "../errors/CustomError";
import { IRegion } from "../types/regionTypes";

function assert(
  condition: boolean,
  message: string,
  status = HttpStatusCode.BAD_REQUEST,
  options?: Record<string, unknown>,
): asserts condition {
  if (!condition) throw new CustomError(message, status, options);
}

export function validateUpdateRegion(data: Partial<IRegion>): void {
  if (("type" in data || "coordinates" in data) && !("geometry" in data)) {
    throw new CustomError(
      "region.invalidPayloadGeometryWrapper",
      HttpStatusCode.BAD_REQUEST,
    );
  }

  if ("name" in data) {
    assert(
      typeof data.name === "string" && data.name.trim().length > 0,
      "region.nameRequired",
    );
  }

  if ("geometry" in data) {
    const geometry = data.geometry;
    assert(
      typeof geometry === "object" && geometry !== null,
      "region.geometryObjectInvalid",
    );

    assert(geometry.type === "Polygon", "region.geometryTypeInvalid");

    assert(Array.isArray(geometry.coordinates), "region.coordinatesNotArray");

    const coords = geometry.coordinates;

    coords.forEach((ring, ringIndex) => {
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];
      assert(
        firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1],
        "region.ringNotClosed",
        HttpStatusCode.BAD_REQUEST,
        { ringIndex },
      );
    });

    assert(coords.length > 0, "region.coordinatesEmpty");

    coords.forEach((ring, ringIndex) => {
      assert(
        Array.isArray(ring),
        "region.ringNotArray",
        HttpStatusCode.BAD_REQUEST,
        { ringIndex },
      );

      ring.forEach((point, pointIndex) => {
        assert(
          Array.isArray(point),
          "region.pointNotArray",
          HttpStatusCode.BAD_REQUEST,
          { ringIndex, pointIndex },
        );
        assert(
          point.length === 2,
          "region.pointInvalidLength",
          HttpStatusCode.BAD_REQUEST,
          { ringIndex, pointIndex },
        );

        point.forEach((num, numIndex) => {
          assert(
            typeof num === "number",
            "region.pointNotNumber",
            HttpStatusCode.BAD_REQUEST,
            { ringIndex, pointIndex, numIndex },
          );
        });

        const [lng, lat] = point;
        assert(
          lng >= -180 && lng <= 180,
          "region.longitudeInvalid",
          HttpStatusCode.BAD_REQUEST,
          { ringIndex, pointIndex },
        );
        assert(
          lat >= -90 && lat <= 90,
          "region.latitudeInvalid",
          HttpStatusCode.BAD_REQUEST,
          { ringIndex, pointIndex },
        );
      });
    });
  }
}
