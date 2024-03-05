import { CustomError } from "./Errors";
import { Request, Response } from "express";

/**
 * Logs the error to the console.
 * @param {Error} err - The error object to log.
 */
const logError = (err: Error): void => {
  console.error(err);
};

/**
 * Returns an error response to the client with the specified error object.
 * @param {Error} error - The error object to send in the response.
 * @param {Request} _req - The HTTP request object (not used in this function).
 * @param {Response} res - The HTTP response object.
 */
const returnError = (error: Error, _req: Request, res: Response): void => {
  const statusCode = (error as CustomError).statusCode || 500;
  const message = error.message || "Internal server error";

  res.json({
    ...error,
    message,
    statusCode,
  });
};

/**
 * Checks if the error is an operational error (instance of BaseError).
 * @param {Error} error - The error object to check.
 * @returns {boolean} True if the error is an operational error, false otherwise.
 */
const isOperationalError = (error: Error): boolean =>
  error instanceof CustomError && (error as CustomError).isOperational;

export { isOperationalError, logError, returnError };
