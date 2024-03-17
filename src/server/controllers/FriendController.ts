import { Response } from "express";

import { FRIEND_STATUS } from "../../database";
import HandleErrors from "../decorators/handleErrors.decorator";
import { BadRequestError } from "../helpers/Errors";
import { handleGenericSuccessResponse } from "../helpers/successHandler";
import { ReqWithUserSchemaI } from "../interfaces/index";

/**
 * Class representing the controller for managing user friendships.
 */
class FriendController {
  private static _instance: FriendController;

  /**
   * Private constructor to enforce the singleton pattern.
   */
  private constructor() {}

  /**
   * Get the singleton instance of FriendController.
   * @returns {FriendController} The singleton instance.
   */
  public static get instance(): FriendController {
    if (!FriendController._instance) {
      FriendController._instance = new FriendController();
    }

    return FriendController._instance;
  }

  /**
   * Handle adding a friend for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async addFriend(req: ReqWithUserSchemaI, res: Response): Promise<any> {
    const { friendId } = req.body;

    const result = await req.services?.friendService.addFriend({
      friendId,
      userId: req.user.id!,
    });

    handleGenericSuccessResponse(result, "Friend added successfully.", res);
  }

  /**
   * Handle searching for friends by name or email.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async search(req: ReqWithUserSchemaI, res: Response): Promise<any> {
    const urlParams = new URLSearchParams(req.query as unknown as string);
    const name = urlParams.get("name");
    const email = urlParams.get("email");

    const result = await req.services?.friendService.search({
      email: email as string,
      name: name as string,
    });

    handleGenericSuccessResponse(result, "Friend search successful.", res);
  }

  /**
   * Handle removing a friend for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async removeFriend(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const { friendId } = req.body;

    if (!friendId) {
      throw new BadRequestError("Missing friendId.");
    }

    const result = await req.services?.friendService.removeFriend({
      friendId,
      userId: req.user.id!,
    });

    handleGenericSuccessResponse(result, "Friend removed successfully.", res);
  }

  /**
   * Handle fetching a friend for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async fetchFriends(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const urlParams = new URLSearchParams(req.query as unknown as string);
    const status = urlParams.get("status") ?? FRIEND_STATUS.accepted;
    const hashFriendStatus = {
      [FRIEND_STATUS.accepted]: async () =>
        req.services?.friendService.fetchAcceptedFriends({
          id: req.user.id!,
        }),
      [FRIEND_STATUS.pending]: async () =>
        req.services?.friendService.fetchPendingFriends({
          id: req.user.id!,
        }),
      [FRIEND_STATUS.aborted]: async () =>
        req.services?.friendService.fetchAbortedFriends({
          id: req.user.id!,
        }),
    };

    const result = hashFriendStatus[status]
      ? await hashFriendStatus[status]()
      : hashFriendStatus[FRIEND_STATUS.accepted];

    handleGenericSuccessResponse(
      result,
      "Friend fetchFriends successfully.",
      res
    );
  }

  /**
   * Handle acceptOrAbortFriendship for the current user.
   * @param {ReqWithUserSchemaI} req - The Express request object with user schema.
   * @param {Response} res - The Express response object.
   */
  @HandleErrors
  public async acceptOrAbortFriendship(
    req: ReqWithUserSchemaI,
    res: Response
  ): Promise<any> {
    const { friendId, status } = req.body;

    if (!friendId || !status) {
      throw new BadRequestError("Missing friendId or status.");
    }

    const result = await req.services?.friendService.acceptOrAbortFriendship({
      friendId,
      status,
      userId: req.user.id!,
    });

    handleGenericSuccessResponse(
      result,
      "acceptOrAbortFriendship successfully.",
      res
    );
  }
}

export default FriendController.instance;
