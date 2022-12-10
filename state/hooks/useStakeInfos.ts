import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilValue } from "recoil";
import { BondingPeriodInfo, Claim } from "../clients/types/WyndexStake.types";
import { WyndexStakeSelectors } from "../recoil";

interface UseStakeInfosResponse {
  infos: BondingPeriodInfo[];
  pendingUnstaking: Claim[];
}

export const useStakeInfos = (
  stakeContract: string,
  fetchPersonal: boolean = false,
): UseStakeInfosResponse => {
  const { address: walletAddress } = useWallet();

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

  return {
    infos,
    pendingUnstaking,
  };
};
