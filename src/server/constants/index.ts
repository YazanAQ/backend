import { CorsOptions, CorsOptionsDelegate } from "cors";

import { getEnv } from "../../database";
import { UnauthorizedError } from "../helpers/Errors";
import { GenericObjectI, SECRET_KEY_TYPE } from "../interfaces";

/**
 * HTTP status codes used in the application.
 * @enum {number}
 */
const HTTP_STATUS_CODES: GenericObjectI = {
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
  NOT_FOUND: 404,
  OK: 200,
  UNAUTHORIZED: 401,
};

const BASE_URL = "/api/v1";

const ALLOWED_ORIGINS_PATTERN =
  /^(https:\/\/staging-ui\.GeoGenius\.ai\/?|http:\/\/localhost\/?)/;

const CORS_OPTIONS: CorsOptions | CorsOptionsDelegate = {
  allowedHeaders: ["Content-Type"],
  credentials: true,
  methods: "DELETE, GET, POST, PUT",
  optionsSuccessStatus: 204,
  origin: (origin: string, callback: CallableFunction) => {
    if (ALLOWED_ORIGINS_PATTERN.test(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new UnauthorizedError("Not allowed by CORS"));
    }
  },
} as unknown as CorsOptionsDelegate;

const SECRET_KEY_VALUES: { [key in SECRET_KEY_TYPE]: string } = {
  [SECRET_KEY_TYPE.jwtSecretKey]: getEnv("JWT_SECRET_KEY"),
  [SECRET_KEY_TYPE.refreshJwtSecretKey]: getEnv("REFRESH_SECRET_KEY"),
};

enum AUTH_COOKIES {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
}

export {
  ALLOWED_ORIGINS_PATTERN,
  AUTH_COOKIES,
  BASE_URL,
  CORS_OPTIONS,
  HTTP_STATUS_CODES,
  SECRET_KEY_VALUES,
};
