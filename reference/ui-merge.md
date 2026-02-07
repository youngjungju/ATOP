# UI Design Integration Plan — `app/report/[id]/page.tsx`

> **Goal**: Refactor the current report page to adopt the component-based layout from `.ui-design-ref/app/report/[id]/page.tsx`, reusing the shared UI components in `app/components/`, while preserving the existing data-fetching logic (sessionStorage by route `[id]`).

---

## 0. Functional Logic Preservation Rules

**This integration is UI-only.** The following rules are non-negotiable:

1. **Do NOT modify data fetching** — `useParams()`, `sessionStorage.getItem`, `Report` type, `useEffect` logic stay exactly as-is.
2. **Do NOT modify data flow** — No changes to how `app/page.tsx` → `app/upload/page.tsx` → `/api/analyze` → sessionStorage → `router.push` works.
3. **Do NOT drop any API data field** — All 8 fields of the `Report` type must remain visible in the rendered output:
   - `summary` — displayed as paragraph text (NOT as a heading/subtype)
   - `visual_observations` — displayed as list or description
   - `user_reported_symptoms` — displayed as tag/pill list
   - `current_medications` — displayed in `ActiveTreatmentCard` or as a list
   - `duration_of_symptoms` — displayed when present
   - `possible_non_diagnostic_causes` — displayed as list
   - `general_advice` — displayed as list
   - `disclaimer` — displayed as disclaimer text
4. **Do NOT remove existing navigation** — The "New Report" link to `/upload` must remain accessible from the report view.
5. **Do NOT alter error/loading behavior** — `notFound` and loading states must keep the same conditional logic; only CSS classes may change.
6. **Do NOT modify any file other than `app/report/[id]/page.tsx`** — Components in `app/components/` are used as-is; `app/page.tsx` and `app/upload/page.tsx` are not touched.

---

## 1. Architecture Overview

### Current Report Page (`app/report/[id]/page.tsx`)
- **Data source**: `sessionStorage` keyed by dynamic route param `[id]` — stores both the API response JSON and the base64 image.
- **Navigation flow**: User uploads photo on `app/page.tsx` → redirected to `app/upload/page.tsx` → form submitted to `/api/analyze` → response + image stored in sessionStorage → `router.push(/report/{uuid})`.
- **Layout**: Flat list of inline `<section>` elements with Tailwind utility classes (zinc color palette, `rounded-2xl` cards). No animations, no reusable components.
- **Report type shape**:
  ```ts
  type Report = {
    summary: string;
    visual_observations: string[];
    user_reported_symptoms: string[];
    current_medications: string[];
    duration_of_symptoms: string;
    possible_non_diagnostic_causes: string[];
    general_advice: string[];
    disclaimer: string;
  };
  ```

### Target Report Page (`.ui-design-ref/app/report/[id]/page.tsx`)
- **Data source**: Uses `searchParams` (query string) — **this must NOT be adopted**; keep the existing sessionStorage approach.
- **Layout**: Mobile-first card-based layout (`max-w-md`) using shared components with `framer-motion` animations, `BottomSheetDialog` overlays, and a refined `#F8F9FA` background.
- **Component tree**:
  ```
  <div>                          ← page wrapper
    <Header />                   ← sticky nav bar
    <main>
      <DiagnosisSummaryCard />   ← image + confidence badge + subtype
      <SymptomBreakdownCard />   ← severity sliders + description quote
      Action Buttons (grid)      ← "My Prescriptions" / "Body Condition Check"
      <ClinicalReferralCard />   ← doctor referral + map + CTA
      Disclaimer text            ← centered footer disclaimer
    </main>
    <BottomSheetDialog>          ← "My Prescriptions"
      <ActiveTreatmentCard />
    </BottomSheetDialog>
    <BottomSheetDialog>          ← "Body Condition Check"
      <StatusUpdateCard />
    </BottomSheetDialog>
  </div>
  ```

---

## 2. Components Inventory & Props Mapping

Below is every component from `app/components/` and how it maps to the API report data.

### 2.1 `Header`
| Prop | Type | Source |
|------|------|--------|
| *(none — static)* | — | Renders "Patient Portal / Daily Care" with a user icon. |

