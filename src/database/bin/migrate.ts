import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import path from "path";

import { getEnv, getIntEnv } from "../lib";
import { migrate } from "../migrate";
// Immediately-invoked Function Expression (IIFE) to encapsulate the script
import { IOrmOptions } from "../orm";

(async () => {
  expand(dotenv.config());

  // Database connection options
  const ormOptions: IOrmOptions = {
    database: getEnv("DB_NAME"),
    databaseVersion: "11.2.0",
    dialect: "postgres",
    host: getEnv("DB_HOST"),
    password: getEnv("DB_PASSWORD"),
    pool: getEnv("DB_POOL")
      ? JSON.parse(getEnv("DB_POOL", "{}"))
      : {
          acquire: 1000000,
          idle: 200000,
          max: 100,
          min: 0,
        },
    port: getIntEnv("DB_PORT"),
    schema: getEnv("GEO_DB_NAME"),
    searchPath: getEnv("DB_NAME"),
    username: getEnv("DB_USER"),
  };

  const migrationsPath = path.join(__dirname, "..", "migrations");

  try {
    console.log(ormOptions);
    // Run database migrations
    await migrate({ migrationsPath, ormOptions });
    console.log("Database migration completed successfully.");
    process.exit(0);
  } catch (err) {
    // Handle migration errors
    console.error("Error during database migration:", err);
    process.exit(1);
  }
})();
