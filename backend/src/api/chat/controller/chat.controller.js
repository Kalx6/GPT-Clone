import { postConversationsService } from "../service/chat.service.js";

export async function getConversationsController(req, res) {
  try {
    // res.send("GET METHOD");
    const response = await getConversationsService();
    res.send(response);
  } catch (error) {
    throw error;
  }
}

export async function postConversationsController(req, res) {
  try {
    const { question } = req.body || {};
    const response = await postConversationsService(question);
    res.status(201).json({
      success: true,
      message: "conversation posted successfully",
      data: response,
    });
  } catch (error) {
    throw error;
  }
}
