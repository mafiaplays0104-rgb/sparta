import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  X,
  Copy,
  Check,
  Building2,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Download,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  BankAccount,
  modulusEngine,
  calculateIban,
  solveMissingDigits,
  lookupBankInfo,
  ReconstructedCandidate,
  SolveResult,
} from "../../engine/ibanModulusEngine";

interface IbanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSortCode?: string;
  currentAccountNumber?: string;
  onApplyBankDetails?: (bankData: {
    sortCode: string;
    accountNumber: string;
    bankName: string;
    iban: string;
  }) => void;
}

export const IbanCalculatorModal: React.FC<IbanCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentSortCode = "",
  currentAccountNumber = "",
  onApplyBankDetails,
}) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Single Validator States
  const [sortCode, setSortCode] = useState<string>(currentSortCode || "089999");
  const [accountNumber, setAccountNumber] = useState<string>(
    currentAccountNumber || "66374958"
  );
  const [bankOverride, setBankOverride] = useState<string>("AUTO");
  const [targetIbanCheck, setTargetIbanCheck] = useState<string>("");
  const [copiedIban, setCopiedIban] = useState(false);
  const [candidateFilter, setCandidateFilter] = useState("");
  const [showTrace, setShowTrace] = useState(false);

  // Results State
  const [solveResult, setSolveResult] = useState<SolveResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  // Bulk States
  const [bulkInput, setBulkInput] = useState<string>(
    `089999 66374958\n200000 12345678\n4022?? 1562????\n040004 12345678\n070093 12345678`
  );
  const [bulkResults, setBulkResults] = useState<
    Array<{
      sortCode: string;
      accountNumber: string;
      isValid: boolean;
      bank: string;
      iban: string;
      formattedIban: string;
      status: string;
      candidatesCount?: number;
    }>
  >([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Count wildcards
  const scMissing = (sortCode.match(/[?*Xx_]/g) || []).length;
  const accMissing = (accountNumber.match(/[?*Xx_]/g) || []).length;
  const detectedBank = lookupBankInfo(sortCode);

  const runSolve = useCallback(
    (scToSolve: string, accToSolve: string, targetCheck: string, bOverride: string) => {
      const cleanSc = scToSolve.trim();
      const cleanAcc = accToSolve.trim();

      if (cleanSc.length !== 6) return;
      if (cleanAcc.length < 6 || cleanAcc.length > 10) return;

      setIsSolving(true);
      try {
        const res = solveMissingDigits(
          cleanSc,
          cleanAcc,
          targetCheck || null,
          bOverride !== "AUTO" ? bOverride : null
        );
        setSolveResult(res);
      } catch (err: any) {
        alert(err.message || "Error solving bank account");
      } finally {
        setIsSolving(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      const initSc = currentSortCode || "089999";
      const initAcc = currentAccountNumber || "66374958";
      setSortCode(initSc);
      setAccountNumber(initAcc);
      runSolve(initSc, initAcc, targetIbanCheck, bankOverride);
    }
  }, [isOpen, currentSortCode, currentAccountNumber, runSolve, targetIbanCheck, bankOverride]);

  if (!isOpen) return null;

  const handleSolve = () => {
    runSolve(sortCode, accountNumber, targetIbanCheck, bankOverride);
  };

  const handleCopy = (text: string, _type?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleApply = (candidate: ReconstructedCandidate) => {
    if (onApplyBankDetails) {
      onApplyBankDetails({
        sortCode: candidate.sortCode,
        accountNumber: candidate.accountNumber,
        bankName: candidate.bank,
        iban: candidate.iban,
      });
      onClose();
    }
  };

  const handleRunBulk = () => {
    setIsBulkProcessing(true);
    const lines = bulkInput.split("\n");
    const results: typeof bulkResults = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      const parts = line.split(/[\s,;\t]+/);
      if (parts.length >= 2) {
        const sc = parts[0].trim();
        const acc = parts[1].trim();
        const bank = lookupBankInfo(sc);

        const hasWildcards = /[?*Xx_]/.test(sc + acc);
        if (hasWildcards) {
          try {
            const sol = solveMissingDigits(sc, acc, null, null, 10);
            if (sol.candidates.length > 0) {
              const best = sol.candidates[0];
              results.push({
                sortCode: sc,
                accountNumber: acc,
                isValid: true,
                bank: best.bank,
                iban: best.iban,
                formattedIban: best.formattedIban,
                status: `RECONSTRUCTED (${sol.totalCandidates} found)`,
                candidatesCount: sol.totalCandidates,
              });
            } else {
              results.push({
                sortCode: sc,
                accountNumber: acc,
                isValid: false,
                bank: bank.name,
                iban: "-",
                formattedIban: "-",
                status: "NO_MATCH",
              });
            }
          } catch {
            results.push({
              sortCode: sc,
              accountNumber: acc,
              isValid: false,
              bank: bank.name,
              iban: "-",
              formattedIban: "-",
              status: "INVALID_FORMAT",
            });
          }
        } else {
          try {
            const b = new BankAccount(sc, acc);
            const valid = modulusEngine.isValid(b);
            const iban = calculateIban(b.sortCode, b.accountNumber, bank.code);
            results.push({
              sortCode: b.sortCode,
              accountNumber: b.accountNumber,
              isValid: valid,
              bank: bank.name,
              iban: iban.iban,
              formattedIban: iban.formattedIban,
              status: valid ? "VALID" : "INVALID",
            });
          } catch {
            results.push({
              sortCode: sc,
              accountNumber: acc,
              isValid: false,
              bank: bank.name,
              iban: "-",
              formattedIban: "-",
              status: "INVALID_FORMAT",
            });
          }
        }
      }
    }

    setBulkResults(results);
    setIsBulkProcessing(false);
  };

  const handleDownloadBulkCsv = () => {
    if (bulkResults.length === 0) return;
    let csv = "SortCode,AccountNumber,Status,IsValid,Bank,IBAN,FormattedIBAN\n";
    bulkResults.forEach((r) => {
      csv += `${r.sortCode},${r.accountNumber},${r.status},${r.isValid},"${r.bank}",${r.iban},"${r.formattedIban}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `modulus_bulk_validation_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredCandidates = (solveResult?.candidates || []).filter((c) => {
    if (!candidateFilter) return true;
    const q = candidateFilter.toLowerCase();
    return (
      c.sortCode.includes(q) ||
      c.accountNumber.includes(q) ||
      c.iban.toLowerCase().includes(q) ||
      c.formattedIban.toLowerCase().includes(q) ||
      c.bank.toLowerCase().includes(q)
    );
  });

  const singleCandidate =
    solveResult && solveResult.candidates.length === 1
      ? solveResult.candidates[0]
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  UK Vocalink Modulus Checker & IBAN Calculator
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono">
                  v5.50 Spec
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official UK Clearing Sort Code validation, Missing Digit Reconstructor & IBAN Generation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab buttons */}
            <div className="bg-slate-800/80 p-0.5 rounded-lg flex border border-slate-700/60">
              <button
                onClick={() => setActiveTab("single")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === "single"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Single & Solver
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === "bulk"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Batch / Bulk
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {activeTab === "single" ? (
            <div className="space-y-4">
              {/* Top Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                {/* Sort Code Input */}
                <div className="md:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center gap-1">
                      Sort Code (6 digits)
                    </label>
                    {scMissing > 0 && (
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                        {scMissing} missing (?)
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={sortCode}
                    onChange={(e) => setSortCode(e.target.value)}
                    placeholder="e.g. 089999 or 4022??"
                    maxLength={10}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{detectedBank.name}</span>
                    <span className="text-slate-500 font-mono">({detectedBank.code})</span>
                  </div>
                </div>

                {/* Account Number Input */}
                <div className="md:col-span-5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold flex items-center gap-1">
                      Account Number (6-10 digits)
                    </label>
                    {accMissing > 0 && (
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                        {accMissing} missing (?)
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 66374958 or 1562????"
                    maxLength={14}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                  <div className="text-[11px] text-slate-500">
                    Use <code className="text-cyan-300 font-mono">?</code> or <code className="text-cyan-300 font-mono">*</code> for unknown/damaged digits
                  </div>
                </div>

                {/* Target IBAN Check (Optional) */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1">
                    IBAN Check Digits
                    <span className="text-[10px] text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={targetIbanCheck}
                    onChange={(e) => setTargetIbanCheck(e.target.value)}
                    placeholder="e.g. 56 (GBxx)"
                    maxLength={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-cyan-500"
                  />
                  <div className="text-[11px] text-slate-500">Filters valid candidates</div>
                </div>

                {/* Quick Presets & Actions */}
                <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500 text-[11px]">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSortCode("089999");
                        setAccountNumber("66374958");
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 font-mono"
                    >
                      Co-Op 089999 / 66374958
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortCode("200000");
                        setAccountNumber("12345678");
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 font-mono"
                    >
                      Barclays 200000 / 12345678
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSortCode("4022??");
                        setAccountNumber("1562????");
                      }}
                      className="px-2 py-0.5 rounded bg-amber-950/40 hover:bg-amber-950/60 text-amber-300 text-[11px] border border-amber-800/80 font-mono"
                    >
                      Missing Digits Solver
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSolve}
                      disabled={isSolving}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      {isSolving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Validate & Calculate</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Single Result Display */}
              {solveResult && (
                <div className="space-y-3">
                  {singleCandidate ? (
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-xl p-4 shadow-lg space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-sm font-bold text-white">
                              Valid Account & Clearing Verified
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              ({singleCandidate.bank})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleCopy(singleCandidate.formattedIban, "iban")
                            }
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1"
                          >
                            {copiedIban ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedIban ? "Copied" : "Copy IBAN"}</span>
                          </button>

                          {onApplyBankDetails && (
                            <button
                              onClick={() => handleApply(singleCandidate)}
                              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-sm"
                            >
                              <ArrowRight className="w-3 h-3" />
                              <span>Apply to Customer</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* IBAN Hero Box */}
                      <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                            UK International Bank Account Number (IBAN)
                          </div>
                          <div className="text-base sm:text-lg font-mono font-black text-cyan-400 tracking-wider">
                            {singleCandidate.formattedIban}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">
                              Sort Code
                            </div>
                            <div className="text-white font-bold">
                              {singleCandidate.sortCode}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">
                              Account Number
                            </div>
                            <div className="text-white font-bold">
                              {singleCandidate.accountNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase">
                              Check Digits
                            </div>
                            <div className="text-emerald-400 font-bold">
                              {singleCandidate.checkDigits}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Modulus Math Trace toggle */}
                      {solveResult.trace && (
                        <div>
                          <button
                            type="button"
                            onClick={() => setShowTrace((prev) => !prev)}
                            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>
                              {showTrace ? "Hide" : "Show"} Vocalink Modulus Mathematical Trace
                            </span>
                          </button>

                          {showTrace && (
                            <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Algorithm:</span>
                                <span className="text-cyan-400 font-bold">
                                  {solveResult.trace.algorithm}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Weights:</span>
                                <span className="text-slate-300">
                                  [{solveResult.trace.weights.join(", ")}]
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Remainder:</span>
                                <span className="text-emerald-400 font-bold">
                                  {solveResult.trace.remainder} (Expected: {solveResult.trace.expectedRemainder})
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Exception Rule:</span>
                                <span>{solveResult.trace.exceptionId || "Standard Rule (None)"}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : solveResult.totalCandidates > 1 ? (
                    /* Multiple Reconstructed Candidates Table */
                    <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>
                              Reconstructed {solveResult.totalCandidates} Valid Candidates
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Tested {solveResult.totalCombinationsTested} combinations in {solveResult.elapsedMs}ms
                          </div>
                        </div>

                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
                          <input
                            type="text"
                            value={candidateFilter}
                            onChange={(e) => setCandidateFilter(e.target.value)}
                            placeholder="Filter results..."
                            className="bg-slate-900 border border-slate-700 rounded-md pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="overflow-x-auto max-h-60 rounded-lg border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                            <tr>
                              <th className="p-2 font-mono">Sort Code</th>
                              <th className="p-2 font-mono">Account No</th>
                              <th className="p-2">Bank</th>
                              <th className="p-2 font-mono">IBAN</th>
                              <th className="p-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono">
                            {filteredCandidates.map((cand, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-slate-800/40 transition-colors"
                              >
                                <td className="p-2 text-cyan-300 font-bold">
                                  {cand.sortCode}
                                </td>
                                <td className="p-2 text-white font-bold">
                                  {cand.accountNumber}
                                </td>
                                <td className="p-2 text-slate-300 font-sans">
                                  {cand.bank}
                                </td>
                                <td className="p-2 text-slate-300 text-[11px]">
                                  {cand.formattedIban}
                                </td>
                                <td className="p-2 text-right">
                                  <div className="flex items-center justify-end gap-1 font-sans">
                                    <button
                                      onClick={() =>
                                        handleCopy(cand.formattedIban, "iban")
                                      }
                                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                                      title="Copy IBAN"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    {onApplyBankDetails && (
                                      <button
                                        onClick={() => handleApply(cand)}
                                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px]"
                                      >
                                        Apply
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* 0 Valid Candidates Found */
                    <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-rose-300 text-xs">
                          Account Failed Modulus Validation
                        </div>
                        <div className="text-[11px] text-slate-400">
                          The sort code and account number combination does not pass the Vocalink checksum check for {detectedBank.name}.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Bulk Validator Tab */
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold">
                    Paste Accounts (Sort Code & Account Number per line):
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Accepts spaces, commas, or tabs
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="089999 66374958&#10;200000 12345678&#10;4022?? 1562????"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRunBulk}
                  disabled={isBulkProcessing}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Process Batch Validation</span>
                </button>

                {bulkResults.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDownloadBulkCsv}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download Results (.CSV)</span>
                  </button>
                )}
              </div>

              {/* Bulk Results Table */}
              {bulkResults.length > 0 && (
                <div className="overflow-x-auto max-h-72 rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                      <tr>
                        <th className="p-2 font-mono">Sort Code</th>
                        <th className="p-2 font-mono">Account No</th>
                        <th className="p-2">Bank</th>
                        <th className="p-2 font-mono">IBAN</th>
                        <th className="p-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {bulkResults.map((r, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="p-2 text-cyan-300 font-bold">
                            {r.sortCode}
                          </td>
                          <td className="p-2 text-white">{r.accountNumber}</td>
                          <td className="p-2 text-slate-300 font-sans">
                            {r.bank}
                          </td>
                          <td className="p-2 text-slate-300 text-[11px]">
                            {r.formattedIban}
                          </td>
                          <td className="p-2 text-right font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.isValid
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                  : "bg-rose-950 text-rose-400 border border-rose-800"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
