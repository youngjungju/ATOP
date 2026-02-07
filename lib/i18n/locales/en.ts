const en = {
  // ─── Home Page ───
  home: {
    badge: "AI-Powered Skin Care Support",
    headingLine1: "Clearer skin starts with",
    headingLine2: "understanding.",
    subtitle:
      "Take a clear photo of your skin concern for a detailed analysis and supportive report. We're here to help you manage your journey with confidence.",
    uploadTitle: "Upload a Photo",
    uploadHint: "JPEG, PNG or HEIC files up to 10MB",
    getStarted: "Get Started",
    fileTooLarge: "File size exceeds 10 MB. Please choose a smaller file.",
    trustSecure: "Secure & Private",
    trustInstant: "Instant Results",
    trustPatient: "Patient-First Design",
  },

  // ─── Upload Page ───
  upload: {
    title: "Skin Observation Report",
    subtitle:
      "Upload a photo and enter your info. AI will generate a preliminary visual analysis (not medical diagnosis).",
    photoSection: "Skin Photo Upload",
    photoPrompt: "Click to select an image",
    medicationsTitle: "Current Medications",
    medicationsHint: "List any medications or topical products (comma-separated).",
    medicationsPlaceholder: "e.g. Moisturizer, antihistamine",
    symptomsTitle: "Symptoms",
    symptomsHint: "Select any that apply (optional).",
    symptomOtherPlaceholder: "Other (describe)",
    durationTitle: "Duration of Symptoms",
    durationPlaceholder: "e.g. 2 weeks, few days",
    disclaimer:
      "This report is not medical advice. It provides a preliminary visual analysis only. Always consult a healthcare provider.",
    errorNoPhoto: "Please upload a skin photo first.",
    submitting: "Generating report...",
    submit: "Generate Report",
    symptoms: {
      itching: "Itching",
      redness: "Redness",
      pain: "Pain",
      dryness: "Dryness",
      swelling: "Swelling",
      flaking: "Flaking",
      burning: "Burning",
      tenderness: "Tenderness",
      other: "Other",
    },
  },

  // ─── Report Page ───
  report: {
    notFound: "Report not found or expired.",
    createNew: "Create New Report",
    loading: "Loading report...",
    newReport: "+ New Report",
    summary: "Summary",
    userReportedSymptoms: "User-Reported Symptoms",
    durationOfSymptoms: "Duration of Symptoms",
    prescriptionsButton: "My Prescriptions",
    prescriptionsHint: "Log current medications",
    conditionButton: "Body Condition Check",
    conditionHint: "Report how you feel",
    possibleCauses: "Possible Non-Diagnostic Causes",
    possibleCausesNote: "These are examples only — not a diagnosis.",
    generalAdvice: "General Advice",
  },

  // ─── Header Component ───
  header: {
    portalLabel: "Patient Portal",
    title: "Daily Care",
  },

  // ─── Diagnosis Summary Card ───
  diagnosisSummary: {
    title: "Analysis Result",
    userPhoto: "User Photo",
    reference: "Reference",
  },

  // ─── Confidence Badge ───
  confidence: {
    match: "Match",
  },

  // ─── Symptom Breakdown Card ───
  symptomBreakdown: {
    title: "Symptom Breakdown",
  },

  // ─── Clinical Referral Card ───
  clinicalReferral: {
    title: "Recommended Care",
    bookAppointment: "Book Appointment",
    openInMaps: "Open in Maps",
  },

  // ─── Active Treatment Card ───
  activeTreatment: {
    title: "Active Treatment",
    logDailyUsage: "Log Daily Usage",
    pill: "Pill",
    topical: "Topical",
    morning: "Morning",
    evening: "Evening",
  },

  // ─── Status Update Card ───
  statusUpdate: {
    title: "Status Update",
    justNow: "JUST NOW",
    currentFeelings: "Current Feelings",
    medicalLog: "Medical Log",
    tookPill: "Took Prescribed Pill",
    appliedOintment: "Applied Ointment",
    menstrualCycle: "Menstrual Cycle (Period)",
    saveDailyReport: "Save Daily Report",
    feelings: {
      itchiness: "Itchiness",
      stinging: "Stinging",
      dryness: "Dryness",
      burning: "Burning",
      sensitive: "Sensitive",
      normal: "Normal",
    },
  },

  // ─── Severity / Metrics (mockData) ───
  severity: {
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
  },

  metrics: {
    redness: "Redness",
    scaling: "Scaling",
    swelling: "Swelling",
    itching: "Itching",
    roughness: "Roughness",
  },
} as const;

export default en;
export type Translations = typeof en;
