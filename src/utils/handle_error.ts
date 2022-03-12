import { Request, Response, ErrorRequestHandler } from "express";
import { CustomError } from "./custom_error";
import { UnknownError } from "./error_class/unknown_error";

const handleError: ErrorRequestHandler = (
  err: TypeError | CustomError,
  _: Request,
  res: Response
) => {
  let customError = err;
  console.error(err);
  if (!(err instanceof CustomError)) {
    customError = new UnknownError();
  }
  res
    .status((customError as CustomError).statusCode)
    .send((customError as CustomError).serializeErrors());
};

export default handleError;
