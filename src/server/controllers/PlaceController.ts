import { Response } from "express";

import HandleErrors from "../decorators/handleErrors.decorator";
import { BadRequestError } from "../helpers/Errors";
import { handleGenericSuccessResponse } from "../helpers/successHandler";
import { ReqWithUserSchemaI } from "../interfaces/index";

/**
 * Class representing the controller for managing user Placeships.
 */
class PlaceController {
  private static _instance: PlaceController;

  /**
   * Private constructor to enforce the singleton pattern.
   */
  private constructor() {}

  /**
   * Get the singleton instance of PlaceController.
   * @returns {PlaceController} The singleton instance.
   */
  public static get instance(): PlaceController {
    if (!PlaceController._instance) {
      PlaceController._instance = new PlaceController();
    }

    return PlaceController._instance;
  }

  /**
   * Handle adding a Place for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async addPlace(req: ReqWithUserSchemaI, res: Response): Promise<any> {
    const { address, description, latitude, longitude, name } = req.body;

    const result = await req.services?.placeService.addPlace({
      address,
      description,
      latitude,
      longitude,
      name,
      ownerId: req.user.id!,
    });

    handleGenericSuccessResponse(result, "Place added successfully.", res);
  }

  /**
   * Handle removing a Place for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async removePlace(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const { id } = req.body;

    if (!id) {
      throw new BadRequestError("Missing PlaceId.");
    }

    const result = await req.services?.placeService.removePlace({
      id,
      ownerId: req.user.id!,
    });

    handleGenericSuccessResponse(result, "Place removed successfully.", res);
  }

  /**
   * Handle share a Place with friends for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async sharePlace(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const { friendIds, placeId } = req.body;

    if (!friendIds?.length) {
      throw new BadRequestError("Missing friends.");
    }

    if (!placeId) {
      throw new BadRequestError("Missing PlaceId.");
    }

    const result = await req.services?.placeService.sharePlace({
      friendIds,
      ownerId: req.user.id!,
      placeId,
    });

    handleGenericSuccessResponse(result, "Place shared successfully.", res);
  }

  /**
   * Handle fetch a Place with friends for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async fetchPlaces(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const result = await req.services?.placeService.fetchPlaces({
      ownerId: req.user.id!,
    });

    handleGenericSuccessResponse(result, "Place fetched successfully.", res);
  }
}

export default PlaceController.instance;
