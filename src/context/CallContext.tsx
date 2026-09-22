import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type {
  ResponseCategory,
  RecoveryType,
  HardStopDisposition,
  FinalDisposition,
  CallStage,
  AdminConfig,
  CallHistoryEntry,
  NoteItem,
  CallBranch,
  SubStep,
} from '../types';
import {
  DEFAULT_ADMIN_CONFIG,
  RAW_STAGES,
  RECOVERY_ACTIONS,
  HARD_STOP_SAY_THIS,
} from '../data/callFlowData';

export type FontSizeOption = 'normal' | 'large' | 'extra-large';

interface CallContextType {
  stages: CallStage[];
  currentStageIndex: number;
  currentStage: CallStage;
  subStepIndex: number;
  isStage14: boolean;
  currentSubStep: SubStep | null;
  selectedCategory: ResponseCategory | null;
  currentBranch: CallBranch | null;
  sayThisText: string;
  isHardStopped: boolean;
  hardStopDisposition: HardStopDisposition | null;
  finalDisposition: FinalDisposition | null;
  history: CallHistoryEntry[];
  callHistory: CallHistoryEntry[];
  canGoBack: boolean;
  canGoNext: boolean;
  verifiedFields: Record<string, boolean>;
  notes: NoteItem[];
  adminConfig: AdminConfig;
  fontSize: FontSizeOption;
  isOnline: boolean;
  activeRecovery: RecoveryType | null;
  activeRebuttal: { step: number; text: string; label: string } | null;
  isStatementInHand: boolean;
  isSoftenActive: boolean;
  isObjectionHandlerOpen: boolean;
  isToolsRailOpen: boolean;
  isHomeModalOpen: boolean;
  isObjectionSearchOpen: boolean;
  isAdminModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  isCompletionStage: boolean;
  rebuttalCallerStageId: string | null;

