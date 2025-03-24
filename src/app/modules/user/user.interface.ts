import { Model } from "mongoose";

export type TUserRole = "admin" | "user";

export interface TUser {
  toObject(): unknown;
  _id?: string;
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
