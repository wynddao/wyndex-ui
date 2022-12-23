import { Coin } from "cosmwasm";
import { selectorFamily } from "recoil";
import {
  AssetPriceResponse,
  Cw20BalanceResponse,
  IndexerQueryClient,
  UserFiatResponse,
} from "../../../clients/Indexer.client";
import { SwapOperation } from "../../../clients/types/WyndexMultiHop.types";

type QueryClientParams = {
  apiUrl: string;
};

export const queryClient = selectorFamily<IndexerQueryClient, QueryClientParams>({
  key: "indexerQueryClient",
  get:
    ({ apiUrl }) =>
    ({ get }) => {
      return new IndexerQueryClient(apiUrl);
    },
});

export const poolsSelector = selectorFamily<any, QueryClientParams>({
  key: "indexerPools",
  get:
    ({ ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.pools();
    },
});

export const userPoolsSelector = selectorFamily<
  any,
  QueryClientParams & {
    params: Parameters<IndexerQueryClient["userPools"]>;
  }
>({
  key: "indexerUserPools",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.userPools(...params);
    },
});

export const assetPricesSelector = selectorFamily<readonly AssetPriceResponse[], QueryClientParams>({
  key: "indexerPrices",
  get:
    ({ ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.assetPrices();
    },
});

export const ibcBalancesSelector = selectorFamily<
  readonly Coin[],
  QueryClientParams & {
    params: Parameters<IndexerQueryClient["ibcBalances"]>;
  }
>({
  key: "indexerIbcBalances",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.ibcBalances(...params);
    },
});

export const ibcBalanceSelector = selectorFamily<
  Coin,
  QueryClientParams & { params: Parameters<IndexerQueryClient["ibcBalance"]> }
>({
  key: "indexerIbcBalance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.ibcBalance(...params);
    },
});

export const cw20BalancesSelector = selectorFamily<
  readonly Cw20BalanceResponse[],
  QueryClientParams & {
    params: Parameters<IndexerQueryClient["cw20Balances"]>;
  }
>({
  key: "indexerCw20Balances",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.cw20Balances(...params);
    },
});

export const userFiatSelector = selectorFamily<
  UserFiatResponse,
  QueryClientParams & {
    params: Parameters<IndexerQueryClient["userFiat"]>;
  }
>({
  key: "indexerFiatBalances",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.userFiat(...params);
    },
});

export const cw20BalanceSelector = selectorFamily<
  Cw20BalanceResponse,
  QueryClientParams & { params: Parameters<IndexerQueryClient["cw20Balance"]> }
>({
  key: "indexerIbcBalance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.cw20Balance(...params);
    },
});

export const swapRouteSelector = selectorFamily<
  SwapOperation[],
  QueryClientParams & { params: Readonly<Parameters<IndexerQueryClient["swapOperation"]>> }
>({
  key: "indexerRouteSwap",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      try {
        const client = get(queryClient(queryClientParams));
        return await client.swapOperation(...params);
      } catch (err) {
        return [];
      }
    },
});
