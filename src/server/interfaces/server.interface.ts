import { AuthServiceInterface } from "./auth.interface";
import { Request } from "express";

import { GeoGeniusOrm } from "../../database";
import User from "../../database/orm/models/user.model";

/**
 * Define a type for the shared context in the application.
 */
export interface SharedContextI {
  geoGeniusOrm: GeoGeniusOrm; // An instance of the GeoGeniusOrm class
}

/**
 * Database configuration interface for different environments.
 */
export interface DatabaseConfigI {
  database: string;
  dialect: string;
  host: string;
  password: string;
  port: number;
  schema: string;
  username: string;
  pool?: {
    acquire: number;
    idle: number;
    max: number;
    min: number;
  };
}

/**
 * Configuration object for different environments.
 */
export interface ConfigI {
  /**
   * Production environment configuration.
   */
  production: DatabaseConfigI;
  development: DatabaseConfigI;
}

/**
 * Interface representing the properties of a CustomError instance.
 */
export interface CustomErrorOptionsI {
  description: string;
  isOperational: boolean;
  name: string;
  statusCode: number;
}

/**
 * Represents a request with shared context in the application.
 */
export interface ReqWithSharedContextI extends Request {
  sharedContext?: SharedContextI;
  params: {
    [key: string]: string;
  };
}

/**
 * Represents an OAuth client in the application.
 */
export interface OAuthClientI {
  clientId: string;
  clientSecret: string;
  id: string;
  name: string;
}

/**
 * Represents an authorized request in the application.
 */
export type AuthorizedRequest = Request & {
  headers: { authorization: string };
  clientId: string;
  user: Partial<User>;
};

export interface ServicesI {
  authService: AuthServiceInterface;
}

export interface GenericApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Represents a request with user schema information in the application.
 */
export interface ReqWithUserSchemaI extends Request {
  userSchema?: GeoGeniusOrm;
  params: {
    [key: string]: string;
  };
  headers: {
    [key: string]: string;
  };
  services?: ServicesI;
  sharedContext?: SharedContextI;
  user: Partial<User>;
}

export interface BaseServiceArgsI {
  geoGeniusOrm: GeoGeniusOrm;
}

export interface GenericObjectI {
  [key: string]: any;
}
