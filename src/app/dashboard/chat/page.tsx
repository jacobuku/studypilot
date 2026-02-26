"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Paperclip,
  ChevronDown,
  Cpu,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "agent";
  content: string;
  timestamp: string;
  agentAction?: string;
  courseContext?: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "agent",
    content: "I noticed you have a CHEM 301 midterm in 17 days. I've prepared some key concepts you should review. Would you like me to walk you through any of them?",
    timestamp: "10:30 AM",
    agentAction: "Proactive exam preparation",
  },
  {
    id: "2",
    role: "user",
    content: "Yes! Can you explain the SN1 vs SN2 reaction mechanisms? I keep getting confused about when each one applies.",
    timestamp: "10:32 AM",
    courseContext: "CHEM 301",
  },
  {
    id: "3",
    role: "assistant",
    content: `Great question! Let me break this down step by step so it's crystal clear.

**SN1 (Substitution Nucleophilic Unimolecular)**

Think of SN1 like a two-step dance:
1. **Step 1 — The leaving group leaves first** (slow step). This creates a carbocation intermediate.
2. **Step 2 — The nucleophile attacks** the carbocation (fast step).

Key characteristics:
- **Rate = k[substrate]** — only depends on the substrate, not the nucleophile
- **Works best with:** tertiary (3°) substrates → most stable carbocation
- **Stereochemistry:** gives a **racemic mixture** (both R and S) because the nucleophile can attack from either side of the flat carbocation
- **Favored by:** polar protic solvents (water, alcohols), weak nucleophiles

**SN2 (Substitution Nucleophilic Bimolecular)**

Think of SN2 like a one-step backside attack:
1. The nucleophile attacks **at the same time** as the leaving group leaves — it's one concerted step.

Key characteristics:
- **Rate = k[substrate][nucleophile]** — depends on BOTH
- **Works best with:** methyl and primary (1°) substrates → least steric hindrance
- **Stereochemistry:** gives **inversion of configuration** (Walden inversion) — like turning an umbrella inside out
- **Favored by:** polar aprotic solvents (DMSO, acetone), strong nucleophiles

**Quick Decision Cheat Sheet:**
| Factor | SN1 | SN2 |
|--------|-----|-----|
| Substrate | 3° > 2° | Methyl > 1° > 2° |
| Nucleophile | Weak | Strong |
| Solvent | Polar protic | Polar aprotic |
| Rate law | First order | Second order |
| Stereochem | Racemization | Inversion |

Would you like me to generate some practice problems on this topic?`,
    timestamp: "10:33 AM",
  },
];

const suggestedQuestions = [
  "Explain the difference between E1 and E2 elimination",
  "How do I determine if a reaction is SN1, SN2, E1, or E2?",
  "What are the key properties of alkenes?",
  "Help me understand carbocation stability",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("CHEM 301");
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      courseContext: selectedCourse,
    };

    setMessages([...messages, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "That's a great follow-up question! Let me explain this in detail based on your course materials...\n\nI'm analyzing your uploaded lecture notes from Week 6 to give you the most relevant explanation. In a real integration, this response would come from your AI backend (Claude API, OpenAI, etc.) and would be grounded in your actual course content.\n\nThe API endpoint for this is `POST /api/chat` — you can connect it to any LLM provider.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col animate-fade-in">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
            <Bot size={20} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AI Tutor</h1>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-xs text-gray-500">Online — Ready to help</span>
            </div>
          </div>
        </div>

        {/* Course context selector */}
        <div className="relative">
          <button
            onClick={() => setShowCourseSelector(!showCourseSelector)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={14} />
            {selectedCourse}
            <ChevronDown size={14} />
          </button>
          {showCourseSelector && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-10 animate-fade-in">
              {["CHEM 301", "CS 201", "ECON 101", "All Courses"].map((course) => (
                <button
                  key={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowCourseSelector(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedCourse === course
                      ? "bg-brand-50 text-brand-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                msg.role === "user"
                  ? "bg-brand-100 text-brand-700"
                  : msg.role === "agent"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-brand-50 text-brand-600"
              }`}
            >
              {msg.role === "user" ? (
                <User size={16} />
              ) : msg.role === "agent" ? (
                <Cpu size={16} />
              ) : (
                <Sparkles size={16} />
              )}
            </div>

            {/* Message bubble */}
            <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
              {msg.agentAction && (
                <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600">
                  <Cpu size={10} /> {msg.agentAction}
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-tr-sm"
                    : msg.role === "agent"
                    ? "bg-purple-50 text-gray-800 border border-purple-100 rounded-tl-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              <p className={`mt-1 text-xs text-gray-400 ${msg.role === "user" ? "text-right" : ""}`}>
                {msg.timestamp}
                {msg.courseContext && ` · ${msg.courseContext}`}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Sparkles size={16} />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 3 && (
        <div className="flex flex-wrap gap-2 py-3">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <Paperclip size={18} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your courses..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-gray-400"
            style={{ minHeight: "24px", maxHeight: "120px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          AI responses are based on your uploaded course materials. Always verify with your instructor.
        </p>
      </div>
    </div>
  );
}
