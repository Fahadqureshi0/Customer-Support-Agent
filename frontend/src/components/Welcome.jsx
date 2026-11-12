import { motion } from "motion/react";

export default function Welcome() {
  return (
    <motion.div className="welcome" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        Ask about plans, usage limits or your account.
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        Edith answers from real Claude help-center articles and links the ones she used. If she
        can't help, she hands you to a human.
      </motion.p>
    </motion.div>
  );
}
