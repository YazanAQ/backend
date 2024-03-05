import { NextFunction, Request, Response } from "express";

import { ALLOWED_ORIGINS_PATTERN } from "../constants";

const handleOptionsRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    const { origin = "" } = req.headers;

    console.info({
      allowed: ALLOWED_ORIGINS_PATTERN.test(origin) || !origin,
      origin,
    });

    if (ALLOWED_ORIGINS_PATTERN.test(origin) || !origin) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT");
      res.header(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"]
      );
      res.header("Access-Control-Allow-Credentials", "true");
      res.status(204).send();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  } else {
    next();
  }
};

export default handleOptionsRequest;
