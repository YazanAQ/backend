import { RequestHandler } from "express";
import { ParsedQs } from "qs";

import { returnError } from "../helpers/errorHandler";
import { InternalServerError, UnauthorizedError } from "../helpers/Errors";
import { AuthorizedRequest } from "../interfaces";
import { JWTManager } from "../services";

const authenticationMiddlware = (
  req: AuthorizedRequest,
  res: Response,
  next: CallableFunction
) => {
  try {
    const token: string =
      req.cookies.accessToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return returnError(
        new UnauthorizedError("Invalid token.", true),
        req as any,
        res as any
      );
    }

    const decodedJwt = JWTManager.instance.decodeJWT(token);

    if (decodedJwt?.exp > new Date().getTime()) {
      return returnError(
        new UnauthorizedError(
          "Expired token. please login or refresh your token",
          true
        ),
        req as any,
        res as any
      );
    }

    req.user = decodedJwt;

    next();
  } catch (error: any) {
    return returnError(
      new InternalServerError(error.message),
      req as any,
      res as any
    );
  }
};

export default authenticationMiddlware as unknown as RequestHandler<
  any,
  any,
  any,
  ParsedQs,
  Record<string, any>
>;
