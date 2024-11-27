import type { ChildrenProps } from "../types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function NavigationMotionLayout({ children }: ChildrenProps) {
  const reducedMotion = useReducedMotion();

  return reducedMotion ? (
    children
  ) : (
    <AnimatePresence>
      <motion.div
        key={window.location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
