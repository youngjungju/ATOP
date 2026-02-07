## File Structure Overview

### Imports
- React: `useState`, `useEffect` (effect is imported but not used).
- Icon set from `lucide-react`:
  - `Activity`, `Droplets`, `Thermometer`, `Layers`, `Pill`, `FlaskConical`, `MapPin`,
    `Calendar`, `CheckCircle2`, `Bell`, `Navigation`, `User`, `Search`, `Zap`, `Wind`,
    `Plus`, `Clock`, `Heart`.
- `motion` from `framer-motion`.

### Mock Data (`DIAGNOSIS_DATA`)
- `subtype`: "Nummular Atopic Dermatitis"
- `confidence`: 94
- `description`: long clinical description string with references.
- `metrics` array (5 items):
  - Each item: `label`, `value` (1–10), `status`, `icon` (lucide element with size and color).
  - Labels: Redness, Scaling, Swelling, Itching, Roughness.
- `treatments` array (2 items):
  - Each item: `id`, `type`, `name`, `dosage`, `icon`.
  - Examples: Antihistamine (Pill), Hydrocortisone (FlaskConical).
- `referral` object:
  - `doctor`, `hospital`, `distance`.

### Sub-Components

#### `FadeInCard`
- Wrapper card with `motion.div`.
- Animation: fade + translate from below on in-view, once.
- Layout styles: white background, rounded 16px, padding 6, drop shadow, border.
- Used to wrap each major card section in the main layout.

#### `ConfidenceBadge`
- Props: `percentage`.
- Logic: if percentage > 80, use green theme; else amber.
- Renders small pill badge: `"{percentage}% Match"`.

#### `SeverityScale`
- Props: `status`, `value`.
- Color logic:
  - <=3: green.
  - 4–7: blue.
  - >7: red.
- Renders:
  - Top labels: Mild / Moderate / Severe (upper text with active color).
  - Middle bar: 10 blocks with active block animated by `motion.div` scale/opacity.
  - Bottom numbers: 1–10 tick marks with active highlight.

## Main App Component (`App`)

### State
- `reminders`: object keyed by treatment id.
- `selectedFeelings`: array of strings.
- `onPeriod`: boolean.
- `logCompliance`: `{ pill: boolean, ointment: boolean }`.

### Constants & Handlers
- `feelings`: ["Itchiness", "Stinging", "Dryness", "Burning", "Sensitive", "Normal"].
- `toggleFeeling(feeling)`: add/remove feeling from selected.
- `toggleReminder(id)`: toggle reminder flag for a treatment.

### Root Layout
- Full-height screen with light gray background.
- Typography: sans-serif, default text gray.
- Sticky header + main content container + floating action button.

## UI Structure & Components

### Header (Sticky)
- Left:
  - Overline: "Patient Portal" (uppercase, tracking).
  - Title: "Daily Care" (bold).
- Right: circular avatar button with `User` icon in blue.

### Main Container
- Max width: `max-w-md`, centered with padding.

#### Card #1: Active Treatment
- Wrapper: `FadeInCard`.
- Card background: light blue panel inside card.
- Section title: "Active Treatment".
- Treatment list:
  - Each item row: icon badge, name, dosage, reminder button.
  - Reminder button: toggles bell state, green when active.
- CTA button:
  - "Log Daily Usage" with `CheckCircle2` icon.
  - Full-width dashed border button.

#### Card #2: Status Update (Daily Input)
- Wrapper: `FadeInCard`.
- Header row:
  - Title: "Status Update".
  - Timestamp badge: `Clock` icon + "JUST NOW".

##### Feelings Selection
- Subtitle: "Current Feelings".
- Button group (wrap):
  - Each feeling is a pill button.
  - Selected state: blue background, white text, shadow.
  - Unselected state: white background, gray border.

##### Medical Log
- Subtitle: "Medical Log".
- Checkbox rows:
  - "Took Prescribed Pill" with `Pill` icon.
  - "Applied Ointment" with `FlaskConical` icon.
  - Each row: label + checkbox, colored icon badge toggles green.
- Divider line.
- Menstrual Cycle toggle:
  - Label with `Heart` icon.
  - Toggle switch: pink when on, gray when off.

##### Save Button
- Full-width dark button: "Save Daily Report".

#### Card #3: Analysis Result (Diagnosis Summary)
- Wrapper: `FadeInCard`.
- Header row:
  - Title: "Analysis Result".
  - `ConfidenceBadge` shows match percentage.
- Centered diagnosis text:
  - `DIAGNOSIS_DATA.subtype` in italic.
- Dual avatar comparison:
  - Left: "User Photo" circular placeholder.
  - Right: "Reference" circular placeholder.
  - Separated by thin horizontal line.

#### Card #4: Symptom Breakdown
- Wrapper: `FadeInCard`.
- Title: "Symptom Breakdown".
- Metrics list:
  - Each metric shows icon + label.
  - `SeverityScale` renders 1–10 visual scale.
- Description callout:
  - Gray panel with left blue border.
  - Uses `DIAGNOSIS_DATA.description` in italic.

#### Card #5: Recommended Care (Referral & Logistics)
- Wrapper: `FadeInCard`.
- Title: "Recommended Care".
- Doctor block:
  - Doctor name (bold).
  - Hospital name + distance badge.
- Map preview:
  - Placeholder grid with a bouncing `MapPin`.
- CTA buttons:
  - Primary: "Book Appointment" with `Calendar`.
  - Secondary: "Open in Maps" with `Navigation`.

### Footer Disclaimer
- Centered small text:
  - AI disclaimer and recommendation to see a dermatologist.

### Floating Action Button (FAB)
- Fixed bottom-right button with `Search` icon.
- Animated on hover/tap using `motion.button`.