**Action**: Use as-is. No props needed.

---

### 2.2 `FadeInCard`
| Prop | Type | Source |
|------|------|--------|
| `children` | `ReactNode` | Content to wrap |
| `delay` | `number` (optional) | Stagger animation offset |

**Action**: Used internally by other card components. No direct usage needed in the page.

---

### 2.3 `ConfidenceBadge`
| Prop | Type | Source |
|------|------|--------|
| `percentage` | `number` | Currently sourced from `DIAGNOSIS_DATA.confidence` (mock: `94`). |

**Action**: The API response does **not** return a confidence score. Two options:
- **Option A (recommended for now)**: Continue using the mock value from `DIAGNOSIS_DATA.confidence` until the API is extended.
- **Option B (future)**: Extend `/api/analyze` to return a `confidence` field, then pass it as a prop.

---

### 2.4 `SeverityScale`
| Prop | Type | Source |
|------|------|--------|
| `status` | `string` | `"Mild"` / `"Moderate"` / `"Severe"` |
| `value` | `number` (1–10) | Current slider position |
| `onChange` | `(value: number) => void` | Optional handler |

**Action**: Used internally by `SymptomBreakdownCard`. The metrics array comes from `DIAGNOSIS_DATA.metrics` (mock). See Section 3.3 for how to drive this from real data.

---

### 2.5 `DiagnosisSummaryCard`
| Prop | Type | Source |
|------|------|--------|
| `imageUrl` | `string` (optional) | **Map from** `imageData` (base64 string retrieved from sessionStorage via `report-image-{id}`) |
| `subtype` | `string` (optional) | **Map from** `report.summary` — the API's summary text can serve as the diagnosis title. Falls back to `DIAGNOSIS_DATA.subtype` if not provided. |

**Action**: Pass `imageUrl={imageData}` only. Do **not** pass `report.summary` as `subtype` — the `subtype` prop expects a short diagnosis label (e.g., "Nummular Atopic Dermatitis") rendered as a `text-2xl font-bold italic` heading, while `report.summary` is a full paragraph from the API. Passing it here would break layout and misrepresent the data. Leave `subtype` unset (falls back to `DIAGNOSIS_DATA.subtype`). Display `report.summary` in its own dedicated `FadeInCard` section instead (see Section 3.2).

---

### 2.6 `SymptomBreakdownCard`
| Prop | Type | Source |
|------|------|--------|
| `description` | `string` (optional) | **Map from** a joined string of `report.visual_observations`. Falls back to `DIAGNOSIS_DATA.description`. |

**Current limitation**: The severity slider metrics (Redness, Scaling, Swelling, Itching, Roughness) are hardcoded in `DIAGNOSIS_DATA.metrics`. The API does **not** return structured severity scores.

**Action for now**: Pass `description={report.visual_observations.join(" ")}`. The sliders will display mock severity data. Future work can extend the API to return per-symptom severity values.

---

### 2.7 `ClinicalReferralCard`
| Prop | Type | Source |
|------|------|--------|
| *(none — static)* | — | Displays hardcoded referral info from `DIAGNOSIS_DATA.referral`. |

**Action**: Use as-is. In the future, this can be driven by location services or API data.

---

### 2.8 `ActiveTreatmentCard`
| Prop | Type | Source |
|------|------|--------|
| `reminders` | `Record<number, boolean>` | Local state managed in the page |
| `onToggleReminder` | `(id: number) => void` | Callback to toggle reminder state |
| `medications` | `Array<{ name, time, type }>` (optional) | **Map from** `report.current_medications` — needs transformation (see Section 3.4) |

**Action**: Transform `report.current_medications` (string array) into the `medications` prop format. If medications are empty, the component falls back to mock data.

---

### 2.9 `StatusUpdateCard`
| Prop | Type | Source |
|------|------|--------|
| `selectedFeelings` | `string[]` | Local state |
| `onToggleFeeling` | `(feeling: string) => void` | Callback |
| `logCompliance` | `{ pill: boolean; ointment: boolean }` | Local state |
| `onToggleLogCompliance` | `(key: 'pill' \| 'ointment') => void` | Callback |
| `onPeriod` | `boolean` | Local state |
| `onTogglePeriod` | `() => void` | Callback |

