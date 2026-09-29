import { MasterStage, CustomerRecord, OfferConfig, CustomerSentiment } from "../types";
import { MasterScriptEngine, STAGES_LIST } from "./masterScriptEngine";
import { CalculatorTools } from "./calculatorTools";

export const STATE_ORDER = STAGES_LIST.map((stage, idx) => ({
  state: stage,
  metadata: {
    label: stage.replace(/STAGE_\d+_/, "").replace(/_/g, " "),
    stepNumber: idx + 1,
  },
}));

export class ConversationEngine {
  public static checkDobEligibility(
    dobString: string | undefined,
    config: OfferConfig
  ) {
    if (!dobString) {
      return { isEligible: false, message: "Date of birth not yet entered." };
    }
    return CalculatorTools.evaluateDobEligibility({ exactDob: dobString }, config);
  }

  public static getSuggestedResponse(
    stage: MasterStage,
    customer: CustomerRecord,
    config: OfferConfig
  ) {
    const def = MasterScriptEngine.getStageDefinition(stage, customer, config);
    return {
      objective: def.objective,
      primary: def.getSayText(customer, config),
      short: def.getSayText(customer, config),
      explain: def.why,
      why: def.why,
      nextState: def.nextStage,
    };
  }
}
