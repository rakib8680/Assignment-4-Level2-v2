import status from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import { createJwtToken } from "./auth.utils";
import { JwtPayload } from "jsonwebtoken";

type TChangePassPayload = {
  currentPassword: string;
  newPassword: string;
};

// login user
const loginUser = async (payload: TUserLogin) => {
  // check if user exists
  const user = await UserModel.isUserExist(payload.username);
  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  // check if password is correct
  if (
    !(await UserModel.isPasswordMatched(
      payload.password,
      user.password
    ))
  ) {
    throw new AppError(status.UNAUTHORIZED, "Incorrect password");
  }

  // create jwt token
  const jwtPayload = {
    _id: user._id,
    username: user.username,
    role: user.role,
  };
  const accessToken = createJwtToken(
    jwtPayload,
    config.jwtSecret as string,
    config.jwtExpiresIn as string
  );

  // remove user password from user object
  const userObject: any = user?.toObject();
  delete userObject.password;

  return {
    userObject,
    accessToken,
  };
};

// change password
const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassPayload
) => {
  // check if user exists
  const user = await UserModel.isUserExist(userData.username);
  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  // check if current password is correct
  if (
    !(await UserModel.isPasswordMatched(
      payload.currentPassword,
      user.password as string
    ))
  ) {
    throw new AppError(status.UNAUTHORIZED, "Incorrect current password");
  }

  // check if new password is the same as the current password
  if (payload.currentPassword === payload.newPassword) {
    throw new AppError(
      status.BAD_REQUEST,
      "New password cannot be the same as the current password"
    );
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcryptSalt)
  );

  // update the password
  const updatedUser = await UserModel.findOneAndUpdate(
    { username: userData.username },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true }
  ).select("_id username email role");

  return updatedUser;
};

export const authServices = {
  loginUser,
  changePassword,
};
