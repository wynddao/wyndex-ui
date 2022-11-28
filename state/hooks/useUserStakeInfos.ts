import { useRecoilValue } from "recoil";
import { StakedResponse } from "../clients/types/WyndexStake.types";
import { WyndexStakeSelectors } from "../recoil";

interface UseUserStakeInfosResponse {
  allStakes: StakedResponse[];
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

  return {
    allStakes,
  };
};
