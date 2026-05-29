import {
  getRecentConversations,
  postConversationsService,
} from "../service/chat.service.js";

export async function getConversationsController(req, res) {
  try {
    // res.send("GET METHOD");
    const response = await getRecentConversations(100);
    res.status(200).json({
      success: true,
      message: "get api hitted", 
      data: { conversations: response },
    });
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
