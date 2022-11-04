import { selectorFamily } from "recoil";
import { cosmWasmClientSelector } from "../chain";
import {
  Uint128,
  ConfigResponse,
  CumulativePricesResponse,
  PairInfo,
  PoolResponse,
  ArrayOfAssetValidated,
} from "../../../clients/types/WyndexPair.types";
import { WyndexPairQueryClient } from "../../../clients/WyndexPair.client";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexPairQueryClient, QueryClientParams>({
  key: "wyndexPairQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClientSelector);
      return new WyndexPairQueryClient(client, contractAddress);
    },
});
export const pairSelector = selectorFamily<
  PairInfo,
  QueryClientParams & {
    params: Parameters<WyndexPairQueryClient["pair"]>;
  }
>({
  key: "wyndexPairPair",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.pair(...params);
    },
});
export const poolSelector = selectorFamily<
  PoolResponse,
  QueryClientParams & {
    params: Parameters<WyndexPairQueryClient["pool"]>;
  }
>({
  key: "wyndexPairPool",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.pool(...params);
    },
});
export const configSelector = selectorFamily<
  ConfigResponse,
  QueryClientParams & {
    params: Parameters<WyndexPairQueryClient["config"]>;
  }
>({
  key: "wyndexPairConfig",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.config(...params);
    },
});
export const shareSelector = selectorFamily<
  ArrayOfAssetValidated,
  QueryClientParams & {
    params: Parameters<WyndexPairQueryClient["share"]>;
  }
>({
  key: "wyndexPairShare",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.share(...params);
    },
});

export const cumulativePricesSelector = selectorFamily<
  CumulativePricesResponse,
  QueryClientParams & {
    params: Parameters<WyndexPairQueryClient["cumulativePrices"]>;
  }
>({
  key: "wyndexPairCumulativePrices",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.cumulativePrices(...params);
    },
});
export const queryComputeDSelector = selectorFamily<
  Uint128,
  QueryClientParams & {
    params: Parameters<WyndexPairQueryClient["queryComputeD"]>;
  }
>({
  key: "wyndexPairQueryComputeD",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.queryComputeD(...params);
    },
});
