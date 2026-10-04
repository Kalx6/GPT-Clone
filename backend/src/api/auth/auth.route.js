import express from "express";
import {
  registerController,
  loginController,
} from "./controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

export default authRouter;
