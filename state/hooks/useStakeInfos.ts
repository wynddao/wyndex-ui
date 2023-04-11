import { useChain } from "@cosmos-kit/react-lite";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import {
  AnnualizedReward,
  AssetValidated,
  BondingPeriodInfo,
  Claim,
} from "../clients/types/WyndexStake.types";
import { WyndexStakeSelectors } from "../recoil";

interface UseStakeInfosResponse {
  infos: BondingPeriodInfo[];
  pendingUnstaking: Claim[];
  refreshPendingUnstaking: () => void;
  refreshRewards: () => void;
  apr: [number, AnnualizedReward[]][];
  rewards: AssetValidated[] | undefined;
}

export const useStakeInfos = (
  stakeContract: string,
  fetchPersonal: boolean = false,
): UseStakeInfosResponse => {
  const { address: walletAddress } = useChain("juno");

  const infos = useRecoilValue(
    WyndexStakeSelectors.bondingInfoSelector({
      contractAddress: stakeContract,
      params: [],
    }),
  ).bonding;

  const pendingUnstaking = useRecoilValue(
    fetchPersonal
      ? WyndexStakeSelectors.claimsSelector({
          contractAddress: stakeContract,
          params: [
            {
              address: walletAddress || "",
            },
          ],
        })
      : constSelector({ claims: [] }),
  )?.claims;

  const { rewards: apr } = useRecoilValue(
    WyndexStakeSelectors.annualizedRewardsSelector({
      contractAddress: stakeContract,
      params: [],
    }),
  );

  const refreshPendingUnstaking = useRecoilRefresher_UNSTABLE(
    fetchPersonal
      ? WyndexStakeSelectors.claimsSelector({
          contractAddress: stakeContract,
          params: [
            {
              address: walletAddress || "",
            },
          ],
        })
      : constSelector({ claims: [] }),
  );

  const rewards = useRecoilValue(
    fetchPersonal && walletAddress
      ? WyndexStakeSelectors.withdrawableRewardsSelector({
          contractAddress: String(stakeContract),
          params: [{ owner: walletAddress }],
        })
      : constSelector(undefined),
  )?.rewards;

  const refreshRewards = useRecoilRefresher_UNSTABLE(
    fetchPersonal && walletAddress
      ? WyndexStakeSelectors.withdrawableRewardsSelector({
          contractAddress: String(stakeContract),
          params: [{ owner: walletAddress }],
        })
      : constSelector(undefined),
  );
  return {
    infos,
    pendingUnstaking,
    refreshPendingUnstaking,
    refreshRewards,
    apr,
    rewards,
  };
};
