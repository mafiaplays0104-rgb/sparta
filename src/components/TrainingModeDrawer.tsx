import React from "react";
import { MasterStage, CustomerSentiment, OfferConfig } from "../types";

interface TrainingModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: MasterStage;
  sentiment?: CustomerSentiment;
  config: OfferConfig;
}

export const TrainingModeDrawer: React.FC<TrainingModeDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  return null;
};
