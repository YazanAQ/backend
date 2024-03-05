import { QueryInterface } from "sequelize/types";
import { SequelizeOptions } from "sequelize-typescript";

// Common options for the ORM
export interface IOrmOptions extends SequelizeOptions {
  databaseVersion?: string;
  schema?: string;
  searchPath?: string;
}

// Extended options including Sequelize specific options and model paths
export interface IOrmModelOptions extends IOrmOptions, SequelizeOptions {
  models: string[];
}

// Interface defining dialect options
export interface IDialect {
  [key: string]: boolean | Buffer | string | object;
}

// Context for migrations, including the query interface
export interface IMigrationContext {
  context: QueryInterface;
}

// Options for running migrations
export interface IMigrateOptions {
  ormOptions: IOrmOptions;
  migrationsPath: string;
}
