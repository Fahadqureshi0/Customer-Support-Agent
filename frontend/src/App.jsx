import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendMessage } from "./api";
import { newSessionId } from "./utils";
import Welcome from "./components/Welcome";
import Message from "./components/Message";
import Typing from "./components/Typing";
import Composer from "./components/Composer";
import Panel from "./components/Panel";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [sessionId, setSessionId] = useState(newSessionId);
  const [messages, setMessages] = useState([]);
  const [last, setLast] = useState(null);   // latest reply from the API (for the side panel)
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  // theme: use the saved choice, otherwise follow the system setting
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // apply the theme to the page and remember it
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function addMessage(msg) {
    setMessages((list) => [...list, { id: Date.now() + Math.random(), ...msg }]);
  }

  async function send(text) {
    text = text.trim();
    if (!text || busy) return;

    addMessage({ role: "user", text: text });
    setBusy(true);

    try {
      const data = await sendMessage(sessionId, text);
      addMessage({
        role: "agent",
        text: data.answer,
        needsHuman: data.needs_human,
        sources: data.sources,
      });
      setLast(data);
    } catch (err) {
      addMessage({
        role: "agent",
        isError: true,
        text:
          "Edith couldn't answer. Check that the backend is running on port 8000 and GROQ_API_KEY is set in .env, then send your message again.\n\nDetails: " +
          err.message,
      });
    }

    setBusy(false);
  }

  function newChat() {
    setSessionId(newSessionId());
    setMessages([]);
    setLast(null);
  }

  return (
    <div className="app">
      <main className="chat">
        <header className="chat-head">
          {/* the avatar pulses while Edith is thinking */}
          <motion.div
            className="avatar"
            animate={busy ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={busy ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
          >
            E
          </motion.div>
          <div className="who">
            <strong>Edith</strong>
            <span>Customer Support Assistant</span>
          </div>

          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
          />

          <motion.button className="btn-ghost" whileTap={{ scale: 0.94 }} onClick={newChat}>
            New chat
          </motion.button>
        </header>

        <section className="log" aria-live="polite" aria-label="Conversation">
          <div className="log-inner">
            <AnimatePresence>
              {messages.length === 0 && <Welcome onPick={send} />}
            </AnimatePresence>

            {messages.map((m) => (
              <Message key={m.id} msg={m} />
            ))}

            <AnimatePresence>{busy && <Typing />}</AnimatePresence>
            <div ref={bottomRef} />
          </div>
        </section>

        <Composer onSend={send} busy={busy} />
      </main>

      <Panel last={last} sessionId={sessionId} />
    </div>
  );
}