import { BondingPeriodInfo, StakedResponse } from "../state/clients/types/WyndexStake.types";
import { secondsToDays } from "./time";

export const renderUnboundingText = (
  text: string,
  higherDuration: StakedResponse | BondingPeriodInfo | undefined,
  lowerDuration: StakedResponse | BondingPeriodInfo | undefined,
  stake: StakedResponse,
): string => {
  switch (text) {
    case "unstake":
      return "Unstake your tokens";
    case "bondDown":
      return `Decrease your bonding duration from ${secondsToDays(stake.unbonding_period)} days to
        ${lowerDuration?.unbonding_period && secondsToDays(lowerDuration?.unbonding_period)} days`;
    case "bondUp":
      return `Increase your bonding duration from ${secondsToDays(stake.unbonding_period)} days to
        ${higherDuration?.unbonding_period && secondsToDays(higherDuration?.unbonding_period)} days`;
    default:
      return "";
  }
};
