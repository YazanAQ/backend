import Umzug from "umzug";

import { GeoGeniusOrm, IMigrateOptions } from "../orm";

/**
 * Run database migrations using Umzug.
 * @param options - Migration options including migrations path and ORM options.
 */
export const migrate = async (options: IMigrateOptions) => {
  const { migrationsPath, ormOptions } = options;

  // Create instance of GeoGenius Orm
  const { sequelize } = new GeoGeniusOrm(ormOptions);
  const schema = ormOptions.schema as string;

  try {
    // Ensure schema exists
    console.info(`Ensuring schema ${schema} exists...`);
    await sequelize.query(
      `set search_path = ${schema},public; CREATE SCHEMA IF NOT EXISTS ${schema};`,
      {
        logging: console.info,
      }
    );
    console.info(`Schema ${schema} exists.`);

    // Initialize Umzug instance for running migrations
    const umzug = new Umzug({
      migrations: {
        params: [sequelize.getQueryInterface()],
        path: migrationsPath,
      },
      storage: "sequelize",
      storageOptions: { sequelize },
    });

    // Run migrations
    console.info(`Running migrations...`);
    await umzug.up();
    console.info(`Migrations complete.`);
  } catch (err: unknown) {
    console.info(`Error in Migrations ${err}`);
    throw err;
  }
};