  // Actions
  selectCategory: (cat: ResponseCategory) => void;
  goNext: () => void;
  goBack: () => void;
  confirmHomeReset: () => void;
  cancelHomeReset: () => void;
  openHomeModal: () => void;
  cancelHardStop: () => void;
  setHardStopDisposition: (disp: HardStopDisposition) => void;
  setFinalDisposition: (disp: FinalDisposition) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  addNote: (text: string) => void;
  updateAdminConfig: (cfg: AdminConfig) => void;
  triggerRecovery: (type: RecoveryType) => void;
  dismissRecovery: () => void;
  toggleSoften: () => void;
  toggleStatementInHand: () => void;
  fireRebuttal: (step: number) => void;
  clearRebuttal: () => void;
  setIsObjectionHandlerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsToolsRailOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsObjectionSearchOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setIsShortcutsModalOpen: (open: boolean) => void;
  jumpToStage: (stageId: string) => void;
  formatScriptText: (text: string) => string;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'sparta_admin_config_v3';
const FONT_SIZE_STORAGE_KEY = 'sparta_font_size_v3';

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Admin Config with persistence
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_CONFIG;
  });

  // Font size preference with persistence
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY) as FontSizeOption;
      if (saved === 'normal' || saved === 'large' || saved === 'extra-large') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'normal';
  });

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminConfig));
    } catch {
      // ignore
    }
  }, [adminConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    } catch {
      // ignore
    }
  }, [fontSize]);

  // Online / Offline Status
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Core Call State
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [subStepIndex, setSubStepIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ResponseCategory | null>(null);
  const [isHardStopped, setIsHardStopped] = useState(false);
  const [hardStopDisposition, setHardStopDisposition] = useState<HardStopDisposition | null>(null);
  const [finalDisposition, setFinalDisposition] = useState<FinalDisposition | null>(null);
  const [history, setHistory] = useState<CallHistoryEntry[]>([]);
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});
  const [rebuttalCallerStageId, setRebuttalCallerStageId] = useState<string | null>(null);

  // UI Overhaul States
  const [isStatementInHand, setIsStatementInHand] = useState(false);
  const [softenedByStage, setSoftenedByStage] = useState<Record<string, boolean>>({});
  const [activeRebuttal, setActiveRebuttal] = useState<{ step: number; text: string; label: string } | null>(null);
  const [isObjectionHandlerOpen, setIsObjectionHandlerOpen] = useState(false);
  const [isToolsRailOpen, setIsToolsRailOpen] = useState(false);

  // Active Recovery state
  const [activeRecovery, setActiveRecovery] = useState<RecoveryType | null>(null);

  // Notes
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // Modals
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [isObjectionSearchOpen, setIsObjectionSearchOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Text interpolator helper
  const formatScriptText = useCallback(
    (text: string): string => {
      if (!text) return '';
      return text
        .replace(/\[AGENT_NAME\]/g, adminConfig.agentName || 'Alex')
        .replace(/\[COMPANY_NAME\]/g, adminConfig.companyName || 'the customer rewards team')
        .replace(/\[OFFER_PERCENT\]/g, `${adminConfig.offerPercentage}`)
        .replace(/\[DELIVERY_WORDING\]/g, adminConfig.deliveryWording.toLowerCase());
    },
    [adminConfig]
  );

  // Computed Stages
  const stages = useMemo(() => {
    return RAW_STAGES.map((stg) => ({
      ...stg,
      script: formatScriptText(stg.script),
      sayThisSoftened: stg.sayThisSoftened ? formatScriptText(stg.sayThisSoftened) : undefined,
      rebuttals: stg.rebuttals?.map((r) => ({
        ...r,
        text: formatScriptText(r.text),
      })),
    }));
  }, [formatScriptText]);

  const currentStage = stages[currentStageIndex] || stages[0];
  const isStage14 = currentStage.id === 'additional_verification';
  const currentSubStep: SubStep | null =
    isStage14 && currentStage.subSteps ? currentStage.subSteps[subStepIndex] : null;

  const isCompletionStage = currentStage.id === 'completion' || currentStage.id === 'closing';
  const isSoftenActive = !!softenedByStage[currentStage.id];

  // Active Branch
  const currentBranch: CallBranch | null = useMemo(() => {
    if (!selectedCategory) return null;
    if (isStage14 && currentSubStep) {
      return currentSubStep.branches[selectedCategory] || null;
    }
    return currentStage.branches[selectedCategory] || null;
  }, [selectedCategory, isStage14, currentSubStep, currentStage]);

  // THE SINGLE "SAY THIS" BOX ENGINE
  const sayThisText = useMemo(() => {
    if (isHardStopped) {
      return HARD_STOP_SAY_THIS;
    }

    if (activeRebuttal) {
      return formatScriptText(activeRebuttal.text);
    }

    if (activeRecovery) {
      if (activeRecovery === 'REPEAT') {
        if (isSoftenActive && currentStage.sayThisSoftened) {
          return currentStage.sayThisSoftened;
        }
        return currentStage.script;
      }
      const rec = RECOVERY_ACTIONS[activeRecovery];
      return rec.sayThis || `"${rec.acknowledgement} ${rec.response}"`;
    }

    if (currentBranch) {
      if (currentBranch.sayThis) {
        return formatScriptText(currentBranch.sayThis);
      }
      const ack = currentBranch.acknowledgement ? formatScriptText(currentBranch.acknowledgement) : '';
      const resp = formatScriptText(currentBranch.response);
      const brg = currentBranch.bridge ? formatScriptText(currentBranch.bridge) : '';
      return `"${[ack, resp, brg].filter(Boolean).join(' ')}"`.trim();
    }

    // Default: Softened or Standard script
    if (isSoftenActive && currentStage.sayThisSoftened) {
      return currentStage.sayThisSoftened;
    }

    if (isStage14 && currentSubStep) {
      return formatScriptText(currentSubStep.script);
    }

    return currentStage.script;
  }, [
    isHardStopped,
    activeRebuttal,
    activeRecovery,
    currentBranch,
    isSoftenActive,
    isStage14,
    currentSubStep,
    currentStage.script,
    currentStage.sayThisSoftened,
    formatScriptText,
  ]);

  // Handle Category Selection
  const selectCategory = useCallback((cat: ResponseCategory) => {
    setSelectedCategory(cat);
    setActiveRecovery(null);
    setActiveRebuttal(null);
    if (cat === 'STOP') {
      setIsHardStopped(true);
    } else {
      setIsHardStopped(false);
    }
  }, []);

  // Trigger Recovery
  const triggerRecovery = useCallback((type: RecoveryType) => {
    setActiveRecovery(type);
    setActiveRebuttal(null);
  }, []);

  const dismissRecovery = useCallback(() => {
    setActiveRecovery(null);
  }, []);

  // Soften Toggle
  const toggleSoften = useCallback(() => {
    setSoftenedByStage((prev) => ({
      ...prev,
      [currentStage.id]: !prev[currentStage.id],
    }));
  }, [currentStage.id]);

  // Statement In Hand Pin
  const toggleStatementInHand = useCallback(() => {
    setIsStatementInHand((prev) => !prev);
  }, []);

  // Rebuttals
  const fireRebuttal = useCallback(
    (step: number) => {
      const reb = currentStage.rebuttals?.find((r) => r.step === step);
      if (reb) {
        setActiveRebuttal({
          step: reb.step,
          text: reb.text,
          label: reb.label,
        });
        setActiveRecovery(null);
        setSelectedCategory(null);
      }
    },
    [currentStage.rebuttals]
  );

  const clearRebuttal = useCallback(() => {
    setActiveRebuttal(null);
  }, []);

  // Handle NEXT action
  const goNext = useCallback(() => {
    if (isHardStopped) return;

    // Special recovery routing
    if (activeRecovery === 'BUSY_BAD_TIME') {
      const compIdx = stages.findIndex((s) => s.id === 'completion');
      if (compIdx !== -1) {
        setHistory((prev) => [
          ...prev,
          {
            stageId: currentStage.id,
            subStepIndex,
            selectedCategory,
            sayThisText,
            activeRecovery,
            activeRebuttal,
            isSoftened: isSoftenActive,
            isStatementInHand,
            verifiedFields: { ...verifiedFields },
            rebuttalCallerStageId,
          },
        ]);
        setCurrentStageIndex(compIdx);
        setFinalDisposition('SALE_CALLBACK_NEEDED');
        setActiveRecovery(null);
        setActiveRebuttal(null);
        setSelectedCategory(null);
        return;
      }
    }

    if (activeRecovery === 'NOT_BILL_PAYER') {
      const s1Idx = stages.findIndex((s) => s.id === 'stage_1');
      if (s1Idx !== -1) {
        setHistory((prev) => [
          ...prev,
          {
            stageId: currentStage.id,
            subStepIndex,
            selectedCategory,
            sayThisText,
            activeRecovery,
            activeRebuttal,
            isSoftened: isSoftenActive,
            isStatementInHand,
            verifiedFields: { ...verifiedFields },
            rebuttalCallerStageId,
          },
        ]);
        setCurrentStageIndex(s1Idx);
        setActiveRecovery(null);
        setActiveRebuttal(null);
        setSelectedCategory(null);
        return;
      }
    }

    if (!selectedCategory) return;

    // Stage 4 Statement In Hand Pin trigger on NO/DON'T KNOW
    let newStatementInHand = isStatementInHand;
    if (currentStage.id === 'stage_4' && (selectedCategory === 'NEGATIVE' || selectedCategory === 'CONFUSED')) {
      newStatementInHand = true;
      setIsStatementInHand(true);
    }

    // Snapshot history for true BACK restoration
    setHistory((prev) => [
      ...prev,
      {
        stageId: currentStage.id,
        subStepIndex,
        selectedCategory,
        sayThisText,
        activeRecovery,
        activeRebuttal,
        isSoftened: isSoftenActive,
        isStatementInHand: newStatementInHand,
        verifiedFields: { ...verifiedFields },
        rebuttalCallerStageId,
      },
    ]);

    // Mark verified field if positive response
    const fieldKey = isStage14 && currentSubStep ? currentSubStep.key : currentStage.id;
    if (selectedCategory === 'POSITIVE') {
      setVerifiedFields((prev) => ({
        ...prev,
        [fieldKey]: true,
      }));
    }

    // Save rebuttal caller when transitioning from DD stages on NO
    if (
      (currentStage.id === 'stage_6c' ||
        currentStage.id === 'stage_6d' ||
        currentStage.id === 'stage_6b') &&
      selectedCategory === 'NEGATIVE'
    ) {
      setRebuttalCallerStageId(currentStage.id);
    }

    // Check branch nextStage or default next
    if (currentBranch?.nextStage) {
      if (currentBranch.nextStage === currentStage.id) {
        // Stay on stage
        setSelectedCategory(null);
        setActiveRecovery(null);
        setActiveRebuttal(null);
        return;
      }
      const targetIndex = stages.findIndex((s) => s.id === currentBranch.nextStage);
      if (targetIndex !== -1) {
        setCurrentStageIndex(targetIndex);
        setSubStepIndex(0);
        setSelectedCategory(null);
        setActiveRecovery(null);
        setActiveRebuttal(null);
        return;
      }
    }

    // Default sequential progression
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      setSubStepIndex(0);
      setSelectedCategory(null);
      setActiveRecovery(null);
      setActiveRebuttal(null);
    }
  }, [
    selectedCategory,
    isHardStopped,
    currentStage,
    subStepIndex,
    sayThisText,
    activeRecovery,
    activeRebuttal,
    isSoftenActive,
    isStatementInHand,
    verifiedFields,
    isStage14,
    currentSubStep,
    currentBranch,
    stages,
    currentStageIndex,
    rebuttalCallerStageId,
  ]);

  // Handle BACK action
  const goBack = useCallback(() => {
    // STOP is a hard-stop state — no normal BACK progression from it
    if (isHardStopped) return;
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    const stageIdx = stages.findIndex((s) => s.id === previous.stageId);
    if (stageIdx !== -1) {
      setCurrentStageIndex(stageIdx);
    }
    setSubStepIndex(previous.subStepIndex);
    setSelectedCategory(previous.selectedCategory);
    setActiveRecovery(previous.activeRecovery);
    setActiveRebuttal(previous.activeRebuttal);
    setIsStatementInHand(previous.isStatementInHand);
    setVerifiedFields(previous.verifiedFields);
    if (previous.rebuttalCallerStageId !== undefined) {
      setRebuttalCallerStageId(previous.rebuttalCallerStageId);
    }
    if (previous.isSoftened !== undefined) {
      setSoftenedByStage((prev) => ({
        ...prev,
        [previous.stageId]: previous.isSoftened,
      }));
    }
  }, [history, stages, isHardStopped]);

  // Reset entire call (HOME)
  const confirmHomeReset = useCallback(() => {
    setCurrentStageIndex(0);
    setSubStepIndex(0);
    setSelectedCategory(null);
    setIsHardStopped(false);
    setHardStopDisposition(null);
    setFinalDisposition(null);
    setHistory([]);
    setVerifiedFields({});
    setActiveRecovery(null);
    setActiveRebuttal(null);
    setIsStatementInHand(false);
    setSoftenedByStage({});
    setRebuttalCallerStageId(null);
    setNotes([]);
    setIsHomeModalOpen(false);
    setIsObjectionHandlerOpen(false);
    setIsToolsRailOpen(false);
  }, []);

  const cancelHomeReset = useCallback(() => {
    setIsHomeModalOpen(false);
  }, []);

  const openHomeModal = useCallback(() => {
    setIsHomeModalOpen(true);
  }, []);

  const cancelHardStop = useCallback(() => {
    setIsHardStopped(false);
    setSelectedCategory(null);
    setHardStopDisposition(null);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => (prev === 'normal' ? 'large' : 'extra-large'));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => (prev === 'extra-large' ? 'large' : 'normal'));
  }, []);

  const addNote = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const newNote: NoteItem = {
        id: `note_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: text.trim(),
        stageId: currentStage.id,
      };
      setNotes((prev) => [newNote, ...prev]);
    },
    [currentStage.id]
  );

  const updateAdminConfig = useCallback((cfg: AdminConfig) => {
    setAdminConfig(cfg);
  }, []);

  const jumpToStage = useCallback(
    (stageId: string) => {
      const idx = stages.findIndex((s) => s.id === stageId);
      if (idx !== -1) {
        setHistory((prev) => [
          ...prev,
          {
            stageId: currentStage.id,
            subStepIndex,
            selectedCategory,
            sayThisText,
            activeRecovery,
            activeRebuttal,
            isSoftened: isSoftenActive,
            isStatementInHand,
            verifiedFields: { ...verifiedFields },
            rebuttalCallerStageId,
          },
        ]);
        setCurrentStageIndex(idx);
        setSubStepIndex(0);
        setSelectedCategory(null);
        setActiveRecovery(null);
        setActiveRebuttal(null);
        setIsObjectionSearchOpen(false);
      }
    },
    [
      stages,
      currentStage.id,
      subStepIndex,
      selectedCategory,
      sayThisText,
      activeRecovery,
      activeRebuttal,
      isSoftenActive,
      isStatementInHand,
      verifiedFields,
      rebuttalCallerStageId,
    ]
  );

  const canGoBack = history.length > 0 && !isHardStopped;
  const canGoNext =
    (selectedCategory !== null || activeRecovery === 'BUSY_BAD_TIME' || activeRecovery === 'NOT_BILL_PAYER') &&
    !isHardStopped &&
    currentStage.id !== 'completion';

  return (
    <CallContext.Provider
      value={{
        stages,
        currentStageIndex,
        currentStage,
        subStepIndex,
        isStage14,
        currentSubStep,
        selectedCategory,
        currentBranch,
        sayThisText,
        isHardStopped,
        hardStopDisposition,
        finalDisposition,
        history,
        callHistory: history,
        canGoBack,
        canGoNext,
        verifiedFields,
        notes,
        adminConfig,
        fontSize,
        isOnline,
        activeRecovery,
        activeRebuttal,
        isStatementInHand,
        isSoftenActive,
        isObjectionHandlerOpen,
        isToolsRailOpen,
        isHomeModalOpen,
        isObjectionSearchOpen,
        isAdminModalOpen,
        isShortcutsModalOpen,
        isCompletionStage,
        rebuttalCallerStageId,
        selectCategory,
        goNext,
        goBack,
        confirmHomeReset,
        cancelHomeReset,
        openHomeModal,
        cancelHardStop,
        setHardStopDisposition,
        setFinalDisposition,
        increaseFontSize,
        decreaseFontSize,
        addNote,
        updateAdminConfig,
        triggerRecovery,
        dismissRecovery,
        toggleSoften,
        toggleStatementInHand,
        fireRebuttal,
        clearRebuttal,
        setIsObjectionHandlerOpen,
        setIsToolsRailOpen,
        setIsObjectionSearchOpen,
        setIsAdminModalOpen,
        setIsShortcutsModalOpen,
        jumpToStage,
        formatScriptText,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
};
