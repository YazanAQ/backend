import dotenv from "dotenv";
import { expand } from "dotenv-expand";

import { ConfigI } from "../interfaces";

// Load environment variables from .env file
expand(dotenv.config());

/**
 * Database configuration object for different environments.
 */
const config: ConfigI = {
  /**
   * Production environment configuration.
   */
  development: {
    database: process.env.DB_NAME || "",
    dialect: "postgres",
    host: process.env.DB_HOST || "",
    password: process.env.DB_PASSWORD || "",
    pool: {
      acquire: 60000,
      idle: 10000,
      max: 20,
      min: 0,
    },
    port: parseInt(process.env.DB_PORT || "5432", 10),
    schema: process.env.GEO_DB_NAME || "",
    username: process.env.DB_USERNAME || "",
  },
  production: {
    database: process.env.DB_NAME || "",
    dialect: "postgres",
    host: process.env.DB_HOST || "",
    password: process.env.DB_PASSWORD || "",
    pool: {
      acquire: 60000,
      idle: 10000,
      max: 20,
      min: 0,
    },
    port: parseInt(process.env.DB_PORT || "5432", 10),
    schema: process.env.GEO_DB_NAME || "",
    username: process.env.DB_USERNAME || "",
  },
};

export { config };
