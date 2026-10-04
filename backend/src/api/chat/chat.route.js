import express from "express";
import {
  getConversationsController,
  postConversationsController,
} from "./controller/chat.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const chatRouter = express.Router();
chatRouter.use(requireAuth);
chatRouter.get("/conversations", getConversationsController);

chatRouter.post("/conversations", postConversationsController);

export default chatRouter;
