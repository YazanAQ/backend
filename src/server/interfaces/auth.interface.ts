import { Transaction } from "sequelize";

import User from "../../database/orm/models/user.model";

interface GoogleAuthCallbackArgsI {
  user: Partial<User>;
}

interface RegisterArgsI {
  user: Partial<User & { name: string; deviceId: string }>;
}

interface LoginArgsI {
  email: string;
  password: string;
}

interface GoogleAuthCallbackResponseI {
  user?: Partial<User>;
  token: string;
  refreshToken: string;
}

interface RefreshAccessTokenI {
  accessToken: string;
}

interface AuthServiceInterface {
  googleAuthCallback(
    authArgs: GoogleAuthCallbackArgsI
  ): Promise<GoogleAuthCallbackResponseI>;
  register(authArgs: RegisterArgsI): Promise<GoogleAuthCallbackResponseI>;
  login(authArgs: LoginArgsI): Promise<GoogleAuthCallbackResponseI>;
  findUserByEmailWithDetails(
    email: string,
    transaction?: Transaction
  ): Promise<User>;
}

enum SECRET_KEY_TYPE {
  "jwtSecretKey" = "jwtSecretKey",
  "refreshJwtSecretKey" = "refreshJwtSecretKey",
}

enum JWT_EXPIRES_IN {
  "1h" = "1h",
  "7d" = "7d",
}

export {
  AuthServiceInterface,
  GoogleAuthCallbackArgsI,
  GoogleAuthCallbackResponseI,
  JWT_EXPIRES_IN,
  LoginArgsI,
  RefreshAccessTokenI,
  RegisterArgsI,
  SECRET_KEY_TYPE,
};
