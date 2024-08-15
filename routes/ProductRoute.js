import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
const router = Router();

router.get("/", ProductController.index);
router.post("/", ProductController.store);
router.get("/:slug", ProductController.edit);
router.put("/:slug", ProductController.update);
router.delete("/:slug", ProductController.destroy);

export default router;
