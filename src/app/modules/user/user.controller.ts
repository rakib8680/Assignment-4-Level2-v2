import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";




//  create a user 
const createUser = catchAsync(async (req, res) => {
    const payload = req.body;
    const result = await userServices.createUser(payload);
    res.status(status.CREATED).json({
        success : true,
        statusCode : status.CREATED,
        message : "User registered successfully",
        data : result
    });
});








export const userController = {
    createUser
}