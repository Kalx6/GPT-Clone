import express from "express";
import {
  getConversationsController,
  postConversationsController,
} from "./controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/conversations", getConversationsController);

chatRouter.post("/conversations", postConversationsController);

export default chatRouter;
