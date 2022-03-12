import { CustomError } from "../custom_error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public errorMessage: string) {
    super("bad request");
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return { message: this.errorMessage };
  }
}
