import { selectorFamily } from "recoil";

import {
  WyndexGaugeOrchestratorClient,
  WyndexGaugeOrchestratorQueryClient,
} from "../../../clients/WyndexGaugeOrchestrator.client";
import {
  GaugeResponse,
  ListGaugesResponse,
  ListOptionsResponse,
  ListVotesResponse,
  SelectedSetResponse,
  VoteResponse,
} from "../../../clients/types/WyndexGaugeOrchestrator.types";
import { signingCosmWasmStargateClientAtom as signingCosmWasmClientAtom } from "../../atoms";
import { cosmWasmStargateClientSelector as cosmWasmClient } from "../chain";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexGaugeOrchestratorQueryClient, QueryClientParams>({
  key: "wyndexGaugeOrchestratorQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClient);
      return new WyndexGaugeOrchestratorQueryClient(client, contractAddress);
    },
});
export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};

export const executeClient = selectorFamily<WyndexGaugeOrchestratorClient | undefined, ExecuteClientParams>({
  key: "wyndexGaugesExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      return new WyndexGaugeOrchestratorClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});
export const gaugeSelector = selectorFamily<
  GaugeResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeOrchestratorQueryClient["gauge"]>;
  }
>({
  key: "wyndexGaugeOrchestratorGauge",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.gauge(...params);
    },
});
export const listGaugesSelector = selectorFamily<
  ListGaugesResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeOrchestratorQueryClient["listGauges"]>;
  }
>({
  key: "wyndexGaugeOrchestratorListGauges",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.listGauges(...params);
    },
});
export const voteSelector = selectorFamily<
  VoteResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeOrchestratorQueryClient["vote"]>;
  }
>({
  key: "wyndexGaugeOrchestratorVote",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.vote(...params);
    },
});
export const listVotesSelector = selectorFamily<
  ListVotesResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeOrchestratorQueryClient["listVotes"]>;
  }
>({
  key: "wyndexGaugeOrchestratorListVotes",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.listVotes(...params);
    },
});
export const listOptionsSelector = selectorFamily<
  ListOptionsResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeOrchestratorQueryClient["listOptions"]>;
  }
>({
  key: "wyndexGaugeOrchestratorListOptions",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.listOptions(...params);
    },
});
export const selectedSetSelector = selectorFamily<
  SelectedSetResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeOrchestratorQueryClient["selectedSet"]>;
  }
>({
  key: "wyndexGaugeOrchestratorSelectedSet",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.selectedSet(...params);
    },
});
