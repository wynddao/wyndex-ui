import { useCallback } from "react";
import { constSelector, useRecoilValue, useSetRecoilState } from "recoil";

import { useWallet } from "@cosmos-kit/react";
import { DAO_ADDRESS, DAO_DIST_ADDRESS, DAO_STAKING_ADDRESS, WYND_TOKEN_ADDRESS } from "../../utils";
import { Claim, StakedResponse } from "../clients/types/WyndexStake.types";
import {
  blockHeightSelector,
  WyndBaseSelectors,
  WyndDaoDistSelectors,
  WyndDaoStakeSelectors,
} from "../recoil";
import { WyndDaoBaseHooks } from "./clients";
import { TokenInfoResponse } from "../clients/types/Cw20.types";

function claimAvailable(claim: Claim, blockHeight: number) {
  if ("at_height" in claim.release_at) {
    return blockHeight >= claim.release_at.at_height;
  } else if ("at_time" in claim.release_at) {
    const currentTimeNs = new Date().getTime() * 1000000;
    return currentTimeNs >= Number(claim.release_at.at_time);
  }

  // Unreachable.
  return false;
}
interface UseStakingInfoOptions {
  fetchClaims?: boolean;
  fetchTotalStakedValue?: boolean;
  fetchWalletStakedValue?: boolean;
}

type Duration =
  | {
      height: number;
    }
  | {
      time: number;
    };

interface UseStakingInfoResponse {
  stakingContractAddress: string;
  unstakingDuration?: Duration;
  blockHeight?: number;
  claims?: Claim[];
  claimsPending?: Claim[];
  claimsAvailable?: Claim[];
  sumClaimsAvailable?: number;
  totalStakedValue?: number;
  walletStakedValue?: number;
}

export interface WyndUseStakingInfoResponse
  extends Omit<UseStakingInfoResponse, "claims" | "claimsPending" | "claimsAvailable"> {
  unbondingPeriods: any;
  walletStakedTokens: number | undefined;
  walletStakedPower: number | undefined;
  walletStakedTokensArr: Array<StakedResponse> | undefined;
  totalStaked: string | undefined;
  claims?: Claim[];
  claimsPending?: Claim[];
  claimsAvailable?: Claim[];
  rewards: number | undefined;
  distributionContractAddress: string;
  treasuryBalance: string;
  vestedBalance: string;
  governanceTokenInfo: TokenInfoResponse;
}

