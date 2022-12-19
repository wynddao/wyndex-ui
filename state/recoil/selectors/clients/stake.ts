import { selectorFamily } from "recoil";
import { cosmWasmStargateClientSelector as cosmWasmClient } from "../chain";
import {
  AdminResponse,
  AllStakedResponse,
  StakedResponse,
  BondingInfoResponse,
  ClaimsResponse,
  DelegatedResponse,
  DistributedRewardsResponse,
  DistributionDataResponse,
  RewardsPowerResponse,
  TotalStakedResponse,
  TotalUnbondingResponse,
  WithdrawableRewardsResponse,
  WithdrawAdjustment,
} from "../../../clients/types/WyndexStake.types";
import { WyndexStakeClient, WyndexStakeQueryClient } from "../../../clients/WyndexStake.client";
import { signingCosmWasmStargateClientAtom } from "../../atoms";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexStakeQueryClient, QueryClientParams>({
  key: "wyndexStakeQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClient);
      return new WyndexStakeQueryClient(client, contractAddress);
    },
});

export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};

export const executeClient = selectorFamily<WyndexStakeClient | undefined, ExecuteClientParams>({
  key: "wyndexPairExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmStargateClientAtom);
      if (!client) return;
      return new WyndexStakeClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});

export const claimsSelector = selectorFamily<
  ClaimsResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["claims"]>;
  }
>({
  key: "wyndexStakeClaims",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.claims(...params);
    },
});
export const stakedSelector = selectorFamily<
  StakedResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["staked"]>;
  }
>({
  key: "wyndexStakeStaked",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.staked(...params);
    },
});
export const allStakedSelector = selectorFamily<
  AllStakedResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["allStaked"]>;
  }
>({
  key: "wyndexStakeAllStaked",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allStaked(...params);
    },
});
export const totalStakedSelector = selectorFamily<
  TotalStakedResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["totalStaked"]>;
  }
>({
  key: "wyndexStakeTotalStaked",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.totalStaked(...params);
    },
});
export const totalUnbondingSelector = selectorFamily<
  TotalUnbondingResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["totalUnbonding"]>;
  }
>({
  key: "wyndexStakeTotalUnbonding",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.totalUnbonding(...params);
    },
});
export const totalRewardsPowerSelector = selectorFamily<
  RewardsPowerResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["totalRewardsPower"]>;
  }
>({
  key: "wyndexStakeTotalRewardsPower",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.totalRewardsPower(...params);
    },
});
export const rewardsPowerSelector = selectorFamily<
  RewardsPowerResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["rewardsPower"]>;
  }
>({
  key: "wyndexStakeRewardsPower",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.rewardsPower(...params);
    },
});
export const adminSelector = selectorFamily<
  AdminResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["admin"]>;
  }
>({
  key: "wyndexStakeAdmin",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.admin(...params);
    },
});
export const bondingInfoSelector = selectorFamily<
  BondingInfoResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["bondingInfo"]>;
  }
>({
  key: "wyndexStakeBondingInfo",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.bondingInfo(...params);
    },
});
export const withdrawableRewardsSelector = selectorFamily<
  WithdrawableRewardsResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["withdrawableRewards"]>;
  }
>({
  key: "wyndexStakeWithdrawableRewards",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.withdrawableRewards(...params);
    },
});
export const distributedRewardsSelector = selectorFamily<
  DistributedRewardsResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["distributedRewards"]>;
  }
>({
  key: "wyndexStakeDistributedRewards",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.distributedRewards(...params);
    },
});
export const undistributedRewardsSelector = selectorFamily<
  WithdrawableRewardsResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["undistributedRewards"]>;
  }
>({
  key: "wyndexStakeUndistributedRewards",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.undistributedRewards(...params);
    },
});
export const delegatedSelector = selectorFamily<
  DelegatedResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["delegated"]>;
  }
>({
  key: "wyndexStakeDelegated",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.delegated(...params);
    },
});
export const distributionDataSelector = selectorFamily<
  DistributionDataResponse,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["distributionData"]>;
  }
>({
  key: "wyndexStakeDistributionData",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.distributionData(...params);
    },
});
export const withdrawAdjustmentDataSelector = selectorFamily<
  WithdrawAdjustment,
  QueryClientParams & {
    params: Parameters<WyndexStakeQueryClient["withdrawAdjustmentData"]>;
  }
>({
  key: "wyndexStakeWithdrawAdjustmentData",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.withdrawAdjustmentData(...params);
    },
});
