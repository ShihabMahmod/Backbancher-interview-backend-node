import { Router } from "express";
import AuthRoute from "./AuthRoute.js";

import auth from "../middleware/Auth.js";

const router = Router();

router.use("/", AuthRoute);


export default router;

