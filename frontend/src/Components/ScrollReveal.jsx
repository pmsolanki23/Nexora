import { motion } from "framer-motion";

const ScrollReveal = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} // Smooth fade-up
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }} // Faster transition
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.div>
);

export default ScrollReveal;
