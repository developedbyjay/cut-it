import { Types } from "mongoose";
import type { IUser } from "../models/user";
import type { ILink } from "../models/link";

export type UserRequestBody = Pick<
  IUser,
  "name" | "email" | "password" | "role"
>;

export type UserUpdateBody = Partial<
  Pick<UserRequestBody, "name" | "email"> & {
    newPassword: string;
    currentPassword: string;
  }
>;

export type Role = "user" | "admin";
export type UserLoginRequestBody = Pick<IUser, "email" | "password">;
export type PasswordResetRequestBody = Pick<IUser, "email">;
export type RequestQuery = { token: string };
export type RequestBody = Pick<IUser, "password">;

export type TemplateParams = { [key: string]: string | number };

export type TokenPayload = {
  userId: Types.ObjectId;
};

export type ResetLinkPayload = {
  email: string;
};

export type LinkRequestBody = Pick<ILink, "title" | "destination" | "backHalf">;

export type RequestQueryLinks = {
  search?: string;
  sortby?: string;
  filter?: string;
  offset?: number;
  limit?: number;
};

export type LinkField =
  | "title"
  | "destination"
  | "backHalf"
  | "clicks"
  | "createdAt"
  | "updatedAt";

export type GetLinkProps = {
  baseUrl: string;
  search?: string;
  sortby?: string;
  offset: number;
  limit: number;
  total: number;
};
