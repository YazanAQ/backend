import { Response } from "express";

import { getEnv } from "../../database";
import { AUTH_COOKIES } from "../constants";

export const addAuthCookie = (
  { refreshToken, token }: { token: string; refreshToken?: string },
  res: Response
) => {
  const apiUrl = getEnv("API_URL");
  const isProduction = process.env.NODE_ENV === "production";

  let validDomain = "";

  if (apiUrl.includes("localhost")) {
    validDomain = ".localhost";
  } else {
    const parts = apiUrl.split(".");
    validDomain = parts.length ? `.${parts.slice(-2).join(".")}` : "";
  }

  const cookieOptions = {
    domain: validDomain,
    httpOnly: true,
    sameSite: "none",
    secure: apiUrl.includes("localhost") ? true : isProduction,
  };

  res.cookie(AUTH_COOKIES.accessToken, token, cookieOptions as any);

  if (refreshToken) {
    res.cookie(AUTH_COOKIES.refreshToken, refreshToken, cookieOptions as any);
  }
};
