import { Types } from "mongoose";
import { CustomError } from "../errors/CustomError";
import { HttpStatusCode } from "../constants/httpStatus";

export const validateObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError("region.invalidIdFormat", HttpStatusCode.BAD_REQUEST);
  }
};
