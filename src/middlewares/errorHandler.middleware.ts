import type { Request, Response, NextFunction } from "express";

type HttpError = Error & { status?: number; statusCode?: number };

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err.status ?? err.statusCode ?? 500;
  const isServerError = status >= 500;

  if (isServerError) {
    console.error(err);
  }

  res.status(status).json({
    code: isServerError ? "ServerError" : "RequestError",
    message: isServerError ? "Internal Server Error" : err.message,
  });
}
