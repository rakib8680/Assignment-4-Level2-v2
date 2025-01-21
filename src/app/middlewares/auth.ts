import status from "http-status";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import { verifyJwtToken } from "../modules/auth/auth.utils";
import config from "../config";

const auth = () => {
  return catchAsync(async (req, res, next) => {

    //get token from client
    const token = req.headers.authorization;
    if(!token){
        throw new AppError(status.UNAUTHORIZED, "Unauthorize access");
    };


    // verify token
    const decodedData = verifyJwtToken(token, config.jwtSecret as string);
    console.log(decodedData);


    next();
  });
};

export default auth;
