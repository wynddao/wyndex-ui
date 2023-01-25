import { selectorFamily } from "recoil";
import { signingCosmWasmStargateClientAtom } from "../../atoms";
import { cosmWasmStargateClientSelector } from "../chain";
import {
  MinterResponse,
  AllAccountsResponse,
  AllAllowancesResponse,
  AllSpenderAllowancesResponse,
  AllowanceResponse,
  BalanceResponse,
  DownloadLogoResponse,
  MarketingInfoResponse,
  TokenInfoResponse,
} from "../../../clients/types/Cw20.types";
import { Cw20Client, Cw20QueryClient } from "../../../clients/Cw20.client";

type QueryClientParams = {
  contractAddress: string;
};
export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};
export const queryClient = selectorFamily<Cw20QueryClient, QueryClientParams>({
  key: "cw20QueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmStargateClientSelector);
      return new Cw20QueryClient(client, contractAddress);
    },
});

export const executeClient = selectorFamily<Cw20Client | undefined, ExecuteClientParams>({
  key: "cw20ExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmStargateClientAtom);

      if (!client) return;
      return new Cw20Client(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});

export const balanceSelector = selectorFamily<
  BalanceResponse,
  QueryClientParams & {
    params: Parameters<Cw20QueryClient["balance"]>;
  }
>({
  key: "cw20Balance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.balance(...params);
    },
});
export const tokenInfoSelector = selectorFamily<
  TokenInfoResponse,
  QueryClientParams & {
    params: Parameters<Cw20QueryClient["tokenInfo"]>;
  }
>({
  key: "cw20TokenInfo",
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
    params: Parameters<Cw20QueryClient["minter"]>;
  }
>({
  key: "cw20Minter",
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
    params: Parameters<Cw20QueryClient["allowance"]>;
  }
>({
  key: "cw20Allowance",
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
    params: Parameters<Cw20QueryClient["allAllowances"]>;
  }
>({
  key: "cw20AllAllowances",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allAllowances(...params);
    },
});
export const allSpenderAllowancesSelector = selectorFamily<
  AllSpenderAllowancesResponse,
  QueryClientParams & {
    params: Parameters<Cw20QueryClient["allSpenderAllowances"]>;
  }
>({
  key: "cw20AllSpenderAllowances",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allSpenderAllowances(...params);
    },
});
export const allAccountsSelector = selectorFamily<
  AllAccountsResponse,
  QueryClientParams & {
    params: Parameters<Cw20QueryClient["allAccounts"]>;
  }
>({
  key: "cw20AllAccounts",
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
    params: Parameters<Cw20QueryClient["marketingInfo"]>;
  }
>({
  key: "cw20MarketingInfo",
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
    params: Parameters<Cw20QueryClient["downloadLogo"]>;
  }
>({
  key: "cw20DownloadLogo",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.downloadLogo(...params);
    },
});
