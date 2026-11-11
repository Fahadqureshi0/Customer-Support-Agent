import { AnimatePresence, motion } from "motion/react";
import { sourceLabel } from "../utils";

const STATUS_TEXT = {
  waiting: "Waiting for your question",
  ok: "Answered by Edith",
  human: "Needs a human",
};

export default function Panel({ last, sessionId }) {
  const status = !last ? "waiting" : last.needs_human ? "human" : "ok";

  return (
    <motion.aside
      className="case"
      aria-label="Conversation details"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
    >
      <h2>Conversation details</h2>

      <div className="field">
        <div className="field-name">Status</div>
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            className={"status " + status}
            initial={{ scale: 1.4, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            {STATUS_TEXT[status]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="field">
        <div className="field-name">Topic</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={last ? last.category : "none"}
            className={"field-value" + (last ? "" : " none")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {last ? last.category : "Not set yet"}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="field">
        <div className="field-name">Articles used</div>
        {last && last.sources.length > 0 ? (
          last.sources.map((url, i) => (
            <motion.a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              {sourceLabel(url)}
            </motion.a>
          ))
        ) : (
          <div className="field-value none">
            {last ? "No articles used for this answer" : "None yet"}
          </div>
        )}
      </div>

      <div className="field">
        <div className="field-name">Session</div>
        <div className="field-value">{sessionId}</div>
      </div>
    </motion.aside>
  );
}