**Action**: Purely interactive — no API data needed. Wire up local state handlers identical to the reference implementation.

---

### 2.10 `BottomSheetDialog`
| Prop | Type | Source |
|------|------|--------|
| `open` | `boolean` | Local state (`prescriptionsOpen`, `conditionOpen`) |
| `onClose` | `() => void` | State setter |
| `title` | `string` | Static label |
| `children` | `ReactNode` | `ActiveTreatmentCard` or `StatusUpdateCard` |

**Action**: Use as-is with two dialog instances.

---

### 2.11 `FloatingSearchButton`
| Prop | Type | Source |
|------|------|--------|
| *(none — static)* | — | Floating blue search FAB. |

**Action**: Optionally include at the bottom of the page. The reference design does not use it on the report page, so it can be omitted or added later.

---

## 3. Data Transformation Layer

The API response shape differs from what the UI components expect. A transformation layer is needed inside the report page.

### 3.1 Keep Existing Data Fetching
```ts
// No change — keep the sessionStorage approach
useEffect(() => {
  if (!id) return;
  const stored = sessionStorage.getItem(`report-${id}`);
  const img = sessionStorage.getItem(`report-image-${id}`);
  if (stored) {
    try {
      setReport(JSON.parse(stored) as Report);
      setImageData(img);
    } catch {
      setNotFound(true);
    }
  } else {
    setNotFound(true);
  }
}, [id]);
```

### 3.2 Summary → Dedicated FadeInCard (NOT DiagnosisSummaryCard)

> **Why not `subtype`?** The `DiagnosisSummaryCard` renders `subtype` as `<h3 className="text-2xl font-bold text-gray-800 leading-tight italic">`. The API's `report.summary` is a full paragraph — displaying it as a large italic heading would break layout and change the data's semantic meaning. This would be a functional change, not a UI change.

```tsx
{/* Image only — subtype falls back to DIAGNOSIS_DATA.subtype */}
<DiagnosisSummaryCard imageUrl={imageData ?? undefined} />

{/* Summary — preserved as readable paragraph in its own card */}
<FadeInCard delay={0.15}>
  <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">Summary</h2>
  <p className="text-sm text-gray-600 leading-relaxed">{report.summary}</p>
</FadeInCard>
```

### 3.3 Visual Observations → SymptomBreakdownCard
```ts
<SymptomBreakdownCard
  description={report.visual_observations.join(" ")}
/>
```
> **Future enhancement**: Parse `report.visual_observations` and `report.user_reported_symptoms` to produce structured `{ label, value, status, icon }` objects, replacing the hardcoded `DIAGNOSIS_DATA.metrics`. This would require either:
> - An updated API response with severity scores per symptom, OR
> - A client-side heuristic to estimate severity from the text descriptions.

### 3.4 User-Reported Symptoms → Dedicated FadeInCard (preserving API data)

> **Why not `StatusUpdateCard`?** The `StatusUpdateCard` is a new **interactive daily tracker** with hardcoded feelings (`["Itchiness", "Stinging", "Dryness", "Burning", "Sensitive", "Normal"]`). It does NOT display the API-returned `report.user_reported_symptoms` which contains the actual symptoms the user selected during upload (e.g., "itching", "redness", "pain"). These are completely different data sets — one is historical input, the other is a future-facing form. Conflating them would destroy existing data.

```tsx
{report.user_reported_symptoms.length > 0 && (
  <FadeInCard delay={0.25}>
    <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
      User-Reported Symptoms
    </h2>
    <div className="flex flex-wrap gap-2">
      {report.user_reported_symptoms.map((s, i) => (
        <span
          key={i}
          className="rounded-full bg-[#4A90E2]/10 px-3 py-1.5 text-xs font-semibold text-[#4A90E2]"
        >
          {s}
        </span>
      ))}
    </div>
  </FadeInCard>
)}
```

