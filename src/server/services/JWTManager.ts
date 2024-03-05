import * as jwt from "jsonwebtoken";

import User from "../../database/orm/models/user.model";
import { SECRET_KEY_VALUES } from "../constants";
import { InternalServerError } from "../helpers/Errors";
import { stringifyObject } from "../helpers/googleAuthCallbackHelpers";
import { JWT_EXPIRES_IN, SECRET_KEY_TYPE } from "../interfaces";

/**
 * JWTManager class for handling JSON Web Token (JWT) operations.
 */
export class JWTManager {
  private readonly jwtSecretKey: string;
  private readonly refreshJwtSecretKey: string; // Add refresh secret key
  private static _instance: JWTManager;

  private constructor(
    jwtSecretKey: string = SECRET_KEY_VALUES[SECRET_KEY_TYPE.jwtSecretKey],
    refreshJwtSecretKey: string = SECRET_KEY_VALUES[
      SECRET_KEY_TYPE.refreshJwtSecretKey
    ]
  ) {
    this.jwtSecretKey = jwtSecretKey;
    this.refreshJwtSecretKey = refreshJwtSecretKey;
  }

  /**
   * Gets the instance of JWTManager, following the singleton pattern.
   *
   * @static
   * @returns {JWTManager} The instance of JWTManager.
   */
  public static get instance(): JWTManager {
    if (!JWTManager._instance) {
      JWTManager._instance = new JWTManager();
    }

    return JWTManager._instance;
  }

  /**
   * Decodes a JSON Web Token (JWT).
   *
   * @param {string} token - The JWT to decode.
   * @returns {object | null} The decoded payload or throw error if decoding fails.
   */
  public decodeJWT(token: string): any {
    try {
      const decodedPayload = jwt.decode(token);

      return decodedPayload;
    } catch (error: any) {
      console.error("Error decoding JWT:", error.message);
      throw new InternalServerError(
        `Error decoding JWT => Error token is invalid or expired:, ${error.message}`
      );
    }
  }

  /**
   * Generates a JSON Web Token (JWT) for the provided payload.
   *
   * @param {User} payload - The payload to be included in the JWT.
   * @returns {Promise<string>} A promise resolving to the generated JWT.
   */
  public async generateJWT({
    expiresIn = JWT_EXPIRES_IN["1h"],
    payload,
    secretKeyType = SECRET_KEY_TYPE.jwtSecretKey,
  }: {
    payload: User | any;
    expiresIn?: JWT_EXPIRES_IN;
    secretKeyType?: SECRET_KEY_TYPE;
  }): Promise<string> {
    try {
      if (payload.exp) {
        delete payload.exp;
      }

      if (!payload || !Object.keys(payload).length) {
        throw new InternalServerError(`Missing payload for generating a JWT `);
      }

      const options = {
        expiresIn,
      };

      // Sign the token with the secret key
      const token = jwt.sign(
        JSON.parse(stringifyObject(payload)),
        this[secretKeyType],
        options
      );

      return token;
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }

  /**
   * Generates a new access token using a refresh token.
   *
   * @param {string} refreshToken - The refresh token to use.
   * @returns {Promise<string | null>} A promise resolving to the new access token or null if refresh fails.
   */
  public async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Verify the refresh token
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        this.refreshJwtSecretKey
      );

      // Use the data from the refresh token to generate a new access token
      const newAccessToken = await this.generateJWT({
        expiresIn: JWT_EXPIRES_IN["7d"],
        payload: decodedRefreshToken,
        secretKeyType: SECRET_KEY_TYPE.refreshJwtSecretKey,
      });

      return newAccessToken;
    } catch (error: any) {
      // Handle token verification failure
      console.error(`Error refreshing access token:, ${error.message}`);
      throw new InternalServerError(
        `Error refreshing access token:, ${error.message}`
      );
    }
  }
}
