import { Model } from "mongoose";
import { USER_ROLE_ENUM } from "./user.constant";

export type TUserRole = "admin" | "user";
export type TUserRoleEnum = keyof typeof USER_ROLE_ENUM;

export interface TUser {
  toObject(): unknown;
  username: string;
  email: string;
  password?: string;
  passwordChangedAt?: Date;
  role?: TUserRole;
}

// static methods
export interface StaticUserModel extends Model<TUser> {
  isUserExist(username: string): Promise<TUser>;
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
