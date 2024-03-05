import oAuthRoutes from "./auth.route";
import { Express } from "express";

import { BASE_URL } from "../constants";
import { InternalServerError } from "../helpers/Errors";

/**
 * Route registrar for handling the registration of various routes.
 *
 * @interface RouteRegistrarI
 */
interface RouteRegistrarI {
  register: (app: Express) => void;
}

/**
 * Implementation of the RouteRegistrarI interface for route registration.
 *
 * @const routes
 */
const routes: RouteRegistrarI = {
  /**
   * Registers various routes with the Express app.
   *
   * @method register
   * @param {Express} app - Express application instance.
   * @returns {Promise<void>}
   */
  register: (app: Express): void => {
    try {
      const path = `${process.env?.BASE_URL ?? BASE_URL}`;
      app.use(path, oAuthRoutes);
    } catch (error: any) {
      console.error("Error during route registration:", error);
      throw new InternalServerError(error);
    }
  },
};

export default routes;
