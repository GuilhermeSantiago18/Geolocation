import axios from "axios";
import { IPoint } from "../types/IRegion";
import { CustomError } from "../errors/CustomError";

interface GeocodeAPIResult {
  lat: string;
  lon: string;
}

export const geocodeAddress = async (address: string): Promise<IPoint> => {
  try {
    const url =
      process.env.GEOCODING_API_BASE_URL ||
      "https://nominatim.openstreetmap.org";

    const response = await axios.get(url, {
      params: {
        q: address,
        format: "json",
      },
      headers: {
        "User-Agent": "ozmap-app/1.0",
      },
    });

    const data = response.data as GeocodeAPIResult[];
    console.log("data", data);
    if (!Array.isArray(data) || data.length === 0) {
      throw new CustomError("Address not found", 400);
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
    };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError("Failed to fetch coordinates using address", 502);
  }
};
