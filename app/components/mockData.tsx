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
};
