import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyJwtToken } from "../modules/auth/auth.utils";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

const auth = () => {
  return catchAsync(async (req, res, next) => {

    //get token from client
    const token = req.headers.authorization;
    if(!token){
        throw new AppError(status.UNAUTHORIZED, "Unauthorize access");
    };


    // verify token
    let decodedData;
    try {
         decodedData = verifyJwtToken(token, config.jwtSecret as string);
    } catch (error) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorize access");
    }
    console.log(decodedData);


    req.user = decodedData as JwtPayload;


    next();
  });
};

export default auth;
