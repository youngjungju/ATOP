"use client";

import React from 'react';
import { User } from 'lucide-react';

const Header = () => (
  <header className="sticky top-0 z-10 bg-[#F8F9FA]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
    <div>
      <h1 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Patient Portal</h1>
      <p className="font-bold text-lg">Daily Care</p>
    </div>
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
      <User size={20} className="text-[#4A90E2]" />
    </div>
  </header>
);

export default Header;
