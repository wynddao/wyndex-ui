import { selectorFamily } from "recoil";

import {
  Cw20VestingClient as ExecuteClient,
  Cw20VestingQueryClient as QueryClient,
} from "../../../clients/Cw20Vesting.client";
import {
  AllAccountsResponse,
  AllAllowancesResponse,
  AllowanceResponse,
  BalanceResponse,
  DownloadLogoResponse,
  MarketingInfoResponse,
  MinterResponse,
  StakingAddressResponse,
  TokenInfoResponse,
  VestingResponse,
} from "../../../clients/types/Cw20Vesting.types";
import { signingCosmWasmStargateClientAtom as signingCosmWasmClientAtom } from "../../atoms";
import { cosmWasmStargateClientSelector as cosmWasmClientSelector } from "../chain";

type QueryClientParams = {
  contractAddress: string;
};

const queryClient = selectorFamily<QueryClient, QueryClientParams>({
  key: "wyndVestingQueryClient",
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

export const executeClient = selectorFamily<ExecuteClient | undefined, ExecuteClientParams>({
  key: "stakeCw20ExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      return new ExecuteClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});

export const stakingAddressSelector = selectorFamily<StakingAddressResponse, QueryClientParams>({
  key: "wyndVestingStakingAddress",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.stakingAddress();
    },
});

export const balanceSelector = selectorFamily<
  BalanceResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["balance"]>;
  }
>({
  key: "wyndVestingBalance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.balance(...params);
    },
});

export const vestingSelector = selectorFamily<
  VestingResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["vesting"]>;
  }
>({
  key: "wyndVesting",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.vesting(...params);
    },
});

export const tokenInfoSelector = selectorFamily<
  TokenInfoResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["tokenInfo"]>;
  }
>({
  key: "wyndVestingTokenInfo",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.tokenInfo(...params);
    },
});

export const minterSelector = selectorFamily<
  MinterResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["minter"]>;
  }
>({
  key: "wyndVestingMinter",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.minter(...params);
    },
});

export const allowanceSelector = selectorFamily<
  AllowanceResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["allowance"]>;
  }
>({
  key: "wyndVestingAllowance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allowance(...params);
    },
});

export const allAllowancesSelector = selectorFamily<
  AllAllowancesResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["allAllowances"]>;
  }
>({
  key: "wyndVestingAllAllowances",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allAllowances(...params);
    },
});

export const allAccountsSelector = selectorFamily<
  AllAccountsResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["allAccounts"]>;
  }
>({
  key: "wyndVestingAllAccounts",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allAccounts(...params);
    },
});

export const marketingInfoSelector = selectorFamily<
  MarketingInfoResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["marketingInfo"]>;
  }
>({
  key: "wyndVestingMarketingInfo",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.marketingInfo(...params);
    },
});

export const downloadLogoSelector = selectorFamily<
  DownloadLogoResponse,
  QueryClientParams & {
    params: Parameters<QueryClient["downloadLogo"]>;
  }
>({
  key: "wyndVestingDownloadLogo",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.downloadLogo(...params);
    },
});
