/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const SlideInLeft = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }} // faster animation
    viewport={{ once: true, amount: 0.1 }} // animate once, trigger sooner
    style={{ overflow: "hidden" }}
  >
    {children}
  </motion.div>
);

export default SlideInLeft;
