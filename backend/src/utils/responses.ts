import type { Response } from "express";

export function successResponse(
  res: Response,
  data: unknown,
  statusCode: number = 200,
) {
  res.status(statusCode).send({ success: true, data });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
) {
  res.status(statusCode).send({ success: false, data: { message } });
}
