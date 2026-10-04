import express from "express";
import {
  registerController,
  loginController,
} from "./controller/auth.controller.js";
import { authLimiter } from "../../middleware/rateLimiter.js";

const authRouter = express.Router();

authRouter.use(authLimiter);

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

export default authRouter;
