import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
const router = Router();

router.get("/", ProductController.index);

export default router;
