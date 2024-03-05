import { JWTManager } from "./JWTManager";
import { Transaction } from "sequelize";

import { GeoGeniusOrm } from "../../database";
import User from "../../database/orm/models/user.model";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/Errors";
import {
  buildRegisterUser,
  comparePassword,
  hashPassword,
} from "../helpers/googleAuthCallbackHelpers";
import {
  AuthServiceInterface,
  BaseServiceArgsI,
  GoogleAuthCallbackArgsI,
  GoogleAuthCallbackResponseI,
  JWT_EXPIRES_IN,
  LoginArgsI,
  RegisterArgsI,
  SECRET_KEY_TYPE,
} from "../interfaces";

/**
 * Service class for handling CRUD operations related to users.
 */
export class AuthService implements AuthServiceInterface {
  /**
   * The ORM instance for database operations.
   */
  private readonly geoGeniusOrm?: GeoGeniusOrm;
  private readonly jwtManager: JWTManager;

  /**
   * Creates an instance of AuthService.
   * @param {BaseServiceArgsI} params - Parameters for initializing the service.
   * @param {GeoGeniusOrm} params.geoGeniusOrm - The ORM instance for database operations.
   */
  constructor({ geoGeniusOrm }: BaseServiceArgsI) {
    this.geoGeniusOrm = geoGeniusOrm;
    this.jwtManager = JWTManager.instance;
  }
  /**
   * Begins a transaction.
   * @returns {Promise<Transaction>} A promise resolving to the transaction object.
   */
  private async beginTransaction(): Promise<Transaction | undefined> {
    return await this.geoGeniusOrm?.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });
  }

  /**
   * Commits a transaction.
   * @param {Transaction} transaction - The transaction to commit.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  private async commitTransaction(transaction: Transaction): Promise<void> {
    return await transaction.commit();
  }

  /**
   * Rolls back a transaction.
   * @param {Transaction} transaction - The transaction to roll back.
   * @returns {Promise<void>} A promise indicating the success of the operation.
   */
  private async rollbackTransaction(transaction: Transaction): Promise<void> {
    return await transaction.rollback();
  }

  /**
   * Finds a user by email.
   * @param {string} email - The email to search for.
   * @param {string} isExcludePassowrd - The email to search for.
   * @param {string} isParanoid - The email to search for.
   * @param {Transaction} transaction - The transaction in which to perform the operation.
   * @returns {Promise<User | null>} A promise resolving to the user or null if not found.
   */
  private async findUserByEmail({
    email,
    isExcludePassowrd = true,
    isParanoid = true,
    transaction,
  }: {
    email: string;
    isExcludePassowrd?: boolean;
    isParanoid?: boolean;
    transaction?: Transaction;
  }): Promise<User | null> {
    return (await this.geoGeniusOrm?.models.User.findOne({
      // @TODO: define global scopes
      attributes: {
        exclude: isExcludePassowrd ? ["password"] : [],
      },
      paranoid: isParanoid,
      transaction,
      where: {
        email,
      },
    })) as User;
  }

  /**
   * Finds a user by email with associated details.
   * @param {string} email - The email to search for.
   * @param {Transaction} transaction - The transaction in which to perform the operation.
   * @returns {Promise<User>} A promise resolving to the user with associated details.
   */
  public async findUserByEmailWithDetails(
    email: string,
    transaction?: Transaction
  ): Promise<User> {
    return (await this.geoGeniusOrm?.sequelize.models.User.findOne({
      transaction,
      where: { email },
    })) as User;
  }

  /**
   * Create a new User or login by google account.
   * @param {GoogleAuthCallbackArgsI} authArgs - The User information.
   * @returns {Promise<any>} A promise that resolves to the created user.
   */
  public async googleAuthCallback({
    user,
  }: GoogleAuthCallbackArgsI): Promise<GoogleAuthCallbackResponseI> {
    const transaction = await this.beginTransaction();

    try {
      const existingUser = await this.findUserByEmail({
        email: user.email!,
        isParanoid: false,
        transaction,
      });

      if (existingUser) {
        if (!existingUser.isActive || existingUser.deletedAt !== null) {
          throw new UnauthorizedError(
            `Your account (${existingUser.email}) is not active please contact the adminstartor ...`
          );
        }

        await this.geoGeniusOrm?.models.User.update(
          {
            socialMedia: user.socialMedia,
            updatedAt: new Date(),
          },
          {
            transaction,
            where: {
              email: user.email,
            },
          }
        );

        const retrievedUser = await this.findUserByEmailWithDetails(
          user.email!,
          transaction!
        );

        const userToken = await this.jwtManager.generateJWT({
          payload: retrievedUser,
        });

        const userRefreshToken = await this.jwtManager.generateJWT({
          expiresIn: JWT_EXPIRES_IN["7d"],
          payload: retrievedUser,
          secretKeyType: SECRET_KEY_TYPE.refreshJwtSecretKey,
        });

        await this.commitTransaction(transaction!);

        return {
          refreshToken: userRefreshToken,
          token: userToken,
          user: existingUser,
        };
      }

      await this.geoGeniusOrm?.models.User.create(user, {
        transaction,
      });

      const retrievedUser = await this.findUserByEmailWithDetails(
        user.email!,
        transaction!
      );

      const userToken = await this.jwtManager.generateJWT({
        payload: retrievedUser,
      });

      const userRefreshToken = await this.jwtManager.generateJWT({
        expiresIn: JWT_EXPIRES_IN["7d"],
        payload: retrievedUser,
        secretKeyType: SECRET_KEY_TYPE.refreshJwtSecretKey,
      });

      await this.commitTransaction(transaction!);

      return {
        refreshToken: userRefreshToken,
        token: userToken,
        user: retrievedUser,
      };
    } catch (errorGoogleAuthCallback) {
      // Handle error
      await this.rollbackTransaction(transaction!);
      console.error("Error in authntication :", { errorGoogleAuthCallback });
      throw errorGoogleAuthCallback; // Rethrow the error
    }
  }

  /**
   * Create a new User.
   * @param {GoogleAuthCallbackArgsI} authArgs - The User information.
   * @returns {Promise<any>} A promise that resolves to the created user.
   */
  public async register({
    user,
  }: RegisterArgsI): Promise<GoogleAuthCallbackResponseI> {
    const transaction = await this.beginTransaction();

    try {
      const existingUser = await this.findUserByEmail({
        email: user.email!,
        isParanoid: false,
        transaction,
      });

      if (existingUser) {
        throw new ConflictError(
          `Your account (${existingUser.email}) is alreaady exists. please try to login ...`
        );
      }

      await this.geoGeniusOrm?.models.User.create(
        await buildRegisterUser({
          user: { ...user, password: await hashPassword(user.password!) },
        }),
        {
          transaction,
        }
      );

      const retrievedUser = await this.findUserByEmail({
        email: user.email!,
        isExcludePassowrd: true,
        isParanoid: false,
        transaction,
      });

      const userToken = await this.jwtManager.generateJWT({
        payload: retrievedUser,
      });
      const userRefreshToken = await this.jwtManager.generateJWT({
        expiresIn: JWT_EXPIRES_IN["7d"],
        payload: retrievedUser,
        secretKeyType: SECRET_KEY_TYPE.refreshJwtSecretKey,
      });

      await this.commitTransaction(transaction!);

      return {
        refreshToken: userRefreshToken,
        token: userToken,
        user: retrievedUser!,
      };
    } catch (errorRegister) {
      // Handle error
      await this.rollbackTransaction(transaction!);
      console.error("Error in register:", { errorRegister });
      throw errorRegister; // Rethrow the error
    }
  }

  /**
   * Login.
   * @param {LoginArgsI} user - The User information.
   * @returns {Promise<any>} A promise that resolves to the created user.
   */
  public async login({
    email,
    password,
  }: LoginArgsI): Promise<GoogleAuthCallbackResponseI> {
    const transaction = await this.beginTransaction();

    try {
      const existingUser = await this.findUserByEmail({
        email,
        isExcludePassowrd: false,
        isParanoid: false,
        transaction,
      });

      if (!existingUser) {
        throw new NotFoundError(
          `Your account (${email}) does not exists. please try to register ...`
        );
      }

      if (
        !existingUser ||
        !existingUser?.isActive ||
        existingUser.deletedAt !== null
      ) {
        throw new UnauthorizedError(
          `Your account (${existingUser?.email}) is not active please contact the adminstartor ...`
        );
      }

      if (existingUser && !existingUser.password) {
        throw new BadRequestError(
          `You were registered using social media(Google). please log in using social media (google) `
        );
      }

      const isValidPassword = await comparePassword(
        password,
        existingUser.password
      );

      if (!isValidPassword) {
        throw new BadRequestError(
          `email: (${existingUser.email}) or password is incorrect. Please try again.`
        );
      }

      const retrievedUser = await this.findUserByEmail({
        email,
        transaction,
      });

      const userToken = await this.jwtManager.generateJWT({
        payload: retrievedUser,
      });
      const userRefreshToken = await this.jwtManager.generateJWT({
        expiresIn: JWT_EXPIRES_IN["7d"],
        payload: retrievedUser,
        secretKeyType: SECRET_KEY_TYPE.refreshJwtSecretKey,
      });

      await this.commitTransaction(transaction!);

      return {
        refreshToken: userRefreshToken,
        token: userToken,
        user: retrievedUser!,
      };
    } catch (errorLogin) {
      // Handle error
      await this.rollbackTransaction(transaction!);
      console.error("Error in login:", { errorLogin });
      throw errorLogin; // Rethrow the error
    }
  }
}
