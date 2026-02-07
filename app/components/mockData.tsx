"use client";

import React from 'react';
import {
  Activity,
  Droplets,
  Layers,
  Pill,
  FlaskConical,
  Zap,
  Wind,
} from 'lucide-react';

export const DIAGNOSIS_DATA = {
  subtype: "Nummular Atopic Dermatitis",
  confidence: 94,
  description:
    "The skin shows signs of acute inflammation and high dryness, consistent with circular eczematous lesions. [Ref: ICD-11 EK00.1, Fitzpatrick Dermatology Vol. 9]",
  metrics: [
    { label: "Redness", value: 7, status: "Moderate", icon: <Activity size={18} className="text-red-500" /> },
    { label: "Scaling", value: 3, status: "Mild", icon: <Layers size={18} className="text-amber-500" /> },
    { label: "Swelling", value: 9, status: "Severe", icon: <Droplets size={18} className="text-blue-500" /> },
    { label: "Itching", value: 10, status: "Severe", icon: <Zap size={18} className="text-purple-500" /> },
    { label: "Roughness", value: 6, status: "Moderate", icon: <Wind size={18} className="text-gray-500" /> },
  ],
  treatments: [
    { id: 1, type: "Pill", name: "Antihistamine", dosage: "10mg morning", icon: <Pill size={20} /> },
    { id: 2, type: "Topical", name: "Hydrocortisone", dosage: "Apply twice daily", icon: <FlaskConical size={20} /> },
  ],
  referral: {
    doctor: "Dr. Jane Smith",
    hospital: "Seoul National University Hospital",
    distance: "0.8km away",
  },
  hospitals: [
    {
      name: "오운의원 삼성점",
      nameEn: "Oun Clinic Samsung Branch",
      doctor: "Dr. Kim Soo-Jin",
      distance: "0.8km",
      mapUrl: "https://naver.me/GzE9zRl4",
    },
    {
      name: "삼성비앤에스의원 강남",
      nameEn: "Samsung BnS Clinic Gangnam",
      doctor: "Dr. Park Min-Hee",
      distance: "1.2km",
      mapUrl: "https://naver.me/xl0DeiQt",
    },
    {
      name: "신학철피부과의원",
      nameEn: "Shin Hak-Chul Dermatology Clinic",
      doctor: "Dr. Lee Jae-Won",
      distance: "2.5km",
      mapUrl: "https://naver.me/xhzTAtaV",
    },
    {
      name: "미소가인피부과의원 삼성점",
      nameEn: "Misogain Dermatology Clinic Samsung Branch",
      doctor: "Dr. Choi Yeon-Soo",
      distance: "3.1km",
      mapUrl: "https://naver.me/5D8Ipnd0",
    },
    {
      name: "브릴린의원 강남",
      nameEn: "Brillin Clinic Gangnam",
      doctor: "Dr. Jung Hyun-Woo",
      distance: "4.0km",
      mapUrl: "https://naver.me/F42AvNGy",
    },
  ],
};
