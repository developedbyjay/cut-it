import type { IUser } from "./models/user";

export type UserRequestBody = Pick<
  IUser,
  "name" | "email" | "password" | "role"
>;
export type UserLoginRequestBody = Pick<IUser, "email" | "password">;
export type PasswordResetRequestBody = Pick<IUser, "email">;
