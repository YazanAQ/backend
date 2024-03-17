import express, { NextFunction, Router } from "express";

import PlaceController from "../controllers/PlaceController";
import { ReqWithUserSchemaI } from "../interfaces";
import authenticationMiddlware from "../middlewares/authentication.middleware";
import sharedContextMiddleware from "../middlewares/sharedContext.middleware";
import userSchemaMiddleware from "../middlewares/userSchema.middleware";

// Create an Express router for place routes
const placeRouter: Router = express.Router();

// Middleware to apply shared context and user schema validation
const commonMiddleware = [
  authenticationMiddlware,
  sharedContextMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userSchemaMiddleware(
      req as unknown as ReqWithUserSchemaI,
      res as any,
      next
    ),
] as any;

placeRouter.get("/place", commonMiddleware, (req, res) =>
  PlaceController.fetchPlaces(req as ReqWithUserSchemaI, res)
);
// Define place routes with shared middleware
placeRouter.post("/place/addPlace", commonMiddleware, (req, res) =>
  PlaceController.addPlace(req as ReqWithUserSchemaI, res)
);

placeRouter.post("/place/sharePlace", commonMiddleware, (req, res) =>
  PlaceController.sharePlace(req as ReqWithUserSchemaI, res)
);

placeRouter.delete("/place/removePlace", commonMiddleware, (req, res) =>
  PlaceController.removePlace(req as ReqWithUserSchemaI, res)
);

export default placeRouter;
