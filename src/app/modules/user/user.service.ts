import AppError from "../../errors/AppError";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

//  create a user
const createUser = async (payload: TUser) => {
  // check if the user already exists
  if (await UserModel.isUserExist(payload.username)) {
    throw new AppError(400, "User already exists");
  }

  const result = await UserModel.create(payload);

  // delete password field from the result
  const userData = result.toObject();
  delete userData.password;
  return userData;
};

export const userServices = {
  createUser,
};
