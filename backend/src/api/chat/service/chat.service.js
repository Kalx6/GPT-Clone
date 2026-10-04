import db from "../../../../db/db.config.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.5-flash-lite";

const createGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API key is not defined");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export const getRecentConversations = async (userId, limit = 5) => {
  const normalizedLimit = parseInt(limit, 10);
  const safeLimit =
    Number.isNaN(normalizedLimit) || normalizedLimit <= 0
      ? 20
      : normalizedLimit;

  const [rows] = await db.execute(
    `SELECT id,role, content, created_at FROM conversations WHERE user_id = ? ORDER BY id DESC LIMIT ${safeLimit}`,
    [userId],
  );
  return rows.reverse();
};

const generateAssistantResponse = async (historyRows, question) => {
  //create gemini client
  const chat = createGeminiClient().chats.create({
    model: GEMINI_MODEL,
    config: {
      maxOutputTokens: 1024,
    },
    history: historyRows.map((row) => ({
      role: row.role === "assistant" ? "model" : row.role,
      parts: [{ text: row.content }],
    })),
  });
  const result = await chat.sendMessage({ message: question });
  // console.log(result.text);
  return {
    text: result.text,
    totalToken: result.usageMetadata.totalTokenCount,
  }; //return gemini response
};

const getMessageById = async (messageId, userId) => {
  const [rows] = await db.execute(
    `SELECT id,role, content, token_count, created_at FROM conversations WHERE id = ? AND user_id = ?`,
    [messageId, userId],
  );
  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    role: rows[0].role,
    content: rows[0].content,
    tokenCount: Number(rows[0].token_count || 0),
    createdAt: rows[0].created_at,
  };
};

export async function postConversationsService(question, userId) {
  //validation
  try {
    if (!question || !question.trim()) {
      const error = new Error("Question is required");
      error.statusCode = 400;
      throw error;
    }

    //recent history
    const historyRows = await getRecentConversations(userId);

    //save user message to db
    const [result] = await db.execute(
      `INSERT INTO conversations (role, content, user_id) VALUES (?, ?, ?)`,
      ["user", question, userId],
    );

    const assistantText = await generateAssistantResponse(
      historyRows,
      question,
    );

    //save assistant message to db
    const [assistantResponse] = await db.execute(
      `INSERT INTO conversations (role, content, token_count, user_id) VALUES (?, ?, ?, ?)`,
      ["assistant", assistantText.text, assistantText.totalToken, userId],
    );

    const userConversation = await getMessageById(result.insertId, userId);
    const assistantConversation = await getMessageById(
      assistantResponse.insertId,
      userId,
    );

    return { userConversation, assistantConversation };
  } catch (error) {
    throw error;
  }
}
