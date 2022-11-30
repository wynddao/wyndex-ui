import { useRecoilValue } from "recoil";
import { Claim, StakedResponse } from "../clients/types/WyndexStake.types";
import { WyndexStakeSelectors } from "../recoil";

interface UseUserStakeInfosResponse {
  allStakes: StakedResponse[];
  pendingStakes: Claim[];
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

  const pendingStakes = useRecoilValue(
    WyndexStakeSelectors.claimsSelector({
      contractAddress: stakeContract,
      params: [
        {
          address: walletAddress,
        },
      ],
    }),
  ).claims;

  return {
    allStakes,
    pendingStakes,
  };
};
