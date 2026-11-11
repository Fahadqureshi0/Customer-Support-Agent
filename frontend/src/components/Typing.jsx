import { motion } from "motion/react";

export default function Typing() {
  return (
    <motion.div
      className="msg agent"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="bubble typing">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="dot"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}