import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Tittle = ({ text1, text2 }) => {
  return (
    <motion.div
      className="inline-flex gap-2 items-center mb-3"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-[#f8fafc] font-extrabold tracking-tight">
        {text1} <span className="text-[#aaff5a] font-extrabold">{text2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[2px] bg-[#ff6f61]"></p>
    </motion.div>
  );
};

export default Tittle;
