import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

export default function Composer({ onSend, busy }) {
  const [text, setText] = useState("");
  const boxRef = useRef(null);

  // textarea grows as you type
  useEffect(() => {
    boxRef.current.style.height = "auto";
    boxRef.current.style.height = boxRef.current.scrollHeight + "px";
  }, [text]);

  function submit() {
    if (!text.trim() || busy) return;
    onSend(text);
    setText("");
  }

  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="composer-inner">
        <textarea
          ref={boxRef}
          rows={1}
          value={text}
          placeholder="Type your question"
          aria-label="Your message"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter = new line
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <motion.button
          className="send"
          type="submit"
          disabled={busy || !text.trim()}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
        >
          Send
        </motion.button>
      </div>
    </form>
  );
}