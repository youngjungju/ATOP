"use client";

import React from 'react';

interface ConfidenceBadgeProps {
  percentage: number;
}

const ConfidenceBadge = ({ percentage }: ConfidenceBadgeProps) => {
  const isHigh = percentage > 80;
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isHigh
          ? 'bg-[#50C878]/10 text-[#50C878]'
          : 'bg-amber-100 text-amber-600'
      }`}
    >
      {percentage}% Match
    </span>
  );
};

export default ConfidenceBadge;
