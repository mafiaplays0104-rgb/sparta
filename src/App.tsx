import React, { useState, useMemo } from "react";
import {
  CallState,
  CustomerMood,
  Customer,
  OfferConfig,
  ConsentRecord,
  DirectDebitTempData,
  CallNotes,
  CallMode,
  EndReason,
  CallbackDetails,
} from "./types";
import { initialOfferConfig } from "./data/initialOfferConfig";
import { ConversationEngine, STATE_ORDER } from "./engine/conversationEngine";
import { Header } from "./components/Header";
import { CallProgress } from "./components/CallProgress";
import { ScriptPanel } from "./components/ScriptPanel";
import { CustomerPanel } from "./components/CustomerPanel";
import { ActionBar } from "./components/ActionBar";
import { ObjectionModal } from "./components/ObjectionModal";
import { CallbackModal } from "./components/CallbackModal";
import { EscalationModal } from "./components/EscalationModal";
import { CallSummaryModal } from "./components/CallSummaryModal";
import { AdminModal } from "./components/AdminModal";
import { QuickModeView } from "./components/QuickModeView";
import { TrainingModeDrawer } from "./components/TrainingModeDrawer";

export const App: React.FC = () => {
  // Core Call State
  const [currentState, setCurrentState] = useState<CallState>("OPENING");
  const [history, setHistory] = useState<CallState[]>([]);
  const [completedStates, setCompletedStates] = useState<Set<CallState>>(new Set());

  // Customer & Conversation Context
  const [customer, setCustomer] = useState<Customer>({
    serviceType: undefined,
    issueStatus: undefined,
  });
  const [mood, setMood] = useState<CustomerMood>("COMFORTABLE");
  const [config, setConfig] = useState<OfferConfig>(initialOfferConfig);
  const [callMode, setCallMode] = useState<CallMode>("PRODUCTION");

  // Consents & Non-Persistent In-Memory Direct Debit
  const [consents, setConsents] = useState<ConsentRecord[]>([
    { category: "CALL", status: "GRANTED", timestamp: new Date().toLocaleTimeString() },
  ]);
  const [directDebitData, setDirectDebitData] = useState<DirectDebitTempData>({
    accountHolderName: "",
    sortCode: "",
    accountNumber: "",
    bankName: "",
  });

  // Call Notes & Outcomes
  const [notes, setNotes] = useState<CallNotes>({
    customerConcern: "",
    followUp: "",
    escalationReason: "",
    generalNotes: "",
  });
  const [callbackDetails, setCallbackDetails] = useState<CallbackDetails | undefined>(undefined);
  const [endReason, setEndReason] = useState<EndReason>("COMPLETED");

  // Modals & Panels Visibility
  const [isObjectionsOpen, setIsObjectionsOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isCallSummaryOpen, setIsCallSummaryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrainingHelpOpen, setIsTrainingHelpOpen] = useState(false);

  // Dynamic calculation of current suggested response
  const suggestedResponse = useMemo(() => {
    return ConversationEngine.getSuggestedResponse(
      currentState,
      customer,
      mood,
      config,
      consents
    );
  }, [currentState, customer, mood, config, consents]);

  // Transition to a new state with history tracking
  const handleTransition = (nextState: CallState) => {
    setHistory((prev) => [...prev, currentState]);
    setCompletedStates((prev) => new Set(prev).add(currentState));
    setCurrentState(nextState);

    // If reaching END state, display the Call Summary automatically
    if (nextState === "END") {
      setIsCallSummaryOpen(true);
    }
  };

  // Back button handler
  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((old) => old.slice(0, -1));
      setCurrentState(prev);
    }
  };

  // Customer updates
  const handleUpdateCustomer = (updated: Partial<Customer>) => {
    setCustomer((prev) => ({ ...prev, ...updated }));
  };

  // Consent Granting & Declining
  const handleGrantConsent = (category: ConsentRecord["category"]) => {
    setConsents((prev) => [
      ...prev.filter((c) => c.category !== category),
      { category, status: "GRANTED", timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const handleDeclineConsent = (category: ConsentRecord["category"]) => {
    setConsents((prev) => [
      ...prev.filter((c) => c.category !== category),
      { category, status: "DECLINED", timestamp: new Date().toLocaleTimeString() },
    ]);
    alert(
      "Payment consent declined. Direct Debit collection locked in accordance with customer rights."
    );
  };

  // Escalation & Callback handlers
  const handleEscalateConfirm = (reason: string, extraNotes: string) => {
    setNotes((prev) => ({
      ...prev,
      escalationReason: reason,
      generalNotes: prev.generalNotes + (extraNotes ? ` | Escalation: ${extraNotes}` : ""),
    }));
    setEndReason("ESCALATED");
    handleTransition("END");
  };

  const handleCallbackConfirm = (details: CallbackDetails) => {
    setCallbackDetails(details);
    setNotes((prev) => ({
      ...prev,
      followUp: `Callback on ${details.preferredDate} (${details.preferredTime})`,
      generalNotes: prev.generalNotes + (details.advisorNotes ? ` | Callback notes: ${details.advisorNotes}` : ""),
    }));
    setEndReason("CALLBACK");
    handleTransition("END");
  };

  // Ending call explicitly
  const handleEndCall = (reason?: string) => {
    if (reason) {
      setNotes((prev) => ({
        ...prev,
        customerConcern: reason,
      }));
    }
    setEndReason(
      reason?.toLowerCase().includes("decline")
        ? "CUSTOMER_DECLINED"
        : reason?.toLowerCase().includes("not interested")
        ? "CUSTOMER_DECLINED"
        : "CUSTOMER_REQUESTED_END"
    );
    handleTransition("END");
  };

  // Reset / New Call
  const handleResetCall = () => {
    setCurrentState("OPENING");
    setHistory([]);
    setCompletedStates(new Set());
    setCustomer({});
    setMood("COMFORTABLE");
    setConsents([
      { category: "CALL", status: "GRANTED", timestamp: new Date().toLocaleTimeString() },
    ]);
    setDirectDebitData({
      accountHolderName: "",
      sortCode: "",
      accountNumber: "",
      bankName: "",
    });
    setNotes({
      customerConcern: "",
      followUp: "",
      escalationReason: "",
      generalNotes: "",
    });
    setCallbackDetails(undefined);
    setEndReason("COMPLETED");
    setIsCallSummaryOpen(false);
  };

  const isSensitiveStage = currentState === "PAYMENT_CONSENT" || currentState === "PAYMENT_DETAILS";
  const hasPaymentConsent = !!consents.find(
    (c) => c.category === "PAYMENT" && c.status === "GRANTED"
  );
  const isDirectDebitRecorded =
    !!directDebitData.sortCode && !!directDebitData.accountNumber;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sparta-500 selection:text-white">
      {/* 1. TOP HEADER */}
      <Header
        config={config}
        mood={mood}
        callMode={callMode}
        onCallModeChange={setCallMode}
        onResetCall={handleResetCall}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenObjections={() => setIsObjectionsOpen(true)}
        onOpenTrainingHelp={() => setIsTrainingHelpOpen(true)}
        currentSayText={suggestedResponse.primary}
      />

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CALL PROGRESS (Hidden on small mobile) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <CallProgress
            currentState={currentState}
            onSelectState={(state) => handleTransition(state)}
            completedStates={completedStates}
          />
        </div>

        {/* CENTER COLUMN: LIVE SCRIPT OR QUICK MODE */}
        {callMode === "QUICK" ? (
          <QuickModeView
            state={currentState}
            suggestedResponse={suggestedResponse}
            mood={mood}
            onTransition={handleTransition}
            onOpenObjections={() => setIsObjectionsOpen(true)}
            onSwitchToProduction={() => setCallMode("PRODUCTION")}
          />
        ) : (
          <ScriptPanel
            state={currentState}
            suggestedResponse={suggestedResponse}
            customer={customer}
            onUpdateCustomer={handleUpdateCustomer}
            mood={mood}
            config={config}
            consents={consents}
            onGrantConsent={handleGrantConsent}
            onDeclineConsent={handleDeclineConsent}
            onTransition={handleTransition}
            onEscalate={(reason) => {
              setNotes((prev) => ({ ...prev, escalationReason: reason }));
              setIsEscalationOpen(true);
            }}
            onOpenObjections={() => setIsObjectionsOpen(true)}
            onEndCall={handleEndCall}
            callMode={callMode}
            directDebitData={directDebitData}
            onUpdateDirectDebitData={(d) =>
              setDirectDebitData((prev) => ({ ...prev, ...d }))
            }
          />
        )}

        {/* RIGHT COLUMN: CUSTOMER PANEL (Hidden on tablet/mobile if needed) */}
        <div className="hidden md:block w-80 lg:w-88 flex-shrink-0">
          <CustomerPanel
            customer={customer}
            mood={mood}
            onMoodChange={setMood}
            notes={notes}
            onUpdateNotes={(n) => setNotes((prev) => ({ ...prev, ...n }))}
            consents={consents}
            isDirectDebitRecorded={isDirectDebitRecorded}
          />
        </div>
      </div>

      {/* 3. ALWAYS AVAILABLE BOTTOM ACTION BAR */}
      <ActionBar
        currentState={currentState}
        onBack={handleBack}
        onOpenWhy={() => {
          alert(`WHY AM I ASKING THIS?\n\n${suggestedResponse.why}`);
        }}
        onOpenObjections={() => setIsObjectionsOpen(true)}
        onOpenCallback={() => setIsCallbackOpen(true)}
        onOpenEscalate={() => setIsEscalationOpen(true)}
        onEndCall={() => setIsCallSummaryOpen(true)}
        onRequestConsent={() => {
          handleGrantConsent("PAYMENT");
          handleTransition("PAYMENT_DETAILS");
        }}
        isSensitiveStage={isSensitiveStage}
        hasConsent={hasPaymentConsent}
      />

      {/* 4. MODALS & DRAWERS */}
      <ObjectionModal
        isOpen={isObjectionsOpen}
        onClose={() => setIsObjectionsOpen(false)}
        onSelectResponse={(text) => {
          // When advisor selects an objection response, prompt or apply to current call
          setIsObjectionsOpen(false);
        }}
      />

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        onConfirmCallback={handleCallbackConfirm}
        customerName={
          customer.firstName || customer.lastName
            ? `${customer.firstName || ""} ${customer.lastName || ""}`
            : undefined
        }
        customerPhone={customer.landline || customer.mobile?.number}
      />

      <EscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        onConfirmEscalate={handleEscalateConfirm}
        defaultReason={notes.escalationReason}
      />

      <CallSummaryModal
        isOpen={isCallSummaryOpen}
        endReason={endReason}
        customer={customer}
        config={config}
        notes={notes}
        consents={consents}
        callbackDetails={callbackDetails}
        isDirectDebitRecorded={isDirectDebitRecorded}
        onResetCall={handleResetCall}
        onClose={() => setIsCallSummaryOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
      />

      <TrainingModeDrawer
        isOpen={isTrainingHelpOpen || callMode === "TRAINING"}
        onClose={() => {
          setIsTrainingHelpOpen(false);
          if (callMode === "TRAINING") setCallMode("PRODUCTION");
        }}
        state={currentState}
        suggestedResponse={suggestedResponse}
        mood={mood}
        config={config}
      />
    </div>
  );
};

export default App;
