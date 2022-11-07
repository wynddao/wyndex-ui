import { selectorFamily } from "recoil";
import { cosmWasmClientSelector } from "../chain";
import { signingCosmWasmClientAtom } from "../../atoms";
import { ConfigResponse, SimulateSwapOperationsResponse } from "../../../clients/types/WyndexMultiHop.types";
import { WyndexMultiHopClient, WyndexMultiHopQueryClient } from "../../../clients/WyndexMultiHop.client";

type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexMultiHopQueryClient, QueryClientParams>({
  key: "wyndexMultiHopQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClientSelector);
      return new WyndexMultiHopQueryClient(client, contractAddress);
    },
});

export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};

export const executeClient = selectorFamily<WyndexMultiHopClient | undefined, ExecuteClientParams>({
  key: "wyndexMultiHopExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      return new WyndexMultiHopClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});

export const configSelector = selectorFamily<
  ConfigResponse,
  QueryClientParams & {
    params: Parameters<WyndexMultiHopQueryClient["config"]>;
  }
>({
  key: "wyndexMultiHopConfig",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.config(...params);
    },
});
export const simulateSwapOperationsSelector = selectorFamily<
  SimulateSwapOperationsResponse,
  QueryClientParams & {
    params: Parameters<WyndexMultiHopQueryClient["simulateSwapOperations"]>;
  }
>({
  key: "wyndexMultiHopSimulateSwapOperations",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.simulateSwapOperations(...params);
    },
});
