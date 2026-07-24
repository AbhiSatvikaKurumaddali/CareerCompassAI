import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = true, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${hover ? "glass-card-hover" : "glass-card"} p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
