"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingSearchButton = () => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="fixed bottom-6 right-6 w-14 h-14 bg-[#4A90E2] text-white rounded-full shadow-2xl flex items-center justify-center z-20 border-4 border-white"
  >
    <Search size={24} />
  </motion.button>
);

export default FloatingSearchButton;
