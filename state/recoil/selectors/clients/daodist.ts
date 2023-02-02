import { selectorFamily } from "recoil";

import {
  DistributionClient as ExecuteClient,
  DistributionQueryClient as QueryClient,
} from "../../../clients/WyndDaoDistribution.client";
import { ConfigResponse } from "../../../clients/types/WyndDaoDistribution.types";
import { signingCosmWasmStargateClientAtom as signingCosmWasmClientAtom } from "../../atoms";
import { cosmWasmStargateClientSelector as cosmWasmClientSelector } from "../chain";

type QueryClientParams = {
  contractAddress: string;
};

const queryClient = selectorFamily<QueryClient, QueryClientParams>({
  key: "wyndDistributionQueryClient",
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
  key: "wyndDistributionExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      return new ExecuteClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});

export const configSelector = selectorFamily<ConfigResponse, QueryClientParams>({
  key: "wyndVestingTokenInfo",
  get:
    (queryClientParams) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));

      return await client.config();
    },
});
