import { CONFIG } from "src/config";
import type { Static } from "@sinclair/typebox";
import { t } from "elysia";

export class BadRequestError extends Error {
  code: string = "BAD REQUEST";
  status: number = 400;
  constructor(message: string = "Invalid input") {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  code: string = "UNAUTHORIZED";
  status: number = 401;
  constructor(message: string = "Invalid authentication") {
    const m = CONFIG.env === "PROD" ? "Invalid authentication" : message;
    super(m);
  }
}

export class InsufficientPermissionError extends Error {
  code: string = "FORBIDDEN";
  status: number = 403;
  constructor(message: string = "Insufficient permission") {
    const m = CONFIG.env === "PROD" ? "Insufficient permission" : message;
    super(m);
  }
}

export const ResponseBodySchema = t.Object({
  status: t.Integer(),
  code: t.Optional(t.String()),
  message: t.Optional(t.String()),
});

export type ResponseBody = Static<typeof ResponseBodySchema>;

export const ErrorResponseSchema = t.Object({
  status: t.Integer(),
  code: t.String(),
  message: t.Optional(t.String()),
  error: t.Optional(t.Any()),
});

export type ErrorResponse = Static<typeof ErrorResponseSchema>;
