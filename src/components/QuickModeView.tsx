import React from "react";
import { MasterStage, CustomerSentiment } from "../types";
import { MasterScriptEngine } from "../engine/masterScriptEngine";

interface QuickModeViewProps {
  state: MasterStage;
  onTransition: (nextState: MasterStage) => void;
  onOpenObjections: () => void;
}

export const QuickModeView: React.FC<QuickModeViewProps> = ({
  state,
  onTransition,
  onOpenObjections,
}) => {
  return null;
};
