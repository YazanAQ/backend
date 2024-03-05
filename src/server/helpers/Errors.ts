import { HTTP_STATUS_CODES } from "../constants/index";
import { CustomErrorOptionsI } from "../interfaces/index";

/**
 * Custom base error class that extends the Error class.
 * Used as the base class for all other custom error classes.
 */
class CustomError extends Error {
  public readonly isOperational: boolean;
  public readonly name: string;
  public readonly statusCode: number;

  /**
   * Create a new CustomError instance.
   * @param {CustomErrorOptions} errorProps - The properties of the error.
   */
  constructor(errorProps: CustomErrorOptionsI) {
    super(errorProps.description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.isOperational = errorProps.isOperational;
    this.name = errorProps.name;
    this.statusCode = errorProps.statusCode;
    Error.captureStackTrace(this);
  }
}

/**
 * Custom error class for Bad Request (400) errors.
 */
class BadRequestError extends CustomError {
  /**
   * Create a new BadRequestError instance.
   * @param {string} name - The name of the error.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (true) or programmer error (false).
   */
  constructor(name: string, isOperational: boolean = true) {
    super({
      description: name ? `Bad request : ${name}` : "Bad request",
      isOperational,
      name,
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    });
  }
}

/**
 * Custom error class for Not Found (404) errors.
 */
class NotFoundError extends CustomError {
  /**
   * Create a new NotFoundError instance.
   * @param {string} name - The name of the error.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (true) or programmer error (false).
   */
  constructor(name: string, isOperational: boolean = true) {
    super({
      description: name ? `Not found :  ${name}` : "Not found",
      isOperational,
      name,
      statusCode: HTTP_STATUS_CODES.NOT_FOUND,
    });
  }
}

/**
 * Custom error class for Conflict (409) errors.
 */
class ConflictError extends CustomError {
  /**
   * Create a new ConflictError instance.
   * @param {string} name - The name of the error.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (true) or programmer error (false).
   */
  constructor(name: string, isOperational: boolean = true) {
    super({
      description: name
        ? `Conflict, resource already exists : ${name}`
        : "Conflict, resource already exists",
      isOperational,
      name,
      statusCode: HTTP_STATUS_CODES.CONFLICT,
    });
  }
}

/**
 * Custom error class for Internal Server Error (500) errors.
 */
class InternalServerError extends CustomError {
  /**
   * Create a new InternalServerError instance.
   * @param {string} name - The name of the error.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (true) or programmer error (false).
   */
  constructor(name: string, isOperational: boolean = true) {
    super({
      description: name
        ? `Internal Server error :  ${name}`
        : "Internal Server error",
      isOperational,
      name,
      statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER,
    });
  }
}

/**
 * Custom error class for Unauthorized (401) errors.
 */
class UnauthorizedError extends CustomError {
  /**
   * Create a new UnauthorizedError instance.
   * @param {string} name - The name of the error.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (true) or programmer error (false).
   */
  constructor(name: string, isOperational: boolean = true) {
    super({
      description: name ? `Unauthorized :  ${name}` : "Unauthorized",
      isOperational,
      name,
      statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
    });
  }
}

export {
  BadRequestError,
  ConflictError,
  CustomError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
};
