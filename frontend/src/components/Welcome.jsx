import { motion } from "motion/react";

const QUESTIONS = [
  "What are the usage limits on the Pro plan?",
  "What is the difference between usage limits and length limits?",
  "What's my plan? My email is mona@example.com",
  "I want to talk to a human. My email is ali@example.com",
];

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function Welcome({ onPick }) {
  return (
    <motion.div className="welcome" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        Ask about plans, usage limits or your account.
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Edith answers from real Claude help-center articles and links the ones she used. If she
        can't help, she hands you to a human.
      </motion.p>

      <motion.div className="chips" variants={list} initial="hidden" animate="show">
        {QUESTIONS.map((q) => (
          <motion.button
            key={q}
            className="chip"
            variants={item}
            whileHover={{ x: 8 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(q)}
          >
            {q}
          </motion.button>
        ))}
      </motion.div>
      <p className="demo-note">
      </p>
    </motion.div>
  );
}