### 3.5 Duration of Symptoms → Dedicated FadeInCard (preserving API data)

The current page conditionally renders `duration_of_symptoms` when present. This must remain visible.

```tsx
{report.duration_of_symptoms && (
  <FadeInCard delay={0.28}>
    <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-tight">
      Duration of Symptoms
    </h2>
    <p className="text-sm text-gray-600">{report.duration_of_symptoms}</p>
  </FadeInCard>
)}
```

### 3.6 Medications → ActiveTreatmentCard
```ts
const medicationProps = report.current_medications.map((med) => ({
  name: med,
  time: "morning",    // default — API doesn't specify timing
  type: "oral",       // default — API doesn't specify type
}));

// In JSX:
<ActiveTreatmentCard
  reminders={reminders}
  onToggleReminder={handleToggleReminder}
  medications={medicationProps.length > 0 ? medicationProps : undefined}
/>
```

### 3.7 Section-by-Section Migration Map

Every inline `<section>` from the current page maps to a new component. **No data field is dropped.**

| Current Section | Replaced By | Data Preserved? |
|----------------|-------------|-----------------|
| "Uploaded Image" `<section>` | `DiagnosisSummaryCard` (image in circular frame + confidence badge) | Yes — `imageData` passed as `imageUrl` prop |
| "Summary" `<section>` | Dedicated `FadeInCard` with paragraph text (NOT `DiagnosisSummaryCard.subtype`) | Yes — `report.summary` displayed as `<p>` |
| "Visual Observations" `<section>` | `SymptomBreakdownCard` `description` prop (observations joined into quoted paragraph) | Yes — all text preserved, list structure flattened to paragraph (see note below) |
| "User-Reported Symptoms" `<section>` | Dedicated `FadeInCard` with tag/pill display | Yes — `report.user_reported_symptoms` rendered as styled tags |
| "Current Medications" `<section>` | `ActiveTreatmentCard` via `BottomSheetDialog` | Yes — `report.current_medications` passed as `medications` prop |
| "Duration of Symptoms" `<section>` | Dedicated `FadeInCard` (conditionally rendered) | Yes — `report.duration_of_symptoms` displayed when present |
| "Possible Non-Diagnostic Causes" `<section>` | `FadeInCard` with bullet list | Yes — each cause rendered as list item |
| "General Advice" `<section>` | `FadeInCard` with bullet list | Yes — each advice item rendered as list item |
| Disclaimer amber `<section>` | Centered text at bottom of `<main>` | Yes — `report.disclaimer` text used verbatim |
| "New Report" `<Link>` in header | `<Link>` below `<Header />` component | Yes — `/upload` navigation preserved |

> **Note on Visual Observations**: The current page renders each observation as a separate `<li>` inside a bordered card. The new design joins them into a single `description` string for `SymptomBreakdownCard`, which renders it as an italic quoted paragraph. The text content is fully preserved but the individual list structure is flattened. This is a presentation change, not a data loss.

---

## 4. Detailed Refactoring Steps

### Step 1 — Add Dependencies
Ensure `framer-motion` and `lucide-react` are installed (required by the UI components):
```bash
npm ls framer-motion lucide-react
# If missing:
npm install framer-motion lucide-react
```

### Step 2 — Update Imports
Replace the current import block with:
```ts
"use client";

import React, { useState, useCallback } from 'react';
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import Link from "next/link";
import {
  Header,
  DiagnosisSummaryCard,
  SymptomBreakdownCard,
  ClinicalReferralCard,
  ActiveTreatmentCard,
  StatusUpdateCard,
  BottomSheetDialog,
  FadeInCard,
} from '@/app/components';
```

### Step 3 — Keep the `Report` Type and Data Fetching
Keep the existing `Report` type definition and the `useEffect` that reads from `sessionStorage`. Keep the `useParams()` hook. Do **not** switch to `searchParams`.

