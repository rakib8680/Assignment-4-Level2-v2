import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";

// login user
const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authServices.loginUser(payload);
  res.status(status.OK).json({
    success: true,
    statusCode: status.OK,
    message: "User logged in successfully",
    data: {
      user: result.userObject,
      token: result.accessToken,
    },
  });
});



// change password 
const changePassword = catchAsync(async (req, res) => {
  const userData =req.user;
  const payload = req.body;
  await authServices.changePassword(userData, payload);
  res.status(status.OK).json({
    success: true,
    statusCode: status.OK,
    message: "Password changed successfully",
  });
});



export const authController = {
  loginUser,
  changePassword,
};
