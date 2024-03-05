import { IOrmOptions } from "./interfaces";
import { Sequelize } from "sequelize-typescript";
/**
 * Abstract class for managing Sequelize ORM instance.
 * @template T - The type of models associated with the ORM.
 */
export abstract class AbstractGeoGeniusOrm<T> {
  /**
   * Singleton instance of the AbstractGeoGeniusOrm.
   * @private
   * @static
   */
  private static instance: AbstractGeoGeniusOrm<any> | null = null;

  /**
   * The Sequelize instance for managing the database connection.
   * @private
   */
  private _sequelize: Sequelize;

  /**
   * Constructs the AbstractGeoGeniusOrm instance.
   * @param {IOrmOptions} config - Configuration options for the ORM.
   */
  constructor(private readonly config: IOrmOptions) {
    if (!AbstractGeoGeniusOrm.instance) {
      AbstractGeoGeniusOrm.instance = this;
      this.initialize();
    }
  }

  /**
   * Initializes the Sequelize instance and authenticates the connection.
   * @private
   */
  private async initialize() {
    if (!this.config) {
      const errMessage = "ORM configuration required.";
      console.error(errMessage);
      throw new Error(errMessage);
    }

    console.info("Initializing Sequelize...");
    // Create primary Sequelize instance and reference for outside usage
    this._sequelize = new Sequelize({
      dialect: "postgres",
      pool: {
        idle: 10000,
        max: 10,
        min: 0,
      },
      ...this.config,
    });

    // Authenticate the connection
    console.info("Authenticating the database connection...");

    try {
      await this._sequelize.authenticate();
      console.info("Database connection authenticated successfully.");
    } catch (error) {
      console.error("Database connection authentication failed:", error);
      throw error;
    }
  }

  /**
   * Gets the Sequelize instance.
   * @throws {Error} Throws an error if Sequelize is not initialized.
   * @returns {Sequelize} The Sequelize instance.
   */
  public get sequelize(): Sequelize {
    if (!this._sequelize) {
      console.error("Sequelize is not initialized.");
      throw new Error("Sequelize is not initialized.");
    }

    return this._sequelize;
  }

  /**
   * Gets the models associated with the Sequelize instance.
   * @returns {T} The models associated with the Sequelize instance.
   */
  public get models() {
    return this.sequelize.models as unknown as T;
  }

  /**
   * Closes the database connection.
   * @async
   */
  public async close() {
    if (this.sequelize) {
      console.info(
        `Closing DB connection for schema ${this.config.database}...`
      );
      await this.sequelize.close();
      console.info(
        `DB connection closed successfully for schema ${this.config.database}.`
      );
    }
  }
}
