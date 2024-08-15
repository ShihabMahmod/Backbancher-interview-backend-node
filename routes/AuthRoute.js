import { Router } from "express";
import AuthController from "../controllers/auth/LoginController.js";
const router = Router();


router.get("/auth/index", AuthController.index);
router.post("/auth/login", AuthController.login);

router.post("/forgot-password-send-mail", AuthController.forgot_password_email);
router.get("/check-otp/:otp", AuthController.check_otp);
router.post("/reset-password/:otp", AuthController.reset_password);

export default router;
