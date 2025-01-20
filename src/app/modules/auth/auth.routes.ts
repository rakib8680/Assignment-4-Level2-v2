import { Router } from "express";
import { userController } from "../user/user.controller";
import requestValidation from "../../middlewares/requestValidation";
import { userValidations } from "../user/user.validation";
import { authController } from "./auth.controller";




const router = Router();



router.post("/register",requestValidation(userValidations.createUserValidationSchema), userController.createUser)
router.post("/login", requestValidation(userValidations.loginUserValidationSchema),authController.loginUser)




export const AuthRoutes = router;