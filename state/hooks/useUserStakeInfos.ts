import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
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
    walletAddress.length > 0
      ? WyndexStakeSelectors.allStakedSelector({
          contractAddress: stakeContract,
          params: [
            {
              address: walletAddress,
            },
          ],
        })
      : constSelector({ stakes: [] }),
  ).stakes;

  const allBondings = useRecoilValue(
    walletAddress.length > 0
      ? WyndexStakeSelectors.claimsSelector({
          contractAddress: stakeContract,
          params: [
            {
              address: walletAddress,
            },
          ],
        })
      : constSelector({ claims: [] }),
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
