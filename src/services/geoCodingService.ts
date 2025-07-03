import axios from "axios";
import { IPoint } from "../types/regionTypes";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";

interface GeocodeAPIResult {
  lat: string;
  lon: string;
}

export const geocodeAddress = async (address: string): Promise<IPoint> => {
  try {
    const countryCode = process.env.GEOCODING_COUNTRY_CODE;
    const url =
      process.env.GEOCODING_API_BASE_URL ||
      "https://nominatim.openstreetmap.org";

    const params = {
      q: address,
      format: "json",
      ...(countryCode ? { countrycodes: countryCode } : {}),
    };

    const response = await axios.get(url, {
      params,
      headers: {
        "User-Agent": "ozmap-app/1.0",
      },
    });

    const data = response.data as GeocodeAPIResult[];
    if (!Array.isArray(data) || data.length === 0) {
      throw new CustomError("Address not found", HttpStatusCode.BAD_REQUEST);
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(
      "Failed to fetch coordinates using address",
      HttpStatusCode.BAD_GATEWAY,
    );
  }
};
