import status from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TUserLogin } from "./auth.interface";

// login user
const loginUser = async (payload: TUserLogin) => {
  // check if user exists
  const result = await UserModel.findOne({ username: payload.username }).select(
    "_id username email role"
  );
  if (!result) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return result;
};

export const authServices = {
  loginUser,
};
