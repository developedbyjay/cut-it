import { Request, Response, NextFunction } from "express";
import { AppError } from "@/lib/appError";
import { logger } from "@/lib/winston";

const ENVIRONMENT = process.env.NODE_ENV || "development";

const handleBadDecrypt = (error: any) => {
  const message = `Decryption failed. ${error.message}`;
  return new AppError(message, 400);
}

const handleCastErrorDB = (error: any) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err?.errorResponse?.errmsg?.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate Field Value: ${value[0]} Kindly use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error: any) => {
  const errors = Object.values(error.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token, Please login again.", 401);

const handleExpiredToken = () =>
  new AppError("Token Expired,Login again.", 401);

const sendErrorDev = (
  err: AppError,
  res: Response
): Response<any, Record<string, any>> => {
  return res.status(err.statusCode || 500).json({
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (
  err: AppError,
  res: Response
): Response<any, Record<string, any>> => {
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    logger.error(`Error, ${err}`);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

export default (error: AppError, res: Response) => {
  // if (ENVIRONMENT === "development") {
  //   sendErrorDev(error, res);
  // } else {
  if (error.name === "CastError") error = handleCastErrorDB(error);

  if (error.code === "ERR_OSSL_BAD_DECRYPT") error = handleBadDecrypt(error);

  if (error.code === 11000) error = handleDuplicateFieldsDB(error);

  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleExpiredToken();
  sendErrorProd(error, res);
  // }
};
