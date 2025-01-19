import { TUser } from "./user.interface";
import { UserModel } from "./user.model";



//  create a user 
const createUser = async (payload:TUser)=>{
    
    const result = await UserModel.create(payload);

    // delete password field from the result
    const userData = result.toObject();
    delete userData.password;
    return userData;

};












export const userServices = {
    createUser
}