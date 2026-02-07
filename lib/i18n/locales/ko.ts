import type { Translations } from "./en";

const ko: Translations = {
  // ─── 홈 페이지 ───
  home: {
    badge: "AI 기반 피부 관리 지원",
    headingLine1: "깨끗한 피부는",
    headingLine2: "이해에서 시작됩니다.",
    subtitle:
      "피부 고민 부위를 선명하게 촬영하면 상세한 분석과 도움이 되는 리포트를 받을 수 있습니다. 자신감을 가지고 관리할 수 있도록 함께하겠습니다.",
    uploadTitle: "사진 업로드",
    uploadHint: "JPEG, PNG 또는 HEIC 파일 (최대 10MB)",
    getStarted: "시작하기",
    fileTooLarge: "파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.",
    trustSecure: "안전하고 비공개",
    trustInstant: "즉시 결과 확인",
    trustPatient: "환자 중심 설계",
  },

  // ─── 업로드 페이지 ───
  upload: {
    title: "피부 관찰 리포트",
    subtitle:
      "사진을 업로드하고 정보를 입력하세요. AI가 예비 시각 분석을 생성합니다 (의학적 진단 아님).",
    photoSection: "피부 사진 업로드",
    photoPrompt: "이미지를 선택하려면 클릭하세요",
    medicationsTitle: "현재 복용 약물",
    medicationsHint: "복용 중인 약물이나 외용제를 입력하세요 (쉼표로 구분).",
    medicationsPlaceholder: "예: 보습제, 항히스타민제",
    symptomsTitle: "증상",
    symptomsHint: "해당되는 항목을 선택하세요 (선택사항).",
    symptomOtherPlaceholder: "기타 (설명)",
    durationTitle: "증상 지속 기간",
    durationPlaceholder: "예: 2주, 며칠",
    disclaimer:
      "이 리포트는 의학적 조언이 아닙니다. 예비 시각 분석만 제공합니다. 반드시 의료 전문가와 상담하세요.",
    errorNoPhoto: "먼저 피부 사진을 업로드해주세요.",
    submitting: "리포트 생성 중...",
    submit: "리포트 생성",
    symptoms: {
      itching: "가려움",
      redness: "발적",
      pain: "통증",
      dryness: "건조함",
      swelling: "부기",
      flaking: "벗겨짐",
      burning: "작열감",
      tenderness: "압통",
      other: "기타",
    },
  },

  // ─── 리포트 페이지 ───
  report: {
    notFound: "리포트를 찾을 수 없거나 만료되었습니다.",
    createNew: "새 리포트 만들기",
    loading: "리포트 불러오는 중...",
    newReport: "+ 새 리포트",
    summary: "요약",
    userReportedSymptoms: "사용자 보고 증상",
    durationOfSymptoms: "증상 지속 기간",
    prescriptionsButton: "내 처방전",
    prescriptionsHint: "현재 약물 기록",
    conditionButton: "신체 상태 확인",
    conditionHint: "현재 느끼는 상태 보고",
    possibleCauses: "비진단적 가능 원인",
    possibleCausesNote: "이것은 예시일 뿐이며 진단이 아닙니다.",
    generalAdvice: "일반적인 조언",
  },

  // ─── 헤더 컴포넌트 ───
  header: {
    portalLabel: "환자 포털",
    title: "일일 케어",
  },

  // ─── 진단 요약 카드 ───
  diagnosisSummary: {
    title: "분석 결과",
    userPhoto: "사용자 사진",
    reference: "참고 이미지",
  },

  // ─── 신뢰도 배지 ───
  confidence: {
    match: "일치",
  },

  // ─── 증상 분석 카드 ───
  symptomBreakdown: {
    title: "증상 분석",
  },

  // ─── 임상 의뢰 카드 ───
  clinicalReferral: {
    title: "추천 의료 서비스",
    bookAppointment: "예약하기",
    openInMaps: "지도에서 열기",
    hospitalCount: "개 병원",
  },

  // ─── 현재 치료 카드 ───
  activeTreatment: {
    title: "현재 치료",
    logDailyUsage: "일일 사용 기록",
    pill: "알약",
    topical: "외용제",
    morning: "아침",
    evening: "저녁",
  },

  // ─── 상태 업데이트 카드 ───
  statusUpdate: {
    title: "상태 업데이트",
    justNow: "방금",
    currentFeelings: "현재 느낌",
    medicalLog: "의료 기록",
    tookPill: "처방약 복용 완료",
    appliedOintment: "연고 도포 완료",
    menstrualCycle: "생리 주기",
    saveDailyReport: "일일 리포트 저장",
    feelings: {
      itchiness: "가려움",
      stinging: "따끔거림",
      dryness: "건조함",
      burning: "작열감",
      sensitive: "민감함",
      normal: "정상",
    },
  },

  // ─── 심각도 / 지표 ───
  severity: {
    mild: "경미",
    moderate: "보통",
    severe: "심각",
  },

  metrics: {
    redness: "발적",
    scaling: "각질",
    swelling: "부기",
    itching: "가려움",
    roughness: "거칠음",
  },
} as const;

export default ko;
