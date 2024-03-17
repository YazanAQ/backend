import express, { NextFunction, Router } from "express";

import FriendController from "../controllers/FriendController";
import { ReqWithUserSchemaI } from "../interfaces";
import authenticationMiddlware from "../middlewares/authentication.middleware";
import sharedContextMiddleware from "../middlewares/sharedContext.middleware";
import userSchemaMiddleware from "../middlewares/userSchema.middleware";

// Create an Express router for friend routes
const friendRouter: Router = express.Router();

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

// Define friend routes with shared middleware
friendRouter.patch(
  "/friend/acceptOrAbortFriendship",
  commonMiddleware,
  (req, res) =>
    FriendController.acceptOrAbortFriendship(req as ReqWithUserSchemaI, res)
);

friendRouter.post("/friend/addFriend", commonMiddleware, (req, res) =>
  FriendController.addFriend(req as ReqWithUserSchemaI, res)
);

friendRouter.get("/friend", commonMiddleware, (req, res) =>
  FriendController.fetchFriends(req as ReqWithUserSchemaI, res)
);

friendRouter.delete("/friend/removeFriend", commonMiddleware, (req, res) =>
  FriendController.removeFriend(req as ReqWithUserSchemaI, res)
);

friendRouter.get("/friend/search", commonMiddleware, (req, res) =>
  FriendController.search(req as ReqWithUserSchemaI, res)
);

export default friendRouter;
