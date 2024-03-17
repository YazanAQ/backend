import { Op, WhereOptions } from "sequelize";

import { FRIEND_STATUS, GeoGeniusOrm } from "../../database";
import User from "../../database/orm/models/user.model";
import UserFriends from "../../database/orm/models/userFriends.model";
import { BadRequestError, NotFoundError } from "../helpers/Errors";
import {
  BaseServiceArgsI,
  FriendArgsI,
  FriendResponseI,
  FriendSearch,
  FriendServiceInterface,
} from "../interfaces";

/**
 * Service class for managing user friendships.
 */
export class FriendService implements FriendServiceInterface {
  private readonly geoGeniusOrm?: GeoGeniusOrm;

  /**
   * Creates an instance of FriendService.
   * @param {BaseServiceArgsI} params - Parameters for initializing the service.
   * @param {GeoGeniusOrm} params.geoGeniusOrm - The ORM instance for database operations.
   */
  constructor({ geoGeniusOrm }: BaseServiceArgsI) {
    this.geoGeniusOrm = geoGeniusOrm;
  }

  /**
   * Searches for a user based on email or name.
   * @param {FriendSearch} param0 - Search parameters.
   * @returns {Promise<FriendResponseI>} A promise that resolves to the search result.
   */
  public async search({ email, name }: FriendSearch): Promise<FriendResponseI> {
    try {
      const user = await this.findUserWithDetails({ email, name });

      return { user };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Finds a user with associated details.
   * @param {Object} param0 - Search parameters.
   * @returns {Promise<User>} A promise that resolves to the user with details.
   */
  private async findUserWithDetails({
    email,
    id,
    name,
  }: {
    email?: string;
    name?: string;
    id?: string;
  }): Promise<User> {
    try {
      if (!email && !name && !id) {
        throw new BadRequestError(
          "You must provide an email, name, or id to search"
        );
      }

      const queryOptions: WhereOptions = { where: {} };

      if (name) {
        queryOptions.where = { name: { [Op.iLike]: `%${name}%` } };
      }

      if (email) {
        queryOptions.where = { ...queryOptions.where, email };
      }

      if (id) {
        queryOptions.where = { ...queryOptions.where, id };
      }

      queryOptions.include = id && [
        {
          include: [
            {
              as: "friend",
              attributes: {
                exclude: ["password", "socialMedia", "deletedAt", "isActive"],
              },
              model: User,
              required: false,
              where: { isActive: true },
            },
          ],
          model: this.geoGeniusOrm?.sequelize.models.UserFriends,
          where: {
            status: FRIEND_STATUS.accepted,
          },
        },
        {
          as: "sharedPlaces",
          include: [
            {
              as: "place",
              model: this.geoGeniusOrm?.sequelize.models.Place,
            },
            {
              as: "user",
              model: this.geoGeniusOrm?.sequelize.models.User,
            },
          ],
          model: this.geoGeniusOrm?.sequelize.models.SharedPlaces,
        },
      ];

      queryOptions.attributes = {
        exclude: ["password", "socialMedia", "deletedAt"],
      };

      return (await this.geoGeniusOrm?.sequelize.models.User.findOne(
        queryOptions
      )) as User;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Adds a friend for a user.
   * @param {FriendArgsI} param0 - Parameters for adding a friend.
   * @returns {Promise<FriendResponseI>} A promise that resolves to the updated user information.
   */
  public async addFriend({
    friendId,
    userId,
  }: FriendArgsI): Promise<FriendResponseI> {
    try {
      if (userId === friendId) {
        throw new BadRequestError(`You can't add yourself as a friend`);
      }

      const [user, friend] = await Promise.all([
        this.findActiveUser(userId),
        this.findActiveUser(friendId),
      ]);

      if (!user || !friend) {
        throw new NotFoundError("User or friend not found or is not active");
      }

      const userFriendExists =
        await this.geoGeniusOrm?.models.UserFriends.count({
          where: { friendId, userId },
        });

      if (userFriendExists) {
        throw new BadRequestError(
          `There is already a friendship between userId: ${userId} and friendId: ${friendId}`
        );
      }

      await this.geoGeniusOrm?.models.UserFriends.create({
        friendId,
        status: FRIEND_STATUS.pending,
        userId,
      });

      const userInfo = await this.findUserWithDetails({ id: userId });

      return { user: userInfo?.toJSON() };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Removes a friend for a user.
   * @param {FriendArgsI} param0 - Parameters for removing a friend.
   * @returns {Promise<FriendResponseI>} A promise that resolves to the updated user information.
   */
  public async removeFriend({
    friendId,
    userId,
  }: FriendArgsI): Promise<FriendResponseI> {
    try {
      await this.findActiveUser(userId);
      await this.findActiveUser(friendId);

      const count =
        await this.geoGeniusOrm?.sequelize.models.UserFriends.destroy({
          where: { friendId, userId },
        });

      if (!count) {
        throw new BadRequestError(
          `There is no friendship between userId: ${userId} and friendId: ${friendId}`
        );
      }

      const userInfo = await this.findUserWithDetails({ id: userId });

      return { user: userInfo?.toJSON() };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Finds an active user by ID.
   * @param {string} id - The ID of the user.
   * @returns {Promise<User | null>} A promise that resolves to the user if found and active.
   */
  private async findActiveUser(id: string): Promise<User | null> {
    const user = await this.geoGeniusOrm?.sequelize.models.User.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found or is not active`);
    }

    return user as User;
  }

  /**
   * Finds friends based on the given status.
   * @param {string} userId - ID of the user.
   * @param {string} status - Status of the friendship.
   * @returns {Promise<UserFriends[]>} A promise that resolves to an array of user friends.
   */
  private async findFriends({
    status,
    userId,
  }: {
    userId: string;
    status: FRIEND_STATUS;
  }): Promise<UserFriends[]> {
    try {
      const friends =
        await this.geoGeniusOrm?.sequelize.models.UserFriends.findAll({
          attributes: {
            exclude: ["friendId", "deletedAt"],
          },
          include: [
            {
              as: "friend",
              attributes: {
                exclude: ["password", "socialMedia", "deletedAt", "isActive"],
              },
              model: this.geoGeniusOrm?.sequelize.models.User,
            },
          ],
          where: {
            status,
            userId,
          },
        });

      return friends as UserFriends[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetches aborted friends for a user.
   * @param {string} id - ID of the user.
   * @returns {Promise<UserFriends[]>} A promise that resolves to an array of aborted friends.
   */
  public async fetchAbortedFriends({
    id,
  }: {
    id: string;
  }): Promise<UserFriends[]> {
    try {
      const friends = await this.findFriends({
        status: FRIEND_STATUS.aborted,
        userId: id,
      });

      return friends;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetches pending friends for a user.
   * @param {string} id - ID of the user.
   * @returns {Promise<UserFriends[]>} A promise that resolves to an array of pending friends.
   */
  public async fetchPendingFriends({
    id,
  }: {
    id: string;
  }): Promise<UserFriends[]> {
    try {
      const friends = await this.findFriends({
        status: FRIEND_STATUS.pending,
        userId: id,
      });

      return friends;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Fetches accepted friends for a user.
   * @param {string} id - ID of the user.
   * @returns {Promise<UserFriends[]>} A promise that resolves to an array of accepted friends.
   */
  public async fetchAcceptedFriends({
    id,
  }: {
    id: string;
  }): Promise<UserFriends[]> {
    try {
      const friends = await this.findFriends({
        status: FRIEND_STATUS.accepted,
        userId: id,
      });

      return friends;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * accept or abort friendship relation for a user.
   * @param {string} userId - ID of the user.
   * @param {string} friendId - ID of the friend.
   * @param {string} status - FRIEND_STATUS of the friendship.
   * @returns {Promise<FriendResponseI>} A promise that resolves to a User info.
   */
  public async acceptOrAbortFriendship({
    friendId,
    status,
    userId,
  }: {
    userId: string;
    friendId: string;
    status: string;
  }): Promise<FriendResponseI> {
    try {
      await this.findActiveUser(userId);
      await this.findActiveUser(friendId);

      const userFriend =
        await this.geoGeniusOrm?.sequelize.models.UserFriends.findOne({
          where: {
            friendId,
            userId,
          },
        });

      if (!userFriend) {
        throw new NotFoundError(
          `There is no friendship between userId=${userId} & friendId=${userFriend}`
        );
      }

      await userFriend.update(
        { friendId, status, userId },
        { where: { friendId, userId } }
      );

      const userInfo = await this.findUserWithDetails({ id: userId });

      return { user: userInfo?.toJSON() };
    } catch (acceptOrAbortFriendshipError) {
      console.error(acceptOrAbortFriendshipError);
      throw acceptOrAbortFriendshipError;
    }
  }
}
