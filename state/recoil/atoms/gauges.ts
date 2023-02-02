import { atom } from "recoil";

export interface DailyReward {
  asset: string;
  amount: number;
  gaugeId: number;
}

export const gaugesDailyRewardsAtom = atom<DailyReward[]>({
  key: "gaugesDailyRewards",
  default: [],
});
