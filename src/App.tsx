import React, { useState, useEffect, useMemo } from "react";
import {
  MasterStage,
  CustomerRecord,
  OfferConfig,
  CallDisposition,
  CallbackDetails,
  CallAuditLog,
} from "./types";
import { initialOfferConfig } from "./data/initialOfferConfig";
import { STAGES_LIST } from "./engine/masterScriptEngine";
import { ScriptUnitEngine, ScriptUnit } from "./engine/scriptUnitEngine";
import { Header } from "./components/Header";
import { CallProgress } from "./components/CallProgress";
import { CustomerPanel } from "./components/CustomerPanel";
import { ScriptRunner } from "./components/ScriptRunner";
import { AssistantPanel } from "./components/AssistantPanel";
import { ObjectionModal } from "./components/ObjectionModal";
import { DobCalculatorModal } from "./components/tools/DobCalculatorModal";
import { BillCalculatorModal } from "./components/tools/BillCalculatorModal";
import { CallbackModal } from "./components/CallbackModal";
import { EscalationModal } from "./components/EscalationModal";
import { CallSummaryModal } from "./components/CallSummaryModal";
import { AdminModal } from "./components/AdminModal";
import { TestRunnerModal } from "./components/TestRunnerModal";

export const App: React.FC = () => {
  // Master Configuration
  const [config, setConfig] = useState<OfferConfig>(initialOfferConfig);

  // Live Customer Record
  const [customer, setCustomer] = useState<CustomerRecord>({
    title: "Mr",
    firstName: "John",
    lastName: "Smith",
    doorNumber: "14",
    street: "Highfield Road",
    address: "14 Highfield Road",
    postcode: "B33 8TH",
    contactNumber: "0121 496 0123",
    consumerId: "CIN-89371284",
    consumerIdStatus: "VERIFIED",
    isUsingAtHome: "YES",
    monthlyBill: 65.00,
    billApproximate: true,
  });

  // Current Unit Index across the sequential call
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<MasterStage>>(new Set());
  const [overrideSayText, setOverrideSayText] = useState<string | undefined>();

  // Modals & Drawers Visibility
  const [isDobCalcOpen, setIsDobCalcOpen] = useState(false);
  const [isBillCalcOpen, setIsBillCalcOpen] = useState(false);
  const [isObjectionsOpen, setIsObjectionsOpen] = useState(false);
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [isCallSummaryOpen, setIsCallSummaryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);

  const [disposition, setDisposition] = useState<CallDisposition>("LEAD_COMPLETED");
  const [callbackDetails, setCallbackDetails] = useState<CallbackDetails | undefined>();
  const [auditLogs, _setAuditLogs] = useState<CallAuditLog[]>([]);

  // Compute all structured units
  const allUnits = useMemo(() => {
    return ScriptUnitEngine.getAllUnits(customer, config);
  }, [customer, config]);

  const currentUnit: ScriptUnit = allUnits[currentUnitIndex] || allUnits[0];
  const currentStage: MasterStage = currentUnit.stage;

  // Track completed stages as we progress
  useEffect(() => {
    const currentStageIdx = STAGES_LIST.indexOf(currentStage);
    const newCompleted = new Set<MasterStage>();
    for (let i = 0; i < currentStageIdx; i++) {
      newCompleted.add(STAGES_LIST[i]);
    }
    setCompletedStages(newCompleted);
  }, [currentStage]);

  // Navigation handlers
  const handleNextUnit = () => {
    setOverrideSayText(undefined);
    if (currentUnitIndex < allUnits.length - 1) {
      setCurrentUnitIndex((prev) => prev + 1);
    } else {
      setIsCallSummaryOpen(true);
    }
  };

  const handlePreviousUnit = () => {
    setOverrideSayText(undefined);
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex((prev) => prev - 1);
    }
  };

  const handleJumpToStage = (stage: MasterStage) => {
    const targetIdx = allUnits.findIndex((u) => u.stage === stage);
    if (targetIdx >= 0) {
      setOverrideSayText(undefined);
      setCurrentUnitIndex(targetIdx);
    }
  };

  const handleUpdateCustomer = (updated: Partial<CustomerRecord>) => {
    setCustomer((prev) => ({ ...prev, ...updated }));
  };

  const handleResetCall = () => {
    setCurrentUnitIndex(0);
    setCompletedStages(new Set());
    setOverrideSayText(undefined);
    setCallbackDetails(undefined);
    setCustomer({
      title: "Mr",
      firstName: "",
      lastName: "",
      doorNumber: "",
      postcode: "",
      monthlyBill: undefined,
      isUsingAtHome: "UNCONFIRMED",
      consumerId: "",
      consumerIdStatus: "PENDING",
    });
    setIsCallSummaryOpen(false);
  };

  const handleEndCall = (reason?: string) => {
    if (reason === "DO_NOT_CALL") setDisposition("DO_NOT_CALL");
    else if (reason === "WRONG_PERSON") setDisposition("WRONG_PERSON");
    else if (reason?.includes("busy")) setDisposition("CUSTOMER_BUSY");
    else if (reason?.includes("not interested") || reason === "CUSTOMER_NOT_INTERESTED") setDisposition("CUSTOMER_NOT_INTERESTED");
    else setDisposition("LEAD_COMPLETED");

    setIsCallSummaryOpen(true);
  };

  const handleConfirmCallback = (details: CallbackDetails) => {
    setCallbackDetails(details);
    setDisposition("CALL_BACK_REQUESTED");
    setIsCallSummaryOpen(true);
  };

  const handleConfirmEscalate = (_reason: string, _notes: string) => {
    setDisposition("ESCALATED");
    setIsCallSummaryOpen(true);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        if (e.key === "Escape") {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        handleNextUnit();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePreviousUnit();
      } else if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        setIsObjectionModalOpen((prev) => !prev);
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setIsDobCalcOpen((prev) => !prev);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setIsBillCalcOpen((prev) => !prev);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setIsCallbackOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsObjectionsOpen(false);
        setIsObjectionModalOpen(false);
        setIsDobCalcOpen(false);
        setIsBillCalcOpen(false);
        setIsCallbackOpen(false);
        setIsEscalationOpen(false);
        setIsCallSummaryOpen(false);
        setIsAdminOpen(false);
        setIsTestRunnerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUnitIndex, allUnits.length]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sparta-500 selection:text-slate-950 overflow-hidden">
      {/* 1. TOP HEADER */}
      <Header
        config={config}
        currentStage={currentStage}
        onResetCall={handleResetCall}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenObjections={() => setIsObjectionModalOpen(true)}
        onOpenDobCalculator={() => setIsDobCalcOpen(true)}
        onOpenBillCalculator={() => setIsBillCalcOpen(true)}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
      />

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CALL WORKFLOW */}
        <div className="hidden lg:block w-52 xl:w-56 flex-shrink-0">
          <CallProgress
            currentStage={currentStage}
            onSelectStage={handleJumpToStage}
            completedStages={completedStages}
          />
        </div>

        {/* CENTER COLUMN: SCRIPT RUNNER */}
        <ScriptRunner
          unit={currentUnit}
          unitIndexOverall={currentUnitIndex}
          totalUnitsOverall={allUnits.length}
          customer={customer}
          config={config}
          onUpdateCustomer={handleUpdateCustomer}
          onNext={handleNextUnit}
          onPrevious={handlePreviousUnit}
          canGoNext={currentUnitIndex < allUnits.length - 1}
          canGoPrevious={currentUnitIndex > 0}
          onOpenDobCalculator={() => setIsDobCalcOpen(true)}
          onOpenBillCalculator={() => setIsBillCalcOpen(true)}
          onOpenObjections={() => setIsObjectionModalOpen(true)}
          onEndCall={handleEndCall}
          overrideSayText={overrideSayText}
          onClearOverrideSayText={() => setOverrideSayText(undefined)}
        />

        {/* RIGHT COLUMN: CUSTOMER PANEL */}
        <div className="hidden md:block w-64 xl:w-72 flex-shrink-0">
          <CustomerPanel
            customer={customer}
            config={config}
            onOpenDobCalculator={() => setIsDobCalcOpen(true)}
            onOpenBillCalculator={() => setIsBillCalcOpen(true)}
          />
        </div>
      </div>

      {/* 3. CALL STATUS BAR */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Live Call Active — Advisor: {config.advisorName || "Peter"}</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-slate-300">Unit {currentUnitIndex + 1} of {allUnits.length}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-slate-500 font-mono text-[10px]">
          <span>Shortcuts: Enter=Next • Left=Back • O=52 Script Sections • S=30% Savings • C=Callback</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCallbackOpen(true)}
            className="hover:text-amber-300 transition-colors"
          >
            [Callback]
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => handleEndCall("LEAD_COMPLETED")}
            className="text-rose-400 hover:text-rose-300 font-bold transition-colors"
          >
            [End Call]
          </button>
        </div>
      </div>

      {/* 4. MODALS & DRAWERS */}
      {/* 52 Script Sections Modal */}
      <ObjectionModal
        isOpen={isObjectionModalOpen}
        onClose={() => setIsObjectionModalOpen(false)}
        onSelectResponse={(text) => setOverrideSayText(text)}
      />

      {/* Objections Quick Drawer */}
      <AssistantPanel
        isOpen={isObjectionsOpen}
        onClose={() => setIsObjectionsOpen(false)}
        onApplyObjectionResponse={(text) => setOverrideSayText(text)}
      />

      {/* DOB Calculator Modal */}
      <DobCalculatorModal
        isOpen={isDobCalcOpen}
        onClose={() => setIsDobCalcOpen(false)}
        config={config}
        currentDob={customer.dob}
        onApplyDob={(dobData) => handleUpdateCustomer(dobData)}
      />

      {/* 30% Savings Calculator Modal */}
      <BillCalculatorModal
        isOpen={isBillCalcOpen}
        onClose={() => setIsBillCalcOpen(false)}
        config={config}
        currentAmount={customer.monthlyBill}
        onApplyBill={(billData) => handleUpdateCustomer(billData)}
      />

      {/* Callback Modal */}
      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        onConfirmCallback={handleConfirmCallback}
        customerName={customer.firstName || customer.lastName ? `${customer.firstName || ""} ${customer.lastName || ""}` : undefined}
        customerPhone={customer.contactNumber || customer.mobileNumber}
      />

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        onConfirmEscalate={handleConfirmEscalate}
      />

      {/* Call Summary Modal */}
      <CallSummaryModal
        isOpen={isCallSummaryOpen}
        onClose={() => setIsCallSummaryOpen(false)}
        customer={customer}
        config={config}
        disposition={disposition}
        onSelectDisposition={setDisposition}
        callbackDetails={callbackDetails}
        auditLogs={auditLogs}
        onResetCall={handleResetCall}
      />

      {/* Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
      />

      {/* Test Runner Modal */}
      <TestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
        config={config}
      />
    </div>
  );
};

export default App;
