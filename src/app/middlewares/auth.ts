import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyJwtToken } from "../modules/auth/auth.utils";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { TUserRoleEnum } from "../modules/user/user.interface";
import { UserModel } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRoleEnum[]) => {
  return catchAsync(async (req, res, next) => {
    //get token from client
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorize access");
    }

    // verify token
    let decodedData;
    try {
      decodedData = verifyJwtToken(token, config.jwtSecret as string);
    } catch (error) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorize access");
    }

    const { role, username } = decodedData as JwtPayload;

    // check if user exist
    if (username && !(await UserModel.isUserExist(username))) {
      throw new AppError(status.NOT_FOUND, "User does not exist");
    }

    // check if user has the required role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        status.FORBIDDEN,
        "You are not allowed to access this route"
      );
    }

    req.user = decodedData as JwtPayload;

    next();
  });
};

export default auth;
