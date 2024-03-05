/**
 * Represents a success response with data, message, and status code.
 */
class SuccessResponse<T> {
  /**
   * Create a new instance of SuccessResponse.
   * @param {*} data - The data to include in the response.
   * @param {string} [message='Success'] - The success message.
   * @param {number} [status=200] - The HTTP status code of the response.
   */
  constructor(
    public data: T,
    public message: string = "Success",
    public status: number = 200
  ) {}

  /**
   * Convert the SuccessResponse object to a JSON representation.
   * @returns {Object} - The JSON representation of the success response.
   */
  toJSON(): { success: boolean; data: T; message: string } {
    return {
      data: this.data,
      message: this.message,
      success: true,
    };
  }
}

export default SuccessResponse;
