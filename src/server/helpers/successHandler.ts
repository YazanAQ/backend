import { Response } from "express";

import SuccessResponse from "../helpers/SuccessResponse";

/**
 * Helper function to send a success response.
 * @param {*} data - The data to be included in the success response.
 * @param {string} message - The success message.
 * @param {Response} res - The HTTP response object.
 */
const handleGenericSuccessResponse = <T>(
  data: T,
  message: string,
  res: Response
): void => {
  res.json(new SuccessResponse<T>(data, message));
};

export { handleGenericSuccessResponse };
