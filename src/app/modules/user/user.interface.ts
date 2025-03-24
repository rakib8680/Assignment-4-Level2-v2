import { Model } from "mongoose";

export type TUserRole = "admin" | "user";

export interface TUser {
  toObject(): unknown; // toObject method is used to make your mongoose document object to plain object so that you can delete any field after creating the document. You can also use toJSON method to achieve the same. Also without this you can actually delete any field from the document object.
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
