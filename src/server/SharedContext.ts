import getDbConnectionConfig from "./helpers/getDbConnectionConfig";
import { SharedContextI } from "./interfaces";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

import { GeoGeniusOrm } from "../database";

expand(dotenv.config());

/**
 * Represents the shared context for the application.
 * Manages the initialization and provides access to shared resources.
 *
 * @class SharedContext
 * @implements SharedContextI
 */
class SharedContext implements SharedContextI {
  private static _instance: SharedContextI;
  private _geoGeniusOrm: GeoGeniusOrm;

  /**
   * Private constructor to enforce singleton pattern and initialize shared resources.
   */
  private constructor() {
    this.initialize();
  }

  /**
   * Initializes shared resources like GeoGeniusOrm and multi-user publisher.
   *
   * @private
   * @memberof SharedContext
   */
  private initialize(): void {
    try {
      this._geoGeniusOrm = new GeoGeniusOrm(getDbConnectionConfig());
      console.info(
        "::GEO_GENIUS_API:: Initialized nessceary connections successfully"
      );
    } catch (error) {
      console.error(
        "::GEO_GENIUS_API:: Unable to initialize connections to GCP:",
        error
      );
      throw error;
    }
  }

  /**
   * Gets the instance of SharedContext, following the singleton pattern.
   *
   * @static
   * @readonly
   * @memberof SharedContext
   */
  public static get instance(): SharedContextI {
    if (!SharedContext._instance) {
      SharedContext._instance = new SharedContext();
    }

    return SharedContext._instance;
  }

  /**
   * Setter for GeoGeniusOrm instance.
   *
   * @memberof SharedContext
   */
  set geoGeniusOrm(geoGeniusOrm: GeoGeniusOrm) {
    this._geoGeniusOrm = geoGeniusOrm;
  }

  /**
   * Getter for GeoGeniusOrm instance.
   *
   * @memberof SharedContext
   */
  get geoGeniusOrm(): GeoGeniusOrm {
    return this._geoGeniusOrm;
  }
}

export default SharedContext.instance;
