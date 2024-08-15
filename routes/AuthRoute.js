import { Router } from "express";
import AuthController from "../controllers/auth/LoginController.js";
const router = Router();

router.post("/login", AuthController.login);

export default router;
