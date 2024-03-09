import { BadRequestError, UnauthorizedError } from "./Errors";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";
import { v4 as uuid } from "uuid";

import User from "../../database/orm/models/user.model";
import { RegisterArgsI, SOCIAL_MEDIA_I } from "../interfaces";
import {
  validateLoginUser,
  validateRegisterUser,
  validateUser,
} from "../validation";

/**
 * Validates the user information in the social media data or throws a BadRequestError if invalid.
 * @param {RegisterArgsI} user - The user information.
 * @throws {BadRequestError} If the user information is invalid.
 */
const validateRegisterUserOrThrowError = ({
  user,
}: Partial<RegisterArgsI>): void => {
  if (!user) {
    throw new BadRequestError(`Missing User info`);
  }

  const { error } = validateRegisterUser({ user });

  if (error) {
    throw new BadRequestError(
      `Invalid User: ${getErrorMessageFromValidationResult(error)}`
    );
  }
};

/**
 * Validates the user information in the user data or throws a BadRequestError if invalid.
 * @param {RegisterArgsI} user - The user information.
 * @throws {BadRequestError} If the user information is invalid.
 */
const validateLoginUserOrThrowError = ({
  user,
}: Partial<RegisterArgsI>): void => {
  if (!user) {
    throw new BadRequestError(`Missing User info`);
  }

  const { error } = validateLoginUser({ user });

  if (error) {
    throw new BadRequestError(
      `Invalid User: ${getErrorMessageFromValidationResult(error)}`
    );
  }
};

/**
 * Validates the user information in the social media data or throws a BadRequestError if invalid.
 * @param {SOCIAL_MEDIA_I} socialMedia - The social media data containing user information.
 * @throws {BadRequestError} If the user information is invalid.
 */
const validateUserOrThrowError = (socialMedia: SOCIAL_MEDIA_I): void => {
  if (!socialMedia) {
    throw new BadRequestError(`Missing Social media`);
  }

  const { error } = validateUser(socialMedia);

  if (error) {
    throw new BadRequestError(
      `Invalid User: ${getErrorMessageFromValidationResult(error)}`
    );
  }
};

/**
 * Checks if the token in the social media data is expired or throws an UnauthorizedError.
 * @param {SOCIAL_MEDIA_I} socialMedia - The social media data containing token information.
 * @throws {UnauthorizedError} If the token is expired.
 */
const checkTokenExpirationOrThrowError = (
  socialMedia: SOCIAL_MEDIA_I
): void => {
  if (!socialMedia) {
    throw new BadRequestError(`Missing Social media`);
  }

  const isExpiredToken =
    new Date().getTime() > socialMedia?.account?.expires_at;

  if (isExpiredToken) {
    throw new UnauthorizedError("Unable to Unauthorize. Expired google token");
  }
};

/**
 * Builds a user object using the provided social media data.
 * @param {SOCIAL_MEDIA_I} socialMedia - The social media data.
 * @returns {Partial<User>} - The constructed user object.
 */
const buildUserObject = (socialMedia: SOCIAL_MEDIA_I): Partial<User> => ({
  email: socialMedia.profile.email,
  id: uuid(),
  imageUrl: socialMedia.user.image,
  isActive: true,
  name: socialMedia.profile.name,
  socialMedia: socialMedia as unknown as JSON,
});

/**
 * Extracts error messages from a Joi validation result.
 * @param {ValidationError} validationError - The Joi validation error.
 * @returns {string} - The error message.
 */
const getErrorMessageFromValidationResult = (
  validationError: ValidationError
): string =>
  validationError.details.map((result) => result?.message).join(", ");

/**
 * Converts an object to a JSON string, handling circular references.
 *
 * @param {Object} obj - The object to stringify.
 * @returns {string} The JSON string representation of the object.
 */
const stringifyObject = (obj: object): string => {
  let cache: any[] = [];
  const jsonString: string = JSON.stringify(obj, (_key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }

      // Store value in our collection
      cache.push(value);
    }

    return value;
  });
  cache = null!; // Reset the cache

  return jsonString;
};

/**
 * Hashes a password using bcrypt with a generated salt.
 *
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise resolving to the hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
  // Generate a salt
  const saltRounds: number = 10;
  const salt: string = await bcrypt.genSalt(saltRounds);

  // Hash the password with the generated salt
  const hashedPassword: string = await bcrypt.hash(password, salt);

  return hashedPassword;
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} plainPassword - The plain text password to be compared.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise resolving to a boolean indicating whether the passwords match.
 */
const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  // Compare the provided plain password with the hashed password
  const isMatch: boolean = await bcrypt.compare(plainPassword, hashedPassword);

  return isMatch;
};

/**
 * Builds a register user  using the provided register args data.
 * @param {RegisterArgsI} registerArgsI - The register args data.
 * @returns {Partial<User & { name: string, deviceId:string }>} - The constructed user object.
 */
const buildRegisterUser = async ({
  user: { deviceId, email, name, password } = {},
}: Partial<RegisterArgsI>): Promise<
  Partial<User & { name: string; deviceId: string }>
> => ({
  deviceId,
  email,
  id: uuid(),
  name,
  password,
});

export {
  buildRegisterUser,
  buildUserObject,
  checkTokenExpirationOrThrowError,
  comparePassword,
  hashPassword,
  stringifyObject,
  validateLoginUserOrThrowError,
  validateRegisterUserOrThrowError,
  validateUserOrThrowError,
};
