import { Response } from "express";

import HandleErrors from "../decorators/handleErrors.decorator";
import { addAuthCookie } from "../helpers/addAuthCookie";
import { returnError } from "../helpers/errorHandler";
import { BadRequestError, UnauthorizedError } from "../helpers/Errors";
import {
  buildUserObject,
  // checkTokenExpirationOrThrowError,
  validateLoginUserOrThrowError,
  validateRegisterUserOrThrowError,
  validateUserOrThrowError,
  // validateUserOrThrowError,
} from "../helpers/googleAuthCallbackHelpers";
import { handleGenericSuccessResponse } from "../helpers/successHandler";
import {
  JWT_EXPIRES_IN,
  ReqWithUserSchemaI,
  SECRET_KEY_TYPE,
} from "../interfaces/index";
import { JWTManager } from "../services";

/**
 * Class representing the controller for generating OAuth tokens and handling Google authentication callbacks.
 */
class AuthController {
  private static _instance: AuthController;

  /**
   * Private constructor to enforce the singleton pattern.
   */
  private constructor() {}

  /**
   * Get the singleton instance of AuthController.
   * @returns {AuthController} The singleton instance.
   */
  public static get instance(): AuthController {
    if (!AuthController._instance) {
      AuthController._instance = new AuthController();
    }

    return AuthController._instance;
  }

  /**
   * Handle Google authentication callback.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async googleAuthCallback(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const { socialMedia } = req.body;

    validateUserOrThrowError(socialMedia);

    // checkTokenExpirationOrThrowError(socialMedia);

    const user = buildUserObject(socialMedia);

    const result = await req.services?.authService.googleAuthCallback({
      user,
    });

    handleGenericSuccessResponse(
      result,
      "User (User) registered successfully.",
      res
    );
  }

  /**
   * Handle Google authentication callback.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async register(req: ReqWithUserSchemaI, res: Response): Promise<any> {
    const { deviceId, email, name, password } = req.body;

    const user = { deviceId, email, name, password };

    validateRegisterUserOrThrowError({ user });

    const result = await req.services?.authService.register({
      user,
    });

    handleGenericSuccessResponse(
      result,
      "User (User) registered successfully.",
      res
    );
  }

  /**
   * Handle Google authentication callback.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async login(req: ReqWithUserSchemaI, res: Response): Promise<any> {
    const { email, password } = req.body;

    const user = { email, password };

    validateLoginUserOrThrowError({ user });

    const result = await req.services?.authService.login(user);

    addAuthCookie(
      { refreshToken: result?.refreshToken, token: result?.token as string },
      res
    );

    handleGenericSuccessResponse(
      result,
      "User (User) loggedIn successfully.",
      res
    );
  }

  /**
   * Handle refreshToken.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async refreshToken(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return returnError(
        new BadRequestError("refreshToken is required."),
        req,
        res
      );
    }

    const decodedRefreshToken = JWTManager.instance.decodeJWT(refreshToken);

    if (decodedRefreshToken?.exp > new Date().getTime()) {
      return returnError(
        new UnauthorizedError("Expired refresh token. please login.", true),
        req as any,
        res
      );
    }

    const newAccessToken = await JWTManager.instance.generateJWT({
      expiresIn: JWT_EXPIRES_IN["1h"],
      payload: decodedRefreshToken,
      secretKeyType: SECRET_KEY_TYPE.jwtSecretKey,
    });

    const newRefreshToken = await JWTManager.instance.generateJWT({
      expiresIn: JWT_EXPIRES_IN["7d"],
      payload: decodedRefreshToken,
      secretKeyType: SECRET_KEY_TYPE.refreshJwtSecretKey,
    });

    addAuthCookie(
      { refreshToken: newRefreshToken, token: newAccessToken },
      res
    );

    handleGenericSuccessResponse(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Refreshed token successfully.",
      res
    );
  }
}

export default AuthController.instance;
