import { fromUtf8, toUtf8 } from "@cosmjs/encoding";
import { selectorFamily } from "recoil";

import {
  WyndStakeClient as ExecuteClient,
  WyndStakeQueryClient as QueryClient,
} from "../../../clients/WyndDaoStake.client";
import {
  AllStakedResponse,
  BondingInfoResponse,
  ClaimsResponse,
  HooksResponse,
  RewardsResponse,
  StakedResponse,
  TokenContractResponse,
  TotalPowerAtHeightResponse,
  TotalRewardsResponse,
  TotalStakedResponse,
  VotingPowerAtHeightResponse,
  WithdrawableRewardsResponse,
} from "../../../clients/types/WyndDaoStake.types";
import { signingCosmWasmStargateClientAtom as signingCosmWasmClientAtom } from "../../atoms";
import { cosmWasmStargateClientSelector as cosmWasmClientSelector } from "../chain";
type QueryClientParams = {
  contractAddress: string;
};

const queryClient = selectorFamily<QueryClient, QueryClientParams>({
  key: "wyndStakeQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClientSelector);
      return new QueryClient(client, contractAddress);
    },
});

export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};

// Currently only possibility to query possible unbonding periods
// is to query contract raw
export const getUnbondingPeriods = selectorFamily<QueryClient, QueryClientParams>({
  key: "wyndStakeQueryClient",
  get:
    ({ contractAddress }) =>
    async ({ get }) => {
      const client = get(cosmWasmClientSelector);
      const data = await client.queryContractRaw(contractAddress, toUtf8("config"));
      if (data) {
        const { unbonding_periods } = JSON.parse(fromUtf8(data));
        return unbonding_periods;
      }
      return;
    },
});

export const executeClient = selectorFamily<ExecuteClient | undefined, ExecuteClientParams>({
  key: "wyndStakeExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;

      return new ExecuteClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});

export const tokenContractSelector = selectorFamily<TokenContractResponse, QueryClientParams>({
  key: "wyndStakeTokenContract",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.tokenContract();
    },
});

export const withdrawableRewardsSelector = selectorFamily<
  WithdrawableRewardsResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["withdrawableRewards"]>;
  }
>({
  key: "wyndWithdrawableRewards",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.withdrawableRewards(...params);
    },
});

export const bondingInfoSelector = selectorFamily<BondingInfoResponse, QueryClientParams>({
  key: "wyndTotalRewards",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.bondingInfo();
    },
});

export const votingPowerAtHeightSelector = selectorFamily<
  VotingPowerAtHeightResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["votingPowerAtHeight"]>;
  }
>({
  key: "wyndStakeVotingPowerAtHeight",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.votingPowerAtHeight(...params);
    },
});

export const totalPowerAtHeightSelector = selectorFamily<
  TotalPowerAtHeightResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["totalPowerAtHeight"]>;
  }
>({
  key: "wyndStakeTotalPowerAtHeight",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.totalPowerAtHeight(...params);
    },
});

export const rewardsSelector = selectorFamily<
  RewardsResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["rewards"]>;
  }
>({
  key: "wyndRewards",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.rewards(...params);
    },
});

export const totalRewardsSelector = selectorFamily<TotalRewardsResponse, QueryClientParams>({
  key: "wyndTotalRewards",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.totalRewards();
    },
});

export const totalStakedSelector = selectorFamily<TotalStakedResponse, QueryClientParams>({
  key: "wyndTotalStaked",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.totalStaked();
    },
});

export const stakedSelector = selectorFamily<
  StakedResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["staked"]>;
  }
>({
  key: "wyndStakeStaked",
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
    params: Parameters<QueryClient["staked"]>;
  }
>({
  key: "wyndStakeAllStaked",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allStaked(...params);
    },
});

export const claimsSelector = selectorFamily<
  ClaimsResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["claims"]>;
  }
>({
  key: "wyndStakeClaims",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      if (queryClientParams.contractAddress === "") return { claims: [] };
      const client = get(queryClient(queryClientParams));
      return await client.claims(...params);
    },
});

export const HooksSelector = selectorFamily<HooksResponse, QueryClientParams>({
  key: "wyndStakeGetHooks",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.hooks();
    },
});
