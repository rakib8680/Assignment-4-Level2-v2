import { TUser } from "./user.interface";
import { UserModel } from "./user.model";



//  create a user 
const createUser = async (payload:TUser)=>{
    
    const result = await UserModel.create(payload);
    return result;

};












export const userServices = {
    createUser
}