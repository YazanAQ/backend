import Joi, { ValidationResult } from "joi";

import { RegisterArgsI, SOCIAL_MEDIA_I } from "../interfaces";

/**
 * Joi schema for validating the structure of social media data.
 */
export const userSchema = Joi.object({
  account: Joi.object({
    access_token: Joi.string().required(),
    expires_at: Joi.number().required(),
    id_token: Joi.string().required(),
    provider: Joi.string().required(),
    providerAccountId: Joi.string().required(),
    refresh_token: Joi.string().required(),
    scope: Joi.string().required(),
    token_type: Joi.string().required(),
    type: Joi.string().required(),
  }).required(),
  profile: Joi.object({
    at_hash: Joi.string().required(),
    aud: Joi.string().required(),
    azp: Joi.string().required(),
    email: Joi.string().email().required(),
    email_verified: Joi.boolean().required(),
    exp: Joi.number().required(),
    family_name: Joi.string().required(),
    given_name: Joi.string().required(),
    hd: Joi.string().required(),
    iat: Joi.number().required(),
    iss: Joi.string().required(),
    locale: Joi.string().required(),
    name: Joi.string().required(),
    picture: Joi.string().required(),
    sub: Joi.string().required(),
  }).required(),
  token: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    picture: Joi.string().required(),
    sub: Joi.string().required(),
  }).required(),
  user: Joi.object({
    deviceId: Joi.string().required(),
    email: Joi.string().email().required(),
    id: Joi.string().required(),
    image: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
});

/**
 * Joi schema for validating the structure of user registration data.
 */
export const userRegisterSchema = Joi.object({
  deviceId: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

/**
 * Joi schema for validating the structure of user registration data.
 */
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

/**
 * Validates social media data against the defined schema.
 * @param {SOCIAL_MEDIA_I} user - The social media data to validate.
 * @returns {ValidationResult} The result of the validation.
 */
export const validateUser = (user: SOCIAL_MEDIA_I): ValidationResult =>
  userSchema.validate(user);

/**
 * Validates user registration data against the defined schema.
 * @param {Partial<RegisterArgsI>} user - The user registration data to validate.
 * @returns {ValidationResult} The result of the validation.
 */
export const validateRegisterUser = ({
  user,
}: Partial<RegisterArgsI>): ValidationResult =>
  userRegisterSchema.validate(user);

/**
 * Validates user registration data against the defined schema.
 * @param {Partial<RegisterArgsI>} user - The user registration data to validate.
 * @returns {ValidationResult} The result of the validation.
 */
export const validateLoginUser = ({
  user,
}: Partial<RegisterArgsI>): ValidationResult => userLoginSchema.validate(user);
