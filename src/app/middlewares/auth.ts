import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyJwtToken } from "../modules/auth/auth.utils";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { TUserRoleEnum } from "../modules/user/user.interface";

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
    console.log(decodedData);

    const role = (decodedData as JwtPayload)?.role;
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
