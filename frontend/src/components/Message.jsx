import { motion } from "motion/react";
import { sourceLabel } from "../utils";

export default function Message({ msg }) {
  const classes = "msg " + msg.role + (msg.isError ? " error" : "");

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <div className="bubble">{msg.text}</div>

      {msg.needsHuman && (
        <motion.div
          className="handoff"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          Edith is handing this to a human agent.
        </motion.div>
      )}

      {msg.sources && msg.sources.length > 0 && (
        <div className="sources">
          Articles used
          {msg.sources.map((url, i) => (
            <motion.a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              {sourceLabel(url)}
            </motion.a>
          ))}
        </div>
      )}
    </motion.div>
  );
}