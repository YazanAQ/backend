import express, { NextFunction, Router } from "express";

import AuthController from "../controllers/AuthController";
import { ReqWithUserSchemaI } from "../interfaces";
import sharedContextMiddleware from "../middlewares/sharedContext.middleware";
import userSchemaMiddleware from "../middlewares/userSchema.middleware";

// Create an Express router for OAuth routes
const oAuthRouter: Router = express.Router();

// Middleware to apply shared context and user schema validation
const commonMiddleware = [
  sharedContextMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userSchemaMiddleware(
      req as unknown as ReqWithUserSchemaI,
      res as any,
      next
    ),
] as any;

// Define OAuth routes with shared middleware
oAuthRouter.post("/auth/googleAuthCallback", commonMiddleware, (req, res) =>
  AuthController.googleAuthCallback(req as ReqWithUserSchemaI, res)
);

oAuthRouter.post("/auth/register", commonMiddleware, (req, res) =>
  AuthController.register(req as ReqWithUserSchemaI, res)
);

oAuthRouter.post("/auth/login", commonMiddleware, (req, res) =>
  AuthController.login(req as ReqWithUserSchemaI, res)
);

oAuthRouter.post("/auth/refreshToken", commonMiddleware, (req, res) =>
  AuthController.refreshToken(req as ReqWithUserSchemaI, res)
);

export default oAuthRouter;
