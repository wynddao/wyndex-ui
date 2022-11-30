import { useCallback } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useSetRecoilState } from "recoil";
import { Claim, StakedResponse } from "../clients/types/WyndexStake.types";
import { WyndexStakeSelectors } from "../recoil";

interface UseUserStakeInfosResponse {
  allStakes: StakedResponse[];
  allBondings: Claim[];
  refreshBondings: () => void;
}

export const useUserStakeInfos = (
  stakeContract: string,
  walletAddress: string,
): UseUserStakeInfosResponse => {
  const allStakes = useRecoilValue(
    WyndexStakeSelectors.allStakedSelector({
      contractAddress: stakeContract,
      params: [
        {
          address: walletAddress,
        },
      ],
    }),
  ).stakes;

  const allBondings = useRecoilValue(
    WyndexStakeSelectors.claimsSelector({
      contractAddress: stakeContract,
      params: [
        {
          address: walletAddress,
        },
      ],
    }),
  ).claims;

  const refreshBondings = useRecoilRefresher_UNSTABLE(
    WyndexStakeSelectors.claimsSelector({
      contractAddress: stakeContract,
      params: [
        {
          address: walletAddress,
        },
      ],
    }),
  );

  return {
    allStakes,
    allBondings,
    refreshBondings,
  };
};
