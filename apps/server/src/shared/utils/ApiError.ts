import { TRPCError } from "@trpc/server";

export class NotFoundError extends TRPCError {
  constructor(message = "Resource not found") {
    super({
      code: "NOT_FOUND",
      message,
    });
  }
}

export class UnauthorizedError extends TRPCError {
  constructor(message = "Unauthorized") {
    super({
      code: "UNAUTHORIZED",
      message,
    });
  }
}

export class BadRequestError extends TRPCError {
  constructor(message = "Bad request") {
    super({
      code: "BAD_REQUEST",
      message,
    });
  }
}
export class InternalServerError extends TRPCError {
  constructor(message = "Internal server error") {
    super({
      code: "INTERNAL_SERVER_ERROR",
      message,
    });
  }
}