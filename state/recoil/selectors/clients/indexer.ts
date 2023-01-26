import { Coin } from "cosmwasm";
import { atom, selectorFamily } from "recoil";
import { RequestAssetPrice } from "../../../../utils/assets";
import { Cw20BalanceResponse, IndexerQueryClient, UserFiatResponse } from "../../../clients/Indexer.client";
import { AssetInfoValidated } from "../../../clients/types/WyndexFactory.types";
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

export const assetPricesSelector = selectorFamily<RequestAssetPrice[], QueryClientParams>({
  key: "indexerPrices",
  get:
    ({ ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.assetPrices();
    },
});

export const ibcBalancesAtom = atom<readonly Coin[]>({
  key: "indexerIbcBalancesAtom",
  default: [],
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
      const ibcBalances = get(ibcBalancesAtom);
      if (ibcBalances.length) return ibcBalances;

      const client = get(queryClient(queryClientParams));
      return await client.ibcBalances(...params);
    },
  set:
    () =>
    ({ set }, newValue) =>
      set(ibcBalancesAtom, newValue),
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

export const cw20BalancesAtom = atom<readonly Cw20BalanceResponse[]>({
  key: "indexerCw20BalancesAtom",
  default: [],
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
      const cw20Balances = get(cw20BalancesAtom);
      if (cw20Balances.length) return cw20Balances;

      const client = get(queryClient(queryClientParams));
      return await client.cw20Balances(...params);
    },
  set:
    () =>
    ({ set }, newValue) =>
      set(cw20BalancesAtom, newValue),
});

export const cw20BalanceSelector = selectorFamily<
  string,
  QueryClientParams & { params: Parameters<IndexerQueryClient["cw20Balance"]> }
>({
  key: "indexerIbcBalance",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return (await client.cw20Balance(...params)).balance;
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
