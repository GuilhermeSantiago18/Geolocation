import { TFunction } from "i18next";
import { Request } from "express";

export interface IRequestWithTranslation extends Request {
  t: TFunction;
}
