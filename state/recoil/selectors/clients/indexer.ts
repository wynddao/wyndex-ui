import { Coin } from "cosmwasm";
import { selectorFamily } from "recoil";
import { RequestAssetPrice } from "../../../../utils/assets";
import { Cw20BalanceResponse, IndexerQueryClient, UserFiatResponse } from "../../../clients/Indexer.client";
import { AssetInfoValidated } from "../../../clients/types/WyndexFactory.types";
import { SwapOperation } from "../../../clients/types/WyndexMultiHop.types";
import { AnnualizedRewardsResponse } from "../../../clients/types/WyndexStake.types";

type QueryClientParams = {
  apiUrl: string;
};

export interface PairsResponse {
  pair: string;
  staking: string;
  lp: string;
}

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

export const pairsSelector = selectorFamily<PairsResponse[], QueryClientParams>({
  key: "indexerPools",
  get:
    ({ ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.pairs();
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

export const assetPricesSelector = selectorFamily<RequestAssetPrice[], QueryClientParams>({
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

export const rewardsSelector = selectorFamily<
  AnnualizedRewardsResponse,
  QueryClientParams & { params: Parameters<IndexerQueryClient["rewards"]> }
>({
  key: "indexerIbcBalance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.rewards(...params);
    },
});

export const assetInfosBalancesSelector = selectorFamily<
  [string, string],
  QueryClientParams & {
    params: [walletAddress: string | undefined, assetInfos: readonly AssetInfoValidated[]];
  }
>({
  key: "indexerIbcBalance",
  get:
    ({ apiUrl, params: [walletAddress, [assetA, assetB]] }) =>
    async ({ get }) => {
      if (!walletAddress) return ["0", "0"];

      const client = get(queryClient({ apiUrl }));
      const assetABalance =
        "token" in assetA
          ? (await client.cw20Balance(walletAddress, assetA.token)).balance
          : (await client.ibcBalance(walletAddress, assetA.native)).amount;
      const assetBBalance =
        "token" in assetB
          ? (await client.cw20Balance(walletAddress, assetB.token)).balance
          : (await client.ibcBalance(walletAddress, assetB.native)).amount;

      return [assetABalance, assetBBalance];
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
