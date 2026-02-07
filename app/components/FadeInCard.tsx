"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FadeInCardProps {
  children: React.ReactNode;
  delay?: number;
}

const FadeInCard = ({ children, delay = 0 }: FadeInCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-[16px] p-6 mb-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50"
  >
    {children}
  </motion.div>
);

export default FadeInCard;
