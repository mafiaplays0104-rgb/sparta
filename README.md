# UK TELECOM — 30% BILL REDUCTION CALL SCRIPT TOOL (SPARTA)

SPARTA is a real-time call-flow copilot built specifically for the **UK Telecom — 30% Bill Reduction Call Script**. It guides advisors (e.g. Peter) through live conversations with UK consumers, ensuring strict compliance, transparency, respectful pacing, and immediate objection resolution across all 52 script sections.

---

## The Golden Rule
> **Keep every spoken section short.**
> **One idea → one short paragraph → one question.**
> Don't overwhelm the customer with the entire offer at once. Let them respond after each short section.

---

## Live Call Flow Architecture

```
[ OPEN ]
  ↓
  30% bill reduction announcement (Section 1)
  ↓
  Customer interested?
    ├── YES (Section 1) ──→ Verify account
    ├── NO (Section 3) ───→ Brief explanation ──→ Respect decision
    ├── QUESTION (Sec 47) → Answer ────────────→ Return to flow
    ├── CONFUSED (Sec 13) → Simplify ──────────→ Continue
    └── STOP (Sec 52) ────→ End call

[ VERIFY ]
  ↓
  Consumer Identification Number (Section 7)
  ↓
  Verification Completed (Section 8)
  ↓
  Current Service — Home telephone check (Section 9)
  ↓
  Current Monthly Bill discovery (Section 10)
  ↓
  Explaining the Reduction & 30% savings (Section 11)
  ↓
  Final Confirmation (Section 45)
  ↓
  Before Any Agreement — price, service, terms clarity (Section 46)
  ↓
  Customer Decision (Sections 48 / 49 / Close)
```

---

## 52-Section Script Directory

1. **OPENING**: Announcement of up to 30% reduction, checking eligibility, time commitment.
2. **CUSTOMER WANTS TO KNOW WHO YOU ARE**: “Who are you calling from?”, “Are you from BT?”, authorized representations.
3. **CUSTOMER SAYS “I'M NOT INTERESTED”**: Soft explanation, zero-pressure exit.
4. **CUSTOMER SAYS “I'M BUSY”**: Brief account check, callback offering.
5. **CUSTOMER SAYS “HOW MUCH WILL I SAVE?”**: Up to 30% reduction explanation.
6. **CUSTOMER SAYS “IS THIS A NEW CONTRACT?”**: Current service comparison.
7. **CONSUMER IDENTIFICATION NUMBER**: Account verification transition, why needed, where to find, refusal handling.
8. **VERIFICATION COMPLETED**: Acknowledgment and transition to service discovery.
9. **CURRENT SERVICE**: Home telephone line confirmation (Yes / No / Don't know).
10. **CURRENT MONTHLY BILL**: Rough monthly payment discovery.
11. **EXPLAINING THE REDUCTION**: Service-based monthly reduction explanation.
12. **CUSTOMER IS INTERESTED**: Smooth transition to remaining details.
13. **CUSTOMER IS CONFUSED**: Simplification and clarification.
14. **CUSTOMER INTERRUPTS**: Active listening and question answering.
15. **CUSTOMER GOES OFF TOPIC**: Polite acknowledgment and redirection.
16. **CUSTOMER SAYS “I ALREADY HAVE A DISCOUNT”**: Factoring existing rate into review.
17. **CUSTOMER SAYS “MY BILL IS ALREADY CHEAP”**: Checking whether further savings apply.
18. **CUSTOMER SAYS “I DON'T TRUST PHONE CALLS”**: Privacy reassurance, explaining each detail.
19. **CUSTOMER ASKS FOR A WEBSITE**: Independent online verification support.
20. **CUSTOMER SAYS “I'LL CALL MY PROVIDER”**: Respectful transfer/exit.
21. **CUSTOMER SAYS “CALL ME LATER”**: Preferred callback scheduling.
22. **CUSTOMER SAYS “I'M NOT THE ACCOUNT HOLDER”**: Data protection compliance stop.
23. **CUSTOMER SAYS “THE ACCOUNT IS IN MY PARTNER'S NAME”**: Non-account holder privacy protection.
24. **CUSTOMER SAYS “I DON'T WANT TO GIVE MY DATE OF BIRTH”**: Voluntary verification respect.
25. **CUSTOMER SAYS “WHY DO YOU NEED MY DATE OF BIRTH?”**: Account matching rationale.
26. **CUSTOMER SAYS “I DON'T HAVE MY BILL”**: Continuation with available information.
27. **CUSTOMER ASKS “IS THIS A SCAM?”**: Independent verification offer without argument.
28. **CUSTOMER ASKS FOR YOUR NAME**: Peter from [COMPANY NAME].
29. **CUSTOMER ASKS FOR YOUR EMPLOYEE NUMBER**: [APPROVED ID] reference.
30. **CUSTOMER SAYS “I WANT TO THINK ABOUT IT”**: Understanding reassurance.
31. **CUSTOMER SAYS “I NEED TO SPEAK TO MY FAMILY”**: Encouraging household consultation.
32. **CUSTOMER SAYS “I'M HAPPY WITH MY CURRENT PROVIDER”**: No-pressure evaluation.
33. **CUSTOMER SAYS “WILL MY NUMBER CHANGE?”**: Unchanged service and portability clarity.
34. **CUSTOMER SAYS “WILL MY SERVICE STOP?”**: Continuity guarantee.
35. **CUSTOMER ASKS ABOUT CONTRACT**: Current terms review.
36. **CUSTOMER SAYS “I DON'T WANT A CONTRACT”**: Contract requirement transparency.
37. **CUSTOMER SAYS “JUST SEND ME SOMETHING”**: Written documentation guidance.
38. **CUSTOMER SAYS “I DON'T WANT TO GIVE BANK DETAILS”**: Financial privacy respect.
39. **CUSTOMER ASKS “WHY DO YOU NEED BANK DETAILS?”**: Clear purpose explanation before asking.
40. **CUSTOMER BECOMES ANGRY**: Immediate polite de-escalation and exit.
41. **CUSTOMER SAYS “REMOVE MY NUMBER”**: Immediate suppression / DO_NOT_CALL.
42. **CUSTOMER SAYS “STOP CALLING ME”**: Immediate cessation.
43. **CUSTOMER WANTS TO END THE CALL**: Polite departure.
44. **CUSTOMER AGREES TO CONTINUE**: Step-by-step progression.
45. **FINAL CONFIRMATION**: Reduction and key terms review.
46. **BEFORE ANY AGREEMENT**: Full clarity on price, service, and terms.
47. **CUSTOMER HAS A QUESTION**: Prioritizing question before resuming.
48. **CUSTOMER SAYS YES**: Orderly confirmation and next step.
49. **CUSTOMER SAYS NO**: Immediate respect and closing.
50. **CUSTOMER SAYS “I'M NOT SURE”**: Clarifying uncertainty.
51. **CUSTOMER ASKS YOU TO REPEAT**: Slower, simplified repetition.
52. **HARD STOP / COMPLIANCE**: Mandatory regulatory directives.

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
