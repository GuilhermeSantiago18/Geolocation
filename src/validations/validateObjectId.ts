import { Types } from "mongoose";
import { CustomError } from "../errors/CustomError";

export const validateObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid Id format", 400);
  }
};