export const useDaoStakingInfos = ({
  fetchClaims = false,
  fetchTotalStakedValue = false,
  fetchWalletStakedValue = false,
}: UseStakingInfoOptions = {}): WyndUseStakingInfoResponse => {
  const { address: walletAddress } = useWallet();
  const stakingContractAddress = DAO_STAKING_ADDRESS;
  const distributionContractAddress = DAO_DIST_ADDRESS;
  const governanceTokenAddress = WYND_TOKEN_ADDRESS;

  // Claims
  const blockHeight = useRecoilValue(fetchClaims ? blockHeightSelector : constSelector(undefined));

  const claims = useRecoilValue(
    fetchClaims && walletAddress
      ? WyndDaoStakeSelectors.claimsSelector({
          contractAddress: stakingContractAddress,
          params: [{ address: walletAddress }],
        })
      : constSelector(undefined),
  )?.claims;

  const governanceTokenInfo = useRecoilValue(
    WyndBaseSelectors.tokenInfoSelector({
      contractAddress: governanceTokenAddress,
      params: [],
    }),
  );

  const claimsPending = blockHeight ? claims?.filter((c) => !claimAvailable(c, blockHeight)) : undefined;
  const claimsAvailable = blockHeight ? claims?.filter((c) => claimAvailable(c, blockHeight)) : undefined;
  const sumClaimsAvailable = claimsAvailable?.reduce((p, c) => p + Number(c.amount), 0);

  // Total staked value TODO
  const totalStakedPower = useRecoilValue(
    fetchWalletStakedValue && walletAddress
      ? WyndDaoStakeSelectors.totalPowerAtHeightSelector({
          contractAddress: stakingContractAddress,
          params: [{ height: blockHeight }],
        })
      : constSelector(undefined),
  )?.power;

  // Need to split token and power
  const walletStakedPower = useRecoilValue(
    fetchWalletStakedValue && walletAddress
      ? WyndDaoStakeSelectors.votingPowerAtHeightSelector({
          contractAddress: stakingContractAddress,
          params: [{ address: walletAddress }],
        })
      : constSelector(undefined),
  )?.power;

  const walletStakedTokensArr = useRecoilValue(
    fetchWalletStakedValue && walletAddress
      ? WyndDaoStakeSelectors.allStakedSelector({
          contractAddress: stakingContractAddress,
          params: [{ address: walletAddress, unbondingPeriod: 0 }],
        })
      : constSelector(undefined),
  )?.stakes;

  const walletStakedTokens = walletStakedTokensArr
    ? walletStakedTokensArr
        .map((o) => Number(o.stake))
        .reduce((a, c) => {
          return a + c;
        }, 0)
    : 0;

  // Bonding info including unbonding Periods
  const bondingInfo = useRecoilValue(
    WyndDaoStakeSelectors.bondingInfoSelector({
      contractAddress: String(stakingContractAddress),
    }),
  ).bonding;

  // WYNDperEpoch & Epoch time
  const { epoch, payment } = useRecoilValue(
    WyndDaoDistSelectors.configSelector({
      contractAddress: String(distributionContractAddress),
    }),
  ).config;

  // Total rewards
  const totalRewards = useRecoilValue(
    WyndDaoStakeSelectors.totalRewardsSelector({
      contractAddress: String(stakingContractAddress),
    }),
  ).rewards;

  // Calculating APY for each bonding period
  const advancedBondingInfo = bondingInfo.map((period) => {
    const apy =
      (Number(period.reward_multiplier) * (Number(payment) / 1000000) * 365 * 86400) /
      (Number(totalRewards) * epoch);
    return { ...period, apy: apy };
  });

  // Personal staking rewards
  const rewards = useRecoilValue(
    fetchWalletStakedValue && walletAddress
      ? WyndDaoStakeSelectors.withdrawableRewardsSelector({
          contractAddress: String(stakingContractAddress),
          params: [{ owner: walletAddress }],
        })
      : constSelector(undefined),
  )?.rewards;

  // Total WYND Staked
  const totalStaked = useRecoilValue(
    WyndDaoStakeSelectors.totalStakedSelector({
      contractAddress: String(stakingContractAddress),
    }),
  ).total_staked;

  // Treasury
  const treasuryBalance = useRecoilValue(
    WyndBaseSelectors.balanceSelector({
      contractAddress: WYND_TOKEN_ADDRESS,
      params: [{ address: DAO_ADDRESS }],
    }),
  )?.balance;

  const vestedBalance = useRecoilValue(
    fetchWalletStakedValue && walletAddress
      ? WyndBaseSelectors.vestingSelector({
          contractAddress: WYND_TOKEN_ADDRESS,
          params: [{ address: walletAddress }],
        })
      : constSelector({ locked: "0" }),
  ).locked;

  return {
    stakingContractAddress,
    unstakingDuration: {
      height: 0,
    },
    totalStaked,
    /// Optional
    // Claims
    blockHeight,
    claims,
    claimsPending,
    claimsAvailable,
    sumClaimsAvailable,
    // Total staked value
    totalStakedValue: fetchTotalStakedValue ? Number(totalStakedPower) : undefined,
    // Wallet staked value
    walletStakedTokens: fetchWalletStakedValue ? Number(walletStakedTokens) : undefined,
    walletStakedPower: fetchWalletStakedValue ? Number(walletStakedPower) : undefined,
    unbondingPeriods: advancedBondingInfo,
    rewards: fetchWalletStakedValue ? Number(rewards) : undefined,
    walletStakedTokensArr,
    distributionContractAddress,
    treasuryBalance,
    vestedBalance,
    governanceTokenInfo,
  };
};
