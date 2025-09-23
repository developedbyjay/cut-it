import { Types } from "mongoose";
import type { IUser } from "../models/user";

export type UserRequestBody = Pick<
  IUser,
  "name" | "email" | "password" | "role"
>;
export type UserLoginRequestBody = Pick<IUser, "email" | "password">;
export type PasswordResetRequestBody = Pick<IUser, "email">;

export type TokenPayload = {
  userId: Types.ObjectId;
};

export type ResetLinkPayload = {
  email: string;
};