### Step 4 — Add Local State for Interactive Components
Add the following state declarations (mirroring the reference design):
```ts
// Dialog state
const [prescriptionsOpen, setPrescriptionsOpen] = useState(false);
const [conditionOpen, setConditionOpen] = useState(false);

// ActiveTreatmentCard state
const [reminders, setReminders] = useState<Record<number, boolean>>({});
const handleToggleReminder = useCallback((id: number) => {
  setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
}, []);

// StatusUpdateCard state
const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
const [logCompliance, setLogCompliance] = useState({ pill: false, ointment: false });
const [onPeriod, setOnPeriod] = useState(false);

const handleToggleFeeling = useCallback((feeling: string) => {
  setSelectedFeelings((prev) =>
    prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
  );
}, []);

const handleToggleLogCompliance = useCallback((key: 'pill' | 'ointment') => {
  setLogCompliance((prev) => ({ ...prev, [key]: !prev[key] }));
}, []);

const handleTogglePeriod = useCallback(() => {
  setOnPeriod((prev) => !prev);
}, []);
```

### Step 5 — Prepare Data Transformations
Add a `useMemo` or inline computation for the medication prop:
```ts
const medicationProps = report
  ? report.current_medications.map((med) => ({
      name: med,
      time: "morning" as const,
      type: "oral" as const,
    }))
  : [];
```

### Step 6 — Rewrite the JSX Return
Replace the current `<main>` content with the reference layout structure. The complete JSX should be:

```tsx
return (
  <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-10">
    <Header />

    {/* Preserved navigation — "New Report" link (replaces old header <Link>) */}
    <div className="max-w-md mx-auto px-5 pt-3 pb-1 flex justify-end">
      <Link
        href="/upload"
        className="text-xs font-bold text-[#4A90E2] hover:underline"
      >
        + New Report
      </Link>
    </div>

    <main className="max-w-md mx-auto px-5 pt-2">
      {/* ── report.imageData ── */}
      {/* Primary diagnosis card with uploaded image (image only, subtype uses mock) */}
      <DiagnosisSummaryCard
        imageUrl={imageData ?? undefined}
      />

      {/* ── report.summary ── */}
      {/* Summary — preserved as readable paragraph (NOT crammed into subtype heading) */}
      <FadeInCard delay={0.15}>
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">Summary</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{report.summary}</p>
      </FadeInCard>

      {/* ── report.visual_observations ── */}
      {/* Symptom breakdown with severity sliders + observations as quoted description */}
      <SymptomBreakdownCard
        description={report.visual_observations.join(" ")}
      />

      {/* ── report.user_reported_symptoms ── */}
      {/* Preserved from API data — these are the symptoms the user selected during upload */}
      {report.user_reported_symptoms.length > 0 && (
        <FadeInCard delay={0.25}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
            User-Reported Symptoms
          </h2>
          <div className="flex flex-wrap gap-2">
            {report.user_reported_symptoms.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-[#4A90E2]/10 px-3 py-1.5 text-xs font-semibold text-[#4A90E2]"
              >
                {s}
              </span>
            ))}
          </div>
        </FadeInCard>
      )}

      {/* ── report.duration_of_symptoms ── */}
      {/* Preserved from API data — conditionally rendered when present */}
      {report.duration_of_symptoms && (
        <FadeInCard delay={0.28}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-tight">
            Duration of Symptoms
          </h2>
          <p className="text-sm text-gray-600">{report.duration_of_symptoms}</p>
        </FadeInCard>
      )}

      {/* Action buttons grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-2 gap-3 mb-5"
      >
        <button
          onClick={() => setPrescriptionsOpen(true)}
          className="flex flex-col items-center gap-2 bg-white rounded-[16px] p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#4A90E2]/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer group"
        >
          <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#4A90E2]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 0 1-1.591.659H9.061a2.25 2.25 0 0 1-1.591-.659L5 14.5m14 0H5" />
            </svg>
          </span>
          <span className="text-xs font-bold text-gray-700 text-center leading-tight">My Prescriptions</span>
          <span className="text-[10px] text-gray-400 text-center leading-snug">Log current medications</span>
        </button>

        <button
          onClick={() => setConditionOpen(true)}
          className="flex flex-col items-center gap-2 bg-white rounded-[16px] p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#50C878]/30 hover:shadow-md active:scale-[0.97] transition-all cursor-pointer group"
        >
          <span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#50C878]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </span>
          <span className="text-xs font-bold text-gray-700 text-center leading-tight">Body Condition Check</span>
          <span className="text-[10px] text-gray-400 text-center leading-snug">Report how you feel</span>
        </button>
      </motion.div>

      {/* ── report.possible_non_diagnostic_causes ── */}
      {report.possible_non_diagnostic_causes.length > 0 && (
        <FadeInCard delay={0.35}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
            Possible Non-Diagnostic Causes
          </h2>
          <p className="text-[10px] text-gray-400 mb-3">
            These are examples only — not a diagnosis.
          </p>
          <ul className="space-y-2">
            {report.possible_non_diagnostic_causes.map((cause, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#4A90E2] flex-shrink-0" />
                {cause}
              </li>
            ))}
          </ul>
        </FadeInCard>
      )}

      {/* ── report.general_advice ── */}
      {report.general_advice.length > 0 && (
        <FadeInCard delay={0.4}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-tight">
            General Advice
          </h2>
          <ul className="space-y-2">
            {report.general_advice.map((advice, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#50C878] flex-shrink-0" />
                {advice}
              </li>
            ))}
          </ul>
        </FadeInCard>
      )}

      {/* Clinical referral */}
      <ClinicalReferralCard />

      {/* ── report.disclaimer ── */}
      <div className="text-center py-6">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10 leading-loose">
          {report.disclaimer}
        </p>
      </div>
    </main>

    {/* ── report.current_medications (via BottomSheetDialog) ── */}
    <BottomSheetDialog
      open={prescriptionsOpen}
      onClose={() => setPrescriptionsOpen(false)}
      title="My Prescriptions"
    >
      <ActiveTreatmentCard
        reminders={reminders}
        onToggleReminder={handleToggleReminder}
        medications={medicationProps.length > 0 ? medicationProps : undefined}
      />
    </BottomSheetDialog>

    {/* Body Condition Check dialog (new interactive feature, not replacing existing data) */}
    <BottomSheetDialog
      open={conditionOpen}
      onClose={() => setConditionOpen(false)}
      title="Body Condition Check"
    >
      <StatusUpdateCard
        selectedFeelings={selectedFeelings}
        onToggleFeeling={handleToggleFeeling}
        logCompliance={logCompliance}
        onToggleLogCompliance={handleToggleLogCompliance}
        onPeriod={onPeriod}
        onTogglePeriod={handleTogglePeriod}
      />
    </BottomSheetDialog>
  </div>
);
```

