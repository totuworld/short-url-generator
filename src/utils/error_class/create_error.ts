import { CustomError } from "../custom_error";

export class CreateError extends CustomError {
  statusCode = 500;

  constructor(public errorMessage: string) {
    super("create error");
    Object.setPrototypeOf(this, CreateError.prototype);
  }

  serializeErrors() {
    return { message: this.errorMessage };
  }
}
