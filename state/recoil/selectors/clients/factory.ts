import { selectorFamily } from "recoil";
import { WyndexFactoryClient, WyndexFactoryQueryClient } from "../../../clients";
import {
  ArrayOfAddr,
  ArrayOfPairType,
  ConfigResponse,
  FeeInfoResponse,
  PairInfo,
  PairsResponse,
} from "../../../clients/types/WyndexFactory.types";
import { signingCosmWasmStargateClientAtom } from "../../atoms";
import { cosmWasmStargateClientSelector } from "../chain";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexFactoryQueryClient, QueryClientParams>({
  key: "wyndexFactoryQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmStargateClientSelector);
      return new WyndexFactoryQueryClient(client, contractAddress);
    },
});

export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};

export const executeClient = selectorFamily<WyndexFactoryClient | undefined, ExecuteClientParams>({
  key: "wyndexFactoryExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmStargateClientAtom);
      if (!client) return;
      return new WyndexFactoryClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
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
export const pairsSelector = selectorFamily<
  PairsResponse,
  QueryClientParams & {
    params: Parameters<WyndexFactoryQueryClient["pairs"]>;
  }
>({
  key: "wyndexFactoryPairs",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.pairs(...params);
    },
});
export const feeInfoSelector = selectorFamily<
  FeeInfoResponse,
  QueryClientParams & {
    params: Parameters<WyndexFactoryQueryClient["feeInfo"]>;
  }
>({
  key: "wyndexFactoryFeeInfo",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.feeInfo(...params);
    },
});
export const blacklistedPairTypesSelector = selectorFamily<
  ArrayOfPairType,
  QueryClientParams & {
    params: Parameters<WyndexFactoryQueryClient["blacklistedPairTypes"]>;
  }
>({
  key: "wyndexFactoryBlacklistedPairTypes",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.blacklistedPairTypes(...params);
    },
});
export const pairsToMigrateSelector = selectorFamily<
  ArrayOfAddr,
  QueryClientParams & {
    params: Parameters<WyndexFactoryQueryClient["pairsToMigrate"]>;
  }
>({
  key: "wyndexFactoryPairsToMigrate",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.pairsToMigrate(...params);
    },
});
