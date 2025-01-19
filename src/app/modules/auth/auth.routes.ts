import { Router } from "express";
import { userController } from "../user/user.controller";
import requestValidation from "../../middlewares/requestValidation";
import { userValidations } from "../user/user.validation";




const router = Router();



router.post("/register",requestValidation(userValidations.createUserValidationSchema), userController.createUser)




export const AuthRoutes = router;