> **Data field audit for the JSX above** — every `Report` field is accounted for with `── report.X ──` comments:
> - `summary` → FadeInCard paragraph
> - `visual_observations` → SymptomBreakdownCard description
> - `user_reported_symptoms` → FadeInCard tag/pill list
> - `current_medications` → ActiveTreatmentCard in BottomSheetDialog
> - `duration_of_symptoms` → FadeInCard (conditional)
> - `possible_non_diagnostic_causes` → FadeInCard bullet list
> - `general_advice` → FadeInCard bullet list
> - `disclaimer` → centered footer text

### Step 7 — Keep Error & Loading States
Preserve the existing `notFound` and loading returns but update their styling to match the new design system:
```tsx
// Not found state
if (notFound || !id) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-gray-500 font-medium">Report not found or expired.</p>
      <Link
        href="/upload"
        className="rounded-xl bg-[#4A90E2] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200"
      >
        Create New Report
      </Link>
    </div>
  );
}

// Loading state
if (!report) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <p className="text-gray-400 font-medium">Loading report...</p>
    </div>
  );
}
```

---

## 5. Visual & Styling Changes Summary

| Aspect | Current | After Integration |
|--------|---------|-------------------|
| Background | `bg-zinc-50` | `bg-[#F8F9FA]` |
| Max width | `max-w-4xl` | `max-w-md` (mobile-first) |
| Card style | `rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm` | `rounded-[16px] bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50` (via `FadeInCard`) |
| Typography | Zinc palette (`text-zinc-700`) | Gray palette (`text-gray-700`, `text-gray-400` for labels) |
| Section headers | `text-sm font-semibold text-zinc-700` | `text-sm font-bold text-gray-400 uppercase tracking-tight` |
| Animations | None | `framer-motion` fade-in on scroll (`whileInView`) |
| Navigation | Inline `<Link>` "New Report" button in page header | `<Header />` sticky bar + separate `<Link>` "New Report" below it (navigation preserved) |
| Image display | Rectangular `h-80 w-full object-cover` | Circular `w-20 h-20` frames with border accents |
| Symptoms | Static pill list | Interactive severity sliders (1–10) |
| Medications | Static text list | `ActiveTreatmentCard` with reminder toggles inside `BottomSheetDialog` |
| Disclaimer | Amber-bordered box | Centered uppercase text at page bottom |

