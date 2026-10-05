import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./services/api";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import MessageList from "./components/MessageList/MessageList";
import ChatInput from "./components/ChatInput/ChatInput";
import "./App.css";

function App() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, isLoading]);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/chat/conversations");
      if (response.data.success) {
        setConversations(response.data.data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleSendMessage = async (question) => {
    // Optimistically add user message
    const tempUserMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };
    setConversations((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/chat/conversations", {
        question,
      });
      if (response.data.success) {
        const { userConversation, assistantConversation } = response.data.data;
        // Replace temp message with real ones
        setConversations((prev) => {
          const filtered = prev.filter((msg) => msg.id !== tempUserMessage.id);
          return [...filtered, userConversation, assistantConversation];
        });
      }
    } catch (error) {
      console.error("Error posting conversation:", error);

      // Extract error message from backend response or use a realistic fallback
      const errorMessage =
        error.response?.data?.message ||
        "There was an error generating a response.";

      // Add error message to chat
      const errorConversation = {
        id: Date.now() + 1,
        role: "assistant",
        content: errorMessage,
      };

      setConversations((prev) => [...prev, errorConversation]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onToggle={toggleSidebar}
      />

      <main className="chat">
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <MessageList
          conversations={conversations}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;
