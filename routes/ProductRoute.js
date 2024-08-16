import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import Permission from "../middleware/Permission.js";
const router = Router();

router.get("/", ProductController.index);
router.post("/",Permission('create'), ProductController.store);
router.get("/:slug",Permission('read'), ProductController.edit);
router.put("/:slug",Permission('update'), ProductController.update);
router.delete("/:slug",Permission('delete'), ProductController.destroy);

export default router;
