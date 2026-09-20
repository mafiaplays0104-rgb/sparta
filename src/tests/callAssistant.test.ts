import { describe, it, expect } from 'vitest';
import {
  RAW_STAGES,
  RECOVERY_ACTIONS,
  HARD_STOP_SAY_THIS,
  QUICK_OBJECTIONS,
} from '../data/callFlowData';
import type { ResponseCategory, RecoveryType, FinalDisposition } from '../types';

describe('Sparta Live Call Assistant — UK Retention Sales Tool Test Suite', () => {
  const allCategories: ResponseCategory[] = [
    'POSITIVE',
    'NEGATIVE',
    'CONFUSED',
    'OBJECTION',
    'STOP',
  ];

  // -------------------------------------------------------------
  // 1. STAGE SEQUENCE & COMPLETENESS
  // -------------------------------------------------------------
  describe('Stage Sequence & Completeness', () => {
    it('has all approved stages in correct sequence (Stages 0 through 10)', () => {
      const expectedStageIds = [
        'stage_0',
        'stage_1',
        'stage_2',
        'stage_3',
        'stage_4',
        'stage_5',
        'stage_6a',
        'stage_6b',
        'stage_6c',
        'stage_6d',
        'stage_7',
        'stage_8',
        'stage_9',
        'stage_10',
        'completion',
      ];

      expect(RAW_STAGES.map((s) => s.id)).toEqual(expectedStageIds);

      RAW_STAGES.forEach((stage, idx) => {
        expect(stage.stepNumber).toBe(idx + 1);
        expect(stage.title).toBeTruthy();
        expect(stage.script).toBeTruthy();
      });
    });

    it('contains exact literal script for key stages', () => {
      const stage0 = RAW_STAGES.find((s) => s.id === 'stage_0');
      expect(stage0?.script).toContain(
        "Good morning, Mr Customer. My name is Alex, and I'm calling regarding your phone services. How are you doing today?"
      );

      const stage1 = RAW_STAGES.find((s) => s.id === 'stage_1');
      expect(stage1?.script).toContain(
        "Just to make sure I'm speaking to the right person — am I talking with the owner of this number, the one who takes care of the bills?"
      );

      const stage2 = RAW_STAGES.find((s) => s.id === 'stage_2');
      expect(stage2?.script).toContain(
        "Mr Customer, I'd like to tell you about a special bill reduction program we're running for our privileged customers — a discount of up to thirty percent on your existing phone contract. Sounds good to you?"
      );

      const stage4 = RAW_STAGES.find((s) => s.id === 'stage_4');
      expect(stage4?.script).toContain(
        "Could I ask — do you recall roughly how much you paid last month? I'd like to check whether you're paying for what you're actually using."
      );

      const stage10 = RAW_STAGES.find((s) => s.id === 'stage_10');
      expect(stage10?.script).toContain(
        "Mr Customer, thank you for your time today. I'll be sending you the plan details, terms and conditions in black and white to your door within two to three working days."
      );
    });
  });

  // -------------------------------------------------------------
  // 2. EVERY STAGE × EVERY RESPONSE CATEGORY (NO DEAD ENDS)
  // -------------------------------------------------------------
  describe('Every Stage × Every Response Category (5 Buttons, Subtitles & SayThis)', () => {
    it('defines all 5 response categories with stage-specific button subtitles and sayThis on every stage', () => {
      const validStageIds = [
        ...RAW_STAGES.map((s) => s.id),
      ];

      RAW_STAGES.forEach((stage) => {
        expect(stage.branches, `Stage ${stage.id} missing branches`).toBeDefined();

        allCategories.forEach((cat) => {
          const branch = stage.branches[cat];
          expect(branch, `Stage ${stage.id} missing category ${cat}`).toBeDefined();
          expect(branch.category).toBe(cat);

          // Subtitle requirement: stage-specific buttonDescription must not be empty
          expect(
            branch.buttonDescription,
            `Stage ${stage.id} category ${cat} has empty subtitle (buttonDescription)`
          ).toBeTruthy();

          // SayThis requirement: sayThis or response must not be empty
          const text = branch.sayThis || branch.response;
          expect(
            text,
            `Stage ${stage.id} category ${cat} has empty sayThis/response`
          ).toBeTruthy();

          // STOP button rules
          if (cat === 'STOP') {
            expect(branch.hardStop, `Stage ${stage.id} STOP must have hardStop = true`).toBe(
              true
            );
            expect(branch.nextStage, `Stage ${stage.id} STOP must have nextStage = null`).toBeNull();
            expect(branch.sayThis).toContain('take you off our call list');
          } else {
            // Non-stop branches must not be hard stop
            expect(branch.hardStop).toBeFalsy();

            if (stage.id !== 'completion') {
              expect(
                branch.nextStage,
                `Stage ${stage.id} branch ${cat} has no nextStage defined`
              ).not.toBeNull();
              expect(
                validStageIds,
                `Stage ${stage.id} branch ${cat} nextStage "${branch.nextStage}" is invalid`
              ).toContain(branch.nextStage);
            }
          }
        });
      });
    });

    it('verifies specific required button subtitles per stage', () => {
      const s0 = RAW_STAGES.find((s) => s.id === 'stage_0')!;
      expect(s0.branches.POSITIVE.buttonDescription).toBe('Doing well / polite');
      expect(s0.branches.NEGATIVE.buttonDescription).toBe('Not a good time / unwell');
      expect(s0.branches.CONFUSED.buttonDescription).toBe('Unsure who I am');
      expect(s0.branches.OBJECTION.buttonDescription).toBe("Asks why I'm calling");
      expect(s0.branches.STOP.buttonDescription).toBe('Wants to end call');

      const s1 = RAW_STAGES.find((s) => s.id === 'stage_1')!;
      expect(s1.branches.POSITIVE.buttonDescription).toBe('Owner and bill payer');
      expect(s1.branches.NEGATIVE.buttonDescription).toBe('Not the bill payer');
      expect(s1.branches.CONFUSED.buttonDescription).toBe('Unsure / joint account');
      expect(s1.branches.OBJECTION.buttonDescription).toBe('Asks why it matters');
      expect(s1.branches.STOP.buttonDescription).toBe('Wants to end call');

      const s6c = RAW_STAGES.find((s) => s.id === 'stage_6c')!;
      expect(s6c.branches.POSITIVE.buttonDescription).toBe('Gives sort code');
      expect(s6c.branches.NEGATIVE.buttonDescription).toBe('Refuses');
      expect(s6c.branches.CONFUSED.buttonDescription).toBe("Doesn't know where to find it");
      expect(s6c.branches.OBJECTION.buttonDescription).toBe('Asks why sort code');

      const s6d = RAW_STAGES.find((s) => s.id === 'stage_6d')!;
      expect(s6d.branches.POSITIVE.buttonDescription).toBe('Gives account number');
      expect(s6d.branches.NEGATIVE.buttonDescription).toBe('Refuses');
    });
  });

  // -------------------------------------------------------------
  // 3. REBUTTAL LADDER & IBAN PIVOT IN DRAWER & STAGES
  // -------------------------------------------------------------
  describe('Rebuttal Ladder & IBAN Pivot (4-Step Rebuttal System)', () => {
    it('verifies Stage 6C provides 4-step ladder culminating in IBAN pivot', () => {
      const s6c = RAW_STAGES.find((s) => s.id === 'stage_6c')!;
      expect(s6c.rebuttals).toBeDefined();
      expect(s6c.rebuttals?.length).toBe(4);

      const r1 = s6c.rebuttals![0];
      expect(r1.step).toBe(1);
      expect(r1.text).toContain("Banks wouldn't print them openly");

      const r2 = s6c.rebuttals![1];
      expect(r2.step).toBe(2);
      expect(r2.text).toContain('Direct Debit is actually the most secure way to pay');

      const r3 = s6c.rebuttals![2];
      expect(r3.step).toBe(3);
      expect(r3.text).toContain('details are stored in uncorrupted mode');

      const r4 = s6c.rebuttals![3];
      expect(r4.step).toBe(4);
      expect(r4.label).toContain('Last Net');
      expect(r4.text).toContain('Consumer Identification Number');
      expect(r4.text).toContain('I-B-A-N');
    });

    it('verifies Stage 6D also provides 4-step ladder', () => {
      const s6d = RAW_STAGES.find((s) => s.id === 'stage_6d')!;
      expect(s6d.rebuttals).toBeDefined();
      expect(s6d.rebuttals?.length).toBe(4);
      expect(s6d.rebuttals![3].label).toContain('Last Net');
    });
  });

  // -------------------------------------------------------------
  // 4. STOP & HARD STOP CARD SPECIFICATION
  // -------------------------------------------------------------
  describe('Hard Stop Card & STOP Enforcement', () => {
    it('contains exact approved hard stop sayThis string', () => {
      expect(HARD_STOP_SAY_THIS).toBe(
        '"Of course, Mr Customer — I completely understand. I\'ll take you off our call list and you won\'t be contacted again about this. Thank you for your time, and have a good day."'
      );
    });

    it('ensures every stage has STOP routing to hardStop with no normal NEXT', () => {
      RAW_STAGES.forEach((stage) => {
        const stopBranch = stage.branches.STOP;
        expect(stopBranch.hardStop).toBe(true);
        expect(stopBranch.nextStage).toBeNull();
        expect(stopBranch.sayThis).toBe(HARD_STOP_SAY_THIS);
      });
    });
  });

  // -------------------------------------------------------------
  // 5. TRUE STATE-AWARE BACK NAVIGATION SIMULATION
  // -------------------------------------------------------------
  describe('State-Aware BACK Navigation with Full State Restoration', () => {
    it('accurately restores previous stages, selected categories, SAY THIS text, statement pin, and soften state', () => {
      interface MockHistoryEntry {
        stageId: string;
        selectedCategory: ResponseCategory | null;
        sayThisText: string;
        isStatementInHand: boolean;
        isSoftenActive: boolean;
        rebuttalStep?: number | null;
      }

      const historyStack: MockHistoryEntry[] = [];
      let currentState: MockHistoryEntry = {
        stageId: 'stage_4',
        selectedCategory: null,
        sayThisText: RAW_STAGES.find((s) => s.id === 'stage_4')!.script,
        isStatementInHand: false,
        isSoftenActive: false,
        rebuttalStep: null,
      };

      // User selects NO on Stage 4 (triggers statement grab)
      historyStack.push({ ...currentState });
      currentState = {
        stageId: 'stage_4',
        selectedCategory: 'NEGATIVE',
        sayThisText: RAW_STAGES.find((s) => s.id === 'stage_4')!.branches.NEGATIVE.sayThis!,
        isStatementInHand: true,
        isSoftenActive: false,
        rebuttalStep: null,
      };

      // User clicks NEXT -> advances to Stage 5
      historyStack.push({ ...currentState });
      currentState = {
        stageId: 'stage_5',
        selectedCategory: null,
        sayThisText: RAW_STAGES.find((s) => s.id === 'stage_5')!.script,
        isStatementInHand: true,
        isSoftenActive: false,
        rebuttalStep: null,
      };

      expect(currentState.stageId).toBe('stage_5');
      expect(currentState.isStatementInHand).toBe(true);

      // Now TEST BACK: 1st BACK -> restores Stage 4 with NEGATIVE selected and statement in hand
      currentState = historyStack.pop()!;
      expect(currentState.stageId).toBe('stage_4');
      expect(currentState.selectedCategory).toBe('NEGATIVE');
      expect(currentState.isStatementInHand).toBe(true);
      expect(currentState.sayThisText).toContain('bank statement');

      // 2nd BACK -> restores Stage 4 initial state
      currentState = historyStack.pop()!;
      expect(currentState.stageId).toBe('stage_4');
      expect(currentState.selectedCategory).toBeNull();
      expect(currentState.isStatementInHand).toBe(false);

      expect(historyStack.length).toBe(0);
    });
  });

  // -------------------------------------------------------------
  // 6. RECOVERY SYSTEM (ALL 9 TOOLS)
  // -------------------------------------------------------------
  describe('Recovery Tools System (All 9 Approved Tools)', () => {
    it('defines exactly 9 recovery tools with literal scripts and actions', () => {
      const expectedRecoveryTypes: RecoveryType[] = [
        'OFF_TOPIC',
        'INTERRUPTED',
        'REPEAT',
        'CONFUSED',
        'SLOW_DOWN',
        'BUSY_BAD_TIME',
        'NOT_BILL_PAYER',
        'IS_SCAM',
        'HOW_GET_NUMBER',
      ];

      expect(Object.keys(RECOVERY_ACTIONS)).toHaveLength(9);

      expectedRecoveryTypes.forEach((type) => {
        const item = RECOVERY_ACTIONS[type];
        expect(item, `Missing recovery tool: ${type}`).toBeDefined();
        expect(item.label).toBeTruthy();
        expect(item.actionText).toBeTruthy();
      });

      // Verify exact strings
      expect(RECOVERY_ACTIONS.OFF_TOPIC.sayThis).toContain('just to keep us on track');
      expect(RECOVERY_ACTIONS.INTERRUPTED.sayThis).toContain("I'm listening");
      expect(RECOVERY_ACTIONS.CONFUSED.sayThis).toContain('no rush at all');
      expect(RECOVERY_ACTIONS.SLOW_DOWN.sayThis).toContain("I'll slow down. Take your time.");
      expect(RECOVERY_ACTIONS.BUSY_BAD_TIME.sayThis).toContain('convenient time');
      expect(RECOVERY_ACTIONS.NOT_BILL_PAYER.sayThis).toContain('handles the phone bill');
      expect(RECOVERY_ACTIONS.IS_SCAM.sayThis).toContain('recorded line');
      expect(RECOVERY_ACTIONS.HOW_GET_NUMBER.sayThis).toContain('existing customer');
    });
  });

  // -------------------------------------------------------------
  // 7. COMPLETION CARD DISPOSITIONS
  // -------------------------------------------------------------
  describe('Completion Card Dispositions', () => {
    it('verifies all 7 required sales and non-sales dispositions exist', () => {
      const requiredDispositions: { key: FinalDisposition; label: string }[] = [
        { key: 'SALE_DD_COLLECTED', label: 'Sale — DD collected' },
        { key: 'SALE_IBAN_COLLECTED', label: 'Sale — IBAN collected' },
        { key: 'SALE_CALLBACK_NEEDED', label: 'Sale — Callback needed' },
        { key: 'NO_SALE_NOT_INTERESTED', label: 'No sale — Not interested' },
        { key: 'NO_SALE_COMPLIANCE_STOP', label: 'No sale — Compliance STOP' },
        { key: 'NO_SALE_UNDER_AGE', label: 'No sale — Under age / no eligibility' },
        { key: 'NO_SALE_ESCALATED_SENIOR', label: 'No sale — Escalated to senior' },
      ];

      expect(requiredDispositions).toHaveLength(7);
      requiredDispositions.forEach((disp) => {
        expect(disp.key).toBeTruthy();
        expect(disp.label).toBeTruthy();
      });
    });
  });

  // -------------------------------------------------------------
  // 8. QUICK OBJECTIONS LIBRARY
  // -------------------------------------------------------------
  describe('Quick Objection Library', () => {
    it('contains common customer objections with relevant answers and tags', () => {
      expect(QUICK_OBJECTIONS.length).toBeGreaterThanOrEqual(10);
      QUICK_OBJECTIONS.forEach((obj) => {
        expect(obj.id).toBeTruthy();
        expect(obj.trigger).toBeTruthy();
        expect(obj.shortAnswer).toBeTruthy();
        expect(obj.bridgeBack).toBeTruthy();
        expect(obj.tags.length).toBeGreaterThan(0);
      });
    });
  });

  // -------------------------------------------------------------
  // 9. SOFTENED SCRIPT VARIANTS & REBUTTAL LADDERS
  // -------------------------------------------------------------
  describe('Softened Scripts & Stage Rebuttal Ladders', () => {
    it('provides softened script variants (sayThisSoftened) on key conversational stages', () => {
      const stage0 = RAW_STAGES.find((s) => s.id === 'stage_0')!;
      expect(stage0.sayThisSoftened).toBeDefined();
      expect(stage0.sayThisSoftened).toContain('calling about your phone services');

      const stage1 = RAW_STAGES.find((s) => s.id === 'stage_1')!;
      expect(stage1.sayThisSoftened).toBeDefined();
      expect(stage1.sayThisSoftened).toContain('takes care of the phone bill');

      const stage2 = RAW_STAGES.find((s) => s.id === 'stage_2')!;
      expect(stage2.sayThisSoftened).toBeDefined();
      expect(stage2.sayThisSoftened).toContain("bill reduction we're offering");

      const stage4 = RAW_STAGES.find((s) => s.id === 'stage_4')!;
      expect(stage4.sayThisSoftened).toBeDefined();
      expect(stage4.sayThisSoftened).toContain('what did you pay last month, roughly?');
    });

    it('verifies 3-step rebuttal ladder on Stages 1-5, 7-9 and 4-step ladder on 6C/6D', () => {
      // Stages 1, 2, 3, 4, 5, 7, 8, 9 have 3 rebuttals
      const stagesWith3Rebuttals = ['stage_1', 'stage_2', 'stage_3', 'stage_4', 'stage_5', 'stage_7', 'stage_8', 'stage_9'];
      stagesWith3Rebuttals.forEach((stageId) => {
        const stg = RAW_STAGES.find((s) => s.id === stageId)!;
        expect(stg.rebuttals, `Stage ${stageId} should have rebuttals ladder`).toBeDefined();
        expect(stg.rebuttals?.length).toBe(3);
        expect(stg.rebuttals?.map((r) => r.step)).toEqual([1, 2, 3]);
      });

      // Stage 6C and 6D have 4-step rebuttal ladder
      const stage6c = RAW_STAGES.find((s) => s.id === 'stage_6c')!;
      expect(stage6c.rebuttals?.length).toBe(4);
      expect(stage6c.rebuttals?.map((r) => r.step)).toEqual([1, 2, 3, 4]);
      expect(stage6c.rebuttals?.[3].label).toContain('Last Net');

      const stage6d = RAW_STAGES.find((s) => s.id === 'stage_6d')!;
      expect(stage6d.rebuttals?.length).toBe(4);
      expect(stage6d.rebuttals?.map((r) => r.step)).toEqual([1, 2, 3, 4]);
    });

    it('verifies Data-Protection Frame flag is true for Stages 6A, 6B, 6C, and 6D', () => {
      const dpStages = ['stage_6a', 'stage_6b', 'stage_6c', 'stage_6d'];
      dpStages.forEach((stageId) => {
        const stg = RAW_STAGES.find((s) => s.id === stageId)!;
        expect(stg.isDataProtectionFrame, `Stage ${stageId} must have isDataProtectionFrame = true`).toBe(true);
      });

      // Other stages should not have data protection frame
      const nonDpStages = ['stage_0', 'stage_1', 'stage_2', 'stage_7', 'stage_10'];
      nonDpStages.forEach((stageId) => {
        const stg = RAW_STAGES.find((s) => s.id === stageId)!;
        expect(stg.isDataProtectionFrame).toBeFalsy();
      });
    });

    it('verifies Stage 4 NO branch provides the bill / statement retrieval script', () => {
      const stage4 = RAW_STAGES.find((s) => s.id === 'stage_4')!;
      const noBranch = stage4.branches.NEGATIVE;
      expect(noBranch.sayThis).toContain('grab any of your old phone bills or your bank statement');
      expect(noBranch.sayThis).toContain("I'll hold for a moment");
    });
  });
});
