# SPARTA — Live Call Assistant (V2)

SPARTA is a real-time call-flow copilot for UK telephone-services sales and customer support conversations. Designed specifically to help advisors conduct a **natural, calm, friendly, easy-to-follow conversation**, especially with older UK consumers, while strictly maintaining Ofcom compliance, transparency, and data security.

---

## Key Features & Architecture

### 1. Finite-State Conversation Engine
- Complete, non-rigid 16-stage finite-state machine:
  - `OPENING` & `BILL_RESPONSIBILITY` (Natural identification, no artificial small talk)
  - `RAPPORT` (1-sentence authentic responses)
  - `SERVICE_DISCOVERY` (Landline voice only vs Broadband bundles)
  - `ISSUE_CHECK` & `ISSUE_ESCALATION` (Service health screening prior to commercial discussion)
  - `BILL_DISCOVERY` (Baseline payment estimation & saving calculations)
  - `OFFER_INTRO` & `OFFER_EXPLANATION` (Up to 30% reduction; clear 4-pillar reassurance on unchanged service, contract, & hardware)
  - `OFFER_INTEREST` ("Does that make sense so far?" — no aggressive sales closing)
  - `ELIGIBILITY` (DOB age bracket verification against 1943–1960 campaign rules)
  - `CUSTOMER_DETAILS` (Sequential, unhurried name and address capture)
  - `PAYMENT_CONSENT` (Mandatory regulatory gate with 6 core disclosure rules)
  - `PAYMENT_DETAILS` (Direct Debit Sort Code & Account Number validation & masking)
  - `ADDITIONAL_DETAILS` (Screening for medical alarms & lifeline pendants)
  - `FINAL_REVIEW` (Transparent customer confirmation)
  - `CLOSE` & `CALL_SUMMARY` (Sanitized audit summary without sensitive banking data)

### 2. Multi-Version Script Lines & Audio Cadence
- Every core step provides three calibrated variants:
  - **PRIMARY**: Natural, full British English sentence.
  - **SHORT**: Crisp version for impatient or busy callers.
  - **EXPLAIN**: Slower, clearer version for confused or elderly customers.
- Interactive switching buttons: `[USE LINE]`, `[SHORTEN]`, `[SLOW DOWN]`, `[EXPLAIN]`, `[WHY?]`.
- Speech Cadence Preview (`Listen Cadence` button) leveraging browser speech synthesis with British English pacing.

### 3. Adaptive Customer Mood & Pacing Engine
- 7 conversation behavior modes:
  - 😊 **Comfortable**: Standard calm British pace.
  - 🐢 **Elderly / Slow Pace**: 1 question per step, shorter sentences, gentle pauses.
  - ❓ **Confused**: Immediate reassurance that equipment and provider stay identical.
  - 🛡️ **Suspicious**: Focus on privacy, no card numbers, and independent verification.
  - ⏱️ **Impatient**: Skips pleasantries, leads with the commercial benefit.
  - 💬 **Talkative**: Includes polite redirection buttons (`[LET THEM FINISH]`, `[BRING BACK TO CALL]`, `[ACKNOWLEDGE + CONTINUE]`).
  - ⚠️ **Vulnerability Concern**: Automatic supervisor escalation trigger.

### 4. 18+ UK Objection Resolution Library
- Searchable objection directory addressing real customer hesitations:
  - *Not Interested*, *Too Busy*, *Is this a scam?*, *Why do you need bank details?*, *Why DOB?*, *I don't want to change my contract*, *Send it in writing*, *I need to speak to my family*, *What exactly changes?*, etc.
  - Each item includes Primary response, Short version, Explanation, Next action, and Hard Stop conditions (e.g. never argue, never say "definitely not a scam").

### 5. Multi-View Operational Modes
- 🎯 **Production Mode**: Full balanced co-pilot view with live script, progress, checklist, and advisor notes.
- ⚡ **Quick Mode**: Minimalist view with Objective, Say, and Next Action for high-velocity advisors.
- 🎓 **Training Mode**: Deep coaching drawer explaining why each question is asked, required fields, and what NOT to say.

### 6. Strict Payment Data Security & Guardrails
- Direct Debit only (Sort Code XX-XX-XX and Account Number 8 digits).
- **Hard-coded strict prohibition**: Never collects Card numbers, CVV, PINs, OTPs, or online banking passwords.
- Volatile in-memory handling: Payment data is never written to `localStorage`, `sessionStorage`, browser logs, console, or client telemetry.
- Automated PCI sanitizer redacts card patterns and security codes from advisor notes.

### 7. Configurable Admin Governance & Script Versioning
- Admin modal (`Settings` icon) allowing authorized changes to:
  - Campaign name and script version (e.g. `v2.0.0` -> `v2.1.0` publishing).
  - Maximum discount percentage cap.
  - Eligibility DOB brackets.
  - Authorized commercial wording to prevent advisor guesswork.

---

## Local Development & Setup

### Requirements
- Node.js 18+
- npm 9+

### Commands

```bash
# Install dependencies
npm install

# Run development server (running on http://localhost:5173/)
npm run dev

# Run TypeScript check & production build
npm run build

# Preview production build
npm run preview
```
