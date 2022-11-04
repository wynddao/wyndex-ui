import { selectorFamily } from "recoil";
import { cosmWasmClientSelector } from "../chain";
import {
  Uint128,
  ConfigResponse,
  CumulativePricesResponse,
  PairInfo,
  PoolResponse,
  ArrayOfAssetValidated,
} from "../../../clients/types/WyndexFactory.types";
import { WyndexFactoryQueryClient } from "../../../clients/WyndexFactory.client";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexFactoryQueryClient, QueryClientParams>({
  key: "wyndexFactoryQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClientSelector);
      return new WyndexFactoryQueryClient(client, contractAddress);
    },
});
export const pairSelector = selectorFamily<
  PairInfo,
  QueryClientParams & {
    params: Parameters<WyndexFactoryQueryClient["pair"]>;
  }
>({
  key: "wyndexFactoryPair",
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
    params: Parameters<WyndexFactoryQueryClient["pool"]>;
  }
>({
  key: "wyndexFactoryPool",
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
    params: Parameters<WyndexFactoryQueryClient["config"]>;
  }
>({
  key: "wyndexFactoryConfig",
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
    params: Parameters<WyndexFactoryQueryClient["share"]>;
  }
>({
  key: "wyndexFactoryShare",
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
    params: Parameters<WyndexFactoryQueryClient["cumulativePrices"]>;
  }
>({
  key: "wyndexFactoryCumulativePrices",
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
    params: Parameters<WyndexFactoryQueryClient["queryComputeD"]>;
  }
>({
  key: "wyndexFactoryQueryComputeD",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.queryComputeD(...params);
    },
});
