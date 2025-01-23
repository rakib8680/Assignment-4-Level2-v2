import { Router } from "express";
import { userController } from "../user/user.controller";
import requestValidation from "../../middlewares/requestValidation";
import { userValidations } from "../user/user.validation";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE_ENUM } from "../user/user.constant";

const router = Router();

router.post(
  "/register",
  requestValidation(userValidations.createUserValidationSchema),
  userController.createUser
);
router.post(
  "/login",
  requestValidation(userValidations.loginUserValidationSchema),
  authController.loginUser
);
router.post(
  "/change-password",
  auth(USER_ROLE_ENUM.admin, USER_ROLE_ENUM.user),
  authController.changePassword
);

export const AuthRoutes = router;
