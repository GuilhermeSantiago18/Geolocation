import { HttpStatusCode } from "../constants/httpStatus";
import { CustomError } from "../errors/CustomError";

export function validateDataQuery(
  lng: number,
  lat: number,
  distance?: number,
): { lng: number; lat: number; distance?: number } {
  const lngNum = Number(lng);
  const latNum = Number(lat);
  const distanceNum = distance !== undefined ? Number(distance) : undefined;

  const isLngInvalid = !lng || Number.isNaN(lngNum);
  const isLatInvalid = !lat || Number.isNaN(latNum);
  const isDistanceInvalid =
    distance !== undefined && (Number.isNaN(distanceNum) || distanceNum < 0);

  if (isLngInvalid || isLatInvalid || isDistanceInvalid) {
    throw new CustomError("region.queryInvalid", HttpStatusCode.BAD_REQUEST);
  }

  const result: { lng: number; lat: number; distance?: number } = {
    lng: lngNum,
    lat: latNum,
  };

  if (distanceNum !== undefined) {
    result.distance = distanceNum;
  }

  return result;
}
