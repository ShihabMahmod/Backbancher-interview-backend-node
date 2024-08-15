import { Router } from "express";
import AuthRoute from "./AuthRoute.js";
import HomeRoute from "./HomeRoute.js";
import ProductRoute from "./ProductRoute.js";

import auth from "../middleware/Auth.js";

const router = Router();

router.use("/", HomeRoute);
router.use("/auth", AuthRoute);
router.use("/product", auth,ProductRoute);


export default router;

