import { CustomError } from "../custom_error";

export class UnknownError extends CustomError {
  statusCode = 999;

  constructor() {
    super("UnknownError");
    Object.setPrototypeOf(this, UnknownError.prototype);
  }

  // eslint-disable-next-line class-methods-use-this
  serializeErrors() {
    return { message: "unknown error" };
  }
}
