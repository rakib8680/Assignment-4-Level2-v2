import status from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import bcrypt from "bcrypt";

// login user
const loginUser = async (payload: TUserLogin) => {
  // check if user exists
  const user = await UserModel.findOne({ username: payload.username }).select(
    "_id username email role password"
  );
  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  };


  // check if password is correct
  const isPasswordMatched =await  bcrypt.compare(payload.password, user.password as string);
  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Invalid password");
  };


  return user;
};

export const authServices = {
  loginUser,
};
