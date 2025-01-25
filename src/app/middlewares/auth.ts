import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import {
  isJwtIssuedBeforePasswordChange,
  verifyJwtToken,
} from "../modules/auth/auth.utils";
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
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    // const decodedData = verifyJwtToken(token, config.jwtSecret as string);

    const { role, username, iat } = decodedData as JwtPayload;

    // check if user exist
    const user = username && (await UserModel.isUserExist(username));
    if (!user) {
      throw new AppError(status.NOT_FOUND, "User does not exist");
    }

    // check if password has been changed after token was issued
    if (
      isJwtIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
    ) {
      throw new AppError(
        status.UNAUTHORIZED,
        "Password has been changed recently, please login again"
      );
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
