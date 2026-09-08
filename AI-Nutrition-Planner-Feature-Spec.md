# AI Nutrition Planner — Feature Specification & Competitive Analysis
BSc (Hons) AI — Individual Project | Stack: React · FastAPI · PostgreSQL · LLM

---

## 1. What's already out there (competitive scan)

| Product | What it does well | Where it falls short |
|---|---|---|
| **Cronometer** | Tracks 84+ micronutrients, strong trend charts | Clinical, overwhelming UI; no plain-language "why" behind the numbers; AI features are paywalled |
| **Supplements AI** | Deficiency probability scoring, timing/interaction guidance | Focused on supplement stacks, not full diet context; no weekly narrative |
| **NutriScan** | Chatbot nutritionist, adjustable 28-day plans | General wellness coaching, not nutrient-gap-specific |
| **Intake** | Wearable sync, adherence-focused nudges | No dedicated weekly nutrient deficiency report |
| **miora** (agentic) | Proactively orders supplements/groceries to close a gap | Consumer/commercial product, not something you build for a coursework scope; raises autonomy and safety questions |

**The gap your project can own:** none of these combine (a) a **weekly** (not daily) rollup, (b) an **LLM-generated plain-English explanation** of *why* a nutrient is low and what it means for the user's body, and (c) **cautious, non-prescriptive supplement suggestions** with a clear "talk to a doctor" boundary — while staying open, inspectable, and academically demonstrable (not a black-box commercial app). That's your positioning statement for the report/viva.

---

## 2. Core concept, restated

> A user logs meals over a week → the system aggregates nutrient intake → compares against RDA/RNI reference values → an LLM turns the resulting gaps into a short, understandable weekly report with general supplement/food suggestions.

Everything below is organised so you can **descope to an MVP** and still have a coherent, gradeable system, then add depth if time allows.

---

## 3. Feature breakdown by module

### 3.1 Onboarding & profile
- Sign up / login (email + JWT, or OAuth if time allows)
- Basic biometrics: age, sex, height, weight, activity level
- Goals: general health, weight loss/gain, muscle gain, deficiency management
- Dietary pattern: omnivore, vegetarian, vegan, pescatarian, keto, etc.
- Allergies / intolerances / medical flags (e.g. pregnancy — used to gate risky suggestions, not to diagnose)
- Computes personalised RDA/RNI targets (from a reference table, e.g. NIH/EFSA values) — this becomes the baseline every weekly report compares against

### 3.2 Meal & food logging
- Manual search-and-log against a food/nutrient database (USDA FoodData Central or similar is free and importable into Postgres)
- Quantity/serving-size adjustment
- **Stretch:** barcode scan (Open Food Facts API) or photo-based logging (vision model estimates food type + portion)
- Daily log view, editable entries, "copy yesterday" convenience action

### 3.3 Weekly nutrient analysis engine
- Aggregates 7 days of logged intake per nutrient (macros + key micros: iron, B12, D, calcium, magnesium, omega-3, fiber, etc.)
- Compares totals/averages against the user's personalised targets
- Flags nutrients as **deficient / borderline / adequate / excessive**
- Confidence/completeness indicator (e.g. "5 of 7 days logged — results are partial") — important both for UX honesty and for your evaluation section
- This module is pure backend logic (FastAPI + PostgreSQL aggregation queries) — no LLM needed here, which keeps it deterministic, testable, and citable in your methodology chapter

### 3.4 LLM explanation layer
- Takes the structured output of 3.3 (JSON: nutrient, status, magnitude of gap) and prompts an LLM to generate:
  - A short weekly summary in plain English
  - Why that nutrient matters (general physiology, not medical diagnosis)
  - Practical food-first suggestions before supplement suggestions
- **Design discipline that will impress markers:** don't let the LLM see raw numbers and freestyle a diagnosis — pass it a constrained, pre-computed structured summary and instruct it to explain, not to invent numbers or make medical claims. This is a good place to demonstrate **prompt engineering + guardrails** as a contribution, and to discuss hallucination risk in your evaluation chapter.
- Cache/store generated explanations (don't regenerate identical reports) — good for cost control and for demonstrating system design maturity

### 3.5 Supplement advisor
- Maps deficient nutrients → general supplement categories (not brand/dosage prescriptions)
- Clear, persistent disclaimer: informational only, not medical advice, consult a healthcare provider before starting any supplement
- Optional: food-based alternatives ranked above supplements (e.g. "iron: spinach, lentils, red meat" before "iron supplement")

### 3.6 Insights dashboard
- Weekly trend charts per nutrient (recharts fits your React stack well)
- History view — compare this week vs last week
- "Nutrient of the week" spotlight card
- Export/share the weekly report (PDF)

### 3.7 Notifications & reminders
- Logging reminders (push/email)
- "Your weekly report is ready" notification
- **Stretch:** streak/consistency nudges

### 3.8 Integrations & data sources
- USDA FoodData Central / Open Food Facts for nutrient data
- **Stretch:** wearable sync (Fitbit/Google Fit) for activity level, which adjusts nutrient targets
- **Stretch:** OCR on nutrition labels for packaged food logging

---

## 4. Suggested MVP scope (what to actually build first)

Given this is an individual capstone with a defined deadline, prioritise a **vertical slice** over breadth:

1. Auth + profile with computed RDA targets
2. Manual meal logging against a seeded nutrient database
3. Weekly aggregation engine (deterministic, well-tested)
4. LLM explanation generation with guardrailed prompting
5. Dashboard with trend charts
6. Basic supplement suggestion mapping + disclaimer

Treat barcode/photo logging, wearable sync, and notifications as **stretch goals** you mention in "future work" if time runs out — examiners respond well to a clearly-scoped MVP with a documented extension roadmap, more than a half-finished feature-complete list.

---

## 5. Architecture notes for your stack

- **PostgreSQL:** normalize `users`, `profiles`, `food_items`, `nutrients`, `food_nutrients` (join table), `logs`, `weekly_reports`. Store the LLM's structured input and output alongside each `weekly_reports` row for reproducibility/auditability — useful evidence for your evaluation chapter.
- **FastAPI:** separate the deterministic analysis service (3.3) from the LLM service (3.4) as distinct modules/routers, so you can unit-test the math independently of the LLM — examiners like seeing testable, decoupled logic.
- **LLM layer:** use structured JSON input → constrained prompt → structured JSON or markdown output. Log prompts/responses during development for your report's "prompt engineering" discussion.
- **React:** keep the dashboard and logging flows as separate route groups; recharts or Chart.js for trend visualization.

---

## 6. Where this differentiates from existing systems (for your report's justification section)

- Weekly (not daily) framing — reduces noise, matches how deficiencies actually manifest physiologically
- Explanation-first, not just a number — addresses the "information overload" complaint seen against Cronometer
- Transparent, non-commercial supplement suggestions — no upsell logic, unlike consumer apps
- Deterministic analysis + LLM explanation split — a defensible, explainable AI design choice you can discuss under responsible AI / explainability in your literature review

---

## 7. Suggested evaluation metrics

- Accuracy of nutrient aggregation against manually-calculated ground truth (unit tests)
- Usability testing (SUS score) with a handful of test users
- LLM explanation quality: human-rated clarity/accuracy on a sample of generated reports, and a hallucination check against the structured input
- System performance: report generation latency
