import { selectorFamily } from "recoil";
import { cosmWasmStargateClientSelector as cosmWasmClient } from "../chain";
import {
  ClaimsResponse,
  ConfigResponse,
  ExchangeRateResponse,
  ReinvestResponse,
  SupplyResponse,
  TargetValueResponse,
  ValidatorSetResponse,
} from "../../../clients/types/WyndLsdHub.types";
import { WyndLsdHubClient, WyndLsdHubQueryClient } from "../../../clients/WyndLsdHub.client";
import { signingCosmWasmStargateClientAtom as signingCosmWasmClientAtom } from "../../atoms";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndLsdHubQueryClient, QueryClientParams>({
  key: "wyndLsdHubQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClient);
      return new WyndLsdHubQueryClient(client, contractAddress);
    },
});
export type ExecuteClientParams = {
  contractAddress: string;
  sender: string;
};

export const executeClient = selectorFamily<WyndLsdHubClient | undefined, ExecuteClientParams>({
  key: "wyndexGaugesExecuteClient",
  get:
    ({ contractAddress, sender }) =>
    ({ get }) => {
      const client = get(signingCosmWasmClientAtom);
      if (!client) return;
      return new WyndLsdHubClient(client, sender, contractAddress);
    },
  dangerouslyAllowMutability: true,
});
export const configSelector = selectorFamily<
  ConfigResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["config"]>;
  }
>({
  key: "wyndLsdHubConfig",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.config(...params);
    },
});
export const claimsSelector = selectorFamily<
  ClaimsResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["claims"]>;
  }
>({
  key: "wyndLsdHubClaims",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.claims(...params);
    },
});
export const validatorSetSelector = selectorFamily<
  ValidatorSetResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["validatorSet"]>;
  }
>({
  key: "wyndLsdHubValidatorSet",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.validatorSet(...params);
    },
});
export const lastReinvestSelector = selectorFamily<
  ReinvestResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["lastReinvest"]>;
  }
>({
  key: "wyndLsdHubLastReinvest",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.lastReinvest(...params);
    },
});
export const supplySelector = selectorFamily<
  SupplyResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["supply"]>;
  }
>({
  key: "wyndLsdHubSupply",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.supply(...params);
    },
});
export const exchangeRateSelector = selectorFamily<
  ExchangeRateResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["exchangeRate"]>;
  }
>({
  key: "wyndLsdHubExchangeRate",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.exchangeRate(...params);
    },
});
export const targetValueSelector = selectorFamily<
  TargetValueResponse,
  QueryClientParams & {
    params: Parameters<WyndLsdHubQueryClient["targetValue"]>;
  }
>({
  key: "wyndLsdHubTargetValue",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.targetValue(...params);
    },
});