---

## 6. Files Changed

| File | Action |
|------|--------|
| `app/report/[id]/page.tsx` | **Rewrite** — replace JSX + imports, add local state, keep data-fetching |
| `app/components/*` | **No changes** — used as-is |
| `app/page.tsx` | **No changes** — upload flow remains the same |
| `app/upload/page.tsx` | **No changes** — form submission + sessionStorage storage unchanged |

---

## 7. Known Gaps & Future Enhancements

> These are **cosmetic/feature gaps** in the UI components only. No existing functional logic is affected.

| Gap | Impact | Suggested Fix |
|-----|--------|---------------|
| No confidence score from API | `ConfidenceBadge` shows mock `94%` | Extend `/api/analyze` to return `confidence: number` |
| No per-symptom severity from API | `SeverityScale` sliders show mock values | Extend API to return `metrics: { label, severity }[]` |
| Referral data is hardcoded | `ClinicalReferralCard` always shows "Dr. Jane Smith" | Integrate location/referral service or add referral data to API response |
| Medications lack type/timing | `ActiveTreatmentCard` defaults all to "oral / morning" | Extend API to return structured medication objects `{ name, type, timing }` |
| `DiagnosisSummaryCard.subtype` uses mock | Shows "Nummular Atopic Dermatitis" instead of real diagnosis | Extend API to return a short `diagnosis_label` field |
| `visual_observations` list structure flattened | Individual observations joined into one paragraph | Optionally add a separate expandable list alongside the SymptomBreakdownCard |
| `FloatingSearchButton` not used | Available but not in reference layout | Add if a search feature is needed later |

---

## 8. Pre-Integration Checklist

**Dependencies:**
- [ ] Confirm `framer-motion` is installed (`npm ls framer-motion`)
- [ ] Confirm `lucide-react` is installed (`npm ls lucide-react`)
- [ ] Verify all components in `app/components/index.ts` export correctly

**Functional Logic Preservation (critical):**
- [ ] `Report` type definition is identical to the original
- [ ] `useParams()` + `sessionStorage.getItem` data-fetching `useEffect` is unchanged
- [ ] `notFound` / loading conditional returns have same logic (only CSS classes changed)
- [ ] All 8 `Report` fields are rendered in the JSX (see `── report.X ──` comments)
- [ ] `report.summary` is displayed as paragraph text, NOT as `DiagnosisSummaryCard.subtype`
- [ ] `report.user_reported_symptoms` has its own dedicated section (NOT replaced by `StatusUpdateCard`)
- [ ] `report.duration_of_symptoms` has its own dedicated section (conditionally rendered)
- [ ] "New Report" `<Link href="/upload">` remains accessible from the report view
- [ ] No changes made to `app/page.tsx`, `app/upload/page.tsx`, or `app/components/*`

**UI & UX:**
- [ ] Test the upload flow end-to-end: `page.tsx` → `upload/page.tsx` → `/api/analyze` → `report/[id]`
- [ ] Verify sessionStorage data shape matches the `Report` type
- [ ] After refactoring, test on mobile viewport (target: `max-w-md` = 448px)
- [ ] Verify `framer-motion` animations render without layout shifts
- [ ] Verify both `BottomSheetDialog` instances open/close correctly
- [ ] Verify the uploaded image displays in the `DiagnosisSummaryCard` circular frame
