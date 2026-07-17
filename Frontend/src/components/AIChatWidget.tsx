import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, LoaderCircle } from "lucide-react";
import { handleChat } from "../services/ai.service";
import QuestCard from "./QuestCard";
import { getQuestById } from "../services/quest.service";
import { getMyJoinedQuests } from "../services/userQuest.service";

interface IQuest {
  _id: string;
  title: string;
  rewardXP: number;
}

interface IMessage {
  sender: "user" | "ai";
  text: string;
  recommendations?: IQuest[];
}

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<IQuest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isQuestLoading, setIsQuestLoading] = useState(false);
  const [joinedQuestIds, setJoinedQuestIds] = useState<string[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchJoinedQuests = async () => {
      if (isOpen) {
        try {
          // Fetch a large number of quests to get all joined ones
          const data = await getMyJoinedQuests(1, 1000);
          setJoinedQuestIds(
            data.quests.map((q: any) => q.questId?._id).filter(Boolean),
          );
        } catch (error) {
          console.error("Failed to fetch joined quests", error);
        }
      }
    };

    if (isOpen) {
      setMessages([
        {
          sender: "ai",
          text: `Hello, ${
            user.username || "User"
          }! Welcome to the VaibQuest AI Assistant.`,
        },
        {
          sender: "ai",
          text: "You can ask me about available quests, your progress, or anything else related to your journey.",
        },
      ]);
      fetchJoinedQuests();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: IMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    let aiResponse: IMessage;
    try {
      const response = await handleChat(input);

      if (response.response.type === "QuestRelated") {
        aiResponse = {
          sender: "ai",
          text: response.response.data.message,
          recommendations: response.response.data.recommendations,
        };
      } else {
        aiResponse = {
          sender: "ai",
          text: response.response.data.message,
        };
      }
    } catch (error) {
      aiResponse = {
        sender: "ai",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
      };
    } finally {
      setLoading(false);
      setMessages((prev) => [...prev, aiResponse]);
    }
  };

  const handleViewDetails = async (questId: string) => {
    try {
      setIsQuestLoading(true);
      setIsQuestModalOpen(true);
      const questData = await getQuestById(questId);
      setSelectedQuest(questData.quest);
    } catch (error) {
      console.error("Failed to fetch quest details", error);
    } finally {
      setIsQuestLoading(false);
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <div className="fixed bottom-8 right-8 z-[9999]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
          aria-label="Open AI Chat"
        >
          {isOpen ? <X size={32} /> : <Bot size={32} />}
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-[9997]"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <div className="fixed bottom-28 right-8 w-96 bg-white rounded-2xl shadow-2xl border flex flex-col h-[60vh] z-[9998]">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-lg">VaibQuest AI Assistant</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "ai" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === "ai"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="mt-3 max-h-60 overflow-y-auto space-y-2 pr-2">
                        {msg.recommendations.map((quest: IQuest) => (
                          <div
                            key={quest._id}
                            className="bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <p className="font-semibold text-gray-800">
                              {quest.title}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                                {quest.rewardXP} XP
                              </span>
                              <button
                                onClick={() => handleViewDetails(quest._id)}
                                className="text-xs bg-black text-white px-2.5 py-1 rounded-md hover:bg-gray-800 transition"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                    <LoaderCircle className="animate-spin" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about quests..."
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black transition"
                />
                <button
                  onClick={sendMessage}
                  className="bg-black text-white p-2.5 rounded-lg hover:opacity-90 transition"
                  disabled={loading}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isQuestModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setIsQuestModalOpen(false)}
              className="absolute -top-3 -right-3 bg-white text-black p-1.5 rounded-full shadow-lg z-10"
            >
              <X size={22} />
            </button>
            <div className="p-2">
              {isQuestLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <LoaderCircle className="animate-spin" size={32} />
                </div>
              ) : selectedQuest ? (
                <QuestCard
                  quest={selectedQuest}
                  isJoinedStatus={joinedQuestIds.includes(selectedQuest._id)}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
