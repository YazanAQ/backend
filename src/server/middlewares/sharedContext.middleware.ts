import { NextFunction, Response } from "express";

import { ReqWithSharedContextI } from "../interfaces";
import SharedContext from "../SharedContext";

const sharedContextMiddleware = (
  req: ReqWithSharedContextI,
  _res: Response,
  next: NextFunction
): void => {
  req.sharedContext = SharedContext;
  next();
};

export default sharedContextMiddleware;
