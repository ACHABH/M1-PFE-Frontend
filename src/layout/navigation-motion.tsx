import type { ChildrenProps } from "../types";
import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

export default function NavigationMotionLayout({ children }: ChildrenProps) {
  const location = useLocation();
  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname}
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
