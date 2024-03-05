import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { NextFunction, Response } from "express";

import { GeoGeniusOrm } from "../../database";
import makeGeoGeniusApiServices from "../helpers/makeUserServices";
import { ReqWithUserSchemaI } from "../interfaces";

// Load environment variables
expand(dotenv.config());

const userSchemaMiddleware = async (
  req: ReqWithUserSchemaI,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Access GeoGeniusOrm from shared context
    const geoGeniusOrm = req.sharedContext?.geoGeniusOrm as GeoGeniusOrm;
    req.services = makeGeoGeniusApiServices({
      geoGeniusOrm,
    });
  } catch (error) {
    console.error("Error in userSchemaMiddleware:", error);
  }

  next();
};

export default userSchemaMiddleware;
