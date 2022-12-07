import { useRecoilValue } from "recoil";
import { BondingPeriodInfo } from "../clients/types/WyndexStake.types";
import { WyndexStakeSelectors } from "../recoil";

interface UseStakeInfosResponse {
  infos: BondingPeriodInfo[];
}

export const useStakeInfos = (stakeContract: string): UseStakeInfosResponse => {
  const infos = useRecoilValue(
    WyndexStakeSelectors.bondingInfoSelector({
      contractAddress: stakeContract,
      params: [],
    }),
  ).bonding;

  return {
    infos,
  };
};
