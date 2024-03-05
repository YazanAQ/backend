import dotenv from "dotenv";
import { expand } from "dotenv-expand";

// Load environment variables from .env file
expand(dotenv.config());

/**
 * Get integer value from environment variable.
 * @param variableName - The name of the environment variable.
 * @param defaultValue - Default value if the variable is not set or not a valid integer.
 * @returns The integer value.
 */
export const getIntEnv = (
  variableName: string,
  defaultValue?: number
): number => {
  const envValue = process.env[variableName];

  if (envValue !== undefined) {
    const parsedValue = parseInt(envValue, 10);

    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else if (defaultValue !== undefined && !isNaN(defaultValue)) {
      return defaultValue;
    }
  }

  return 0;
};

/**
 * Get boolean value from environment variable.
 * @param variableName - The name of the environment variable.
 * @param defaultValue - Default value if the variable is not set or not a valid boolean.
 * @returns The boolean value.
 */
export const getBoolEnv = (
  variableName: string,
  defaultValue?: boolean
): boolean => {
  const envValue = process.env[variableName];

  if (envValue !== undefined) {
    const lowercasedValue = envValue.toLowerCase();

    if (["true", "1", "yes"].includes(lowercasedValue)) {
      return true;
    } else if (["false", "0", "no"].includes(lowercasedValue)) {
      return false;
    }
  } else if (defaultValue !== undefined) {
    return !!defaultValue;
  }

  return false;
};

/**
 * Get string value from environment variable.
 * @param variableName - The name of the environment variable.
 * @param defaultValue - Default value if the variable is not set.
 * @returns The string value.
 */
export const getEnv = (variableName: string, defaultValue?: string): string => {
  const envValue = process.env[variableName];

  if (envValue !== undefined) {
    return envValue;
  } else if (defaultValue !== undefined) {
    return defaultValue;
  }

  return "";
};
