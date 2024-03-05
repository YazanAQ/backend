import { NextFunction, Request, Response } from "express";

import { returnError } from "../helpers/errorHandler";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/Errors";

const HandleErrors = (
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await originalMethod.apply(this, [req, res, next]);
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        return returnError(new BadRequestError(error.name), req, res);
      }

      if (error instanceof UnauthorizedError) {
        return returnError(new UnauthorizedError(error.name), req, res);
      }

      if (error instanceof ConflictError) {
        return returnError(new ConflictError(error.name), req, res);
      }

      if (error instanceof NotFoundError) {
        return returnError(new NotFoundError(error.name), req, res);
      }

      return returnError(new InternalServerError(error.name), req, res);
    }
  };

  return descriptor;
};

export default HandleErrors;
