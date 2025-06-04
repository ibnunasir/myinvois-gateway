import Elysia, {
  InternalServerError,
  InvalidCookieSignature,
  NotFoundError,
  ParseError,
  ValidationError,
} from "elysia";
import type { ErrorResponse } from "src/types";
import {
  BadRequestError,
  InsufficientPermissionError,
  UnauthorizedError,
} from "src/types";

function findDeepestError(error: any): any {
  // Dive into nested union errors if available
  if (error.errors && Array.isArray(error.errors)) {
    for (const err of error.errors) {
      const nestedError = err.First?.();
      if (nestedError) return findDeepestError(nestedError);
    }
  }
  return error;
}

export const errorHandler = new Elysia().onError((ctx) => {
  const { error, set } = ctx;

  let message: string = "Internal Server Error";
  let status: number = 500; // Default status code
  let code: string = "INTERNAL_SERVER_ERROR"; // Default code

  if (error instanceof ValidationError) {
    message = error.message;
    status = 400;
    code = "VALIDATION_ERROR";

    const errorValue = error.validator.Errors(error.value).First();

    if (errorValue) {
      const rootCause = findDeepestError(errorValue);

      if (rootCause?.path) {
        const path = rootCause.path.replace(/^\//, "").replace(/\//g, ".");
        message = `Validation failed at '${path}': ${rootCause.message}`;
      } else {
        message = rootCause.message ?? message;
      }
    }
  } else if (error instanceof NotFoundError) {
    message = error.message;
    status = 404;
    code = "NOT_FOUND";
  } else if (error instanceof ParseError) {
    message = error.message;
    status = 400;
    code = "PARSE_ERROR";
  } else if (error instanceof InternalServerError) {
    message = error.message;
    status = 500;
    code = "INTERNAL_SERVER_ERROR";
  } else if (error instanceof InvalidCookieSignature) {
    message = "Invalid cookie signature";
    status = 400;
    code = "INVALID_COOKIE_SIGNATURE";
  } else if (error instanceof UnauthorizedError) {
    message = error.message;
    status = 401;
    code = "UNAUTHORIZED";
  } else if (error instanceof InsufficientPermissionError) {
    message = error.message;
    status = 403;
    code = "INSUFFICIENT_PERMISSION";
  } else if (error instanceof BadRequestError) {
    message = error.message;
    status = 400;
    code = "BAD_REQUEST";
  } else if (error instanceof Error) {
    message = error.message;
    status = 500;
    code = "ERROR";
  } else {
    message = "Internal Server Error";
    status = 500;
    code = "INTERNAL_SERVER_ERROR";
  }

  set.status = status;

  const response: ErrorResponse = {
    message: message,
    status: status,
    code: code,
  };

  return response;
});
