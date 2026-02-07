"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SeverityScaleProps {
  status: string;
  value: number;
  onChange?: (value: number) => void;
}

const SeverityScale = ({ status, value, onChange }: SeverityScaleProps) => {
  const getActiveColor = (val: number) => {
    if (val <= 3) return "bg-[#50C878]";
    if (val <= 7) return "bg-[#4A90E2]";
    return "bg-red-400";
  };

  const handleClick = (num: number) => {
    if (onChange) onChange(num);
  };

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[9px] text-gray-400 mb-1.5 uppercase tracking-widest font-bold px-1">
        <span className={value <= 3 ? 'text-[#50C878]' : ''}>Mild</span>
        <span className={value > 3 && value <= 7 ? 'text-[#4A90E2]' : ''}>Moderate</span>
        <span className={value > 7 ? 'text-red-400' : ''}>Severe</span>
      </div>
      <div className="flex gap-1 h-3 w-full mb-3">
        {[...Array(10)].map((_, i) => {
          const blockNum = i + 1;
          const isActive = blockNum === value;
          return (
            <motion.div
              key={blockNum}
              animate={{ scaleY: isActive ? 1.2 : 1, opacity: isActive ? 1 : 0.2 }}
              whileHover={{ scaleY: 1.3, opacity: 0.7 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(blockNum)}
              className={`flex-1 rounded-sm cursor-pointer ${isActive ? getActiveColor(blockNum) : 'bg-gray-300 hover:bg-gray-400'}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between items-start px-0.5">
        {[...Array(10)].map((_, i) => {
          const num = i + 1;
          const isActive = num === value;
          return (
            <div
              key={num}
              className="flex flex-col items-center flex-1 cursor-pointer group"
              onClick={() => handleClick(num)}
            >
              <div className={`w-px h-1 mb-1 transition-colors ${isActive ? 'bg-gray-800 h-2' : 'bg-gray-200 group-hover:bg-gray-400'}`} />
              <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-gray-900 scale-125' : 'text-gray-300 group-hover:text-gray-500'}`}>
                {num}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeverityScale;
