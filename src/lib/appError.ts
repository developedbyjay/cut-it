import { NextFunction, Request, Response } from "express";

class AppError extends Error {
  public isOperational: boolean;
  public status: string;
  public code?: number | string;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = message;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync =
  <P>(
    fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

export { AppError, catchAsync };
