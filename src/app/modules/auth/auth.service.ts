import status from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import { createJwtToken, isPasswordMatched } from "./auth.utils";
import { JwtPayload } from "jsonwebtoken";

type TChangePassPayload = {
  currentPassword: string;
  newPassword: string;
};

// login user
const loginUser = async (payload: TUserLogin) => {
  // check if user exists
  const user = await UserModel.findOne({ username: payload.username }).select(
    "_id username email role password"
  );
  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  // check if password is correct
  if (!(await isPasswordMatched(payload.password, user.password as string))) {
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
  const userObject = user?.toObject();
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
  const user = await UserModel.findById(userData._id);
  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }



  // check if current password is correct
  if (
    !(await isPasswordMatched(payload.currentPassword, user.password as string))
  ) {
    throw new AppError(status.UNAUTHORIZED, "Incorrect password");
  }


  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcryptSalt)
  );


  // update the password
  const updatedUser = await UserModel.findByIdAndUpdate(
    user._id,
    {
      password: newHashedPassword,
    },
    { new: true }).select("_id username email role");


};

export const authServices = {
  loginUser,
};
