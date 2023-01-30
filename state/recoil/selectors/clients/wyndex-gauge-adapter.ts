/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.19.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { selectorFamily } from "recoil";

import { WyndexGaugeAdapterQueryClient } from "../../../clients/WyndexGaugeAdapter.client";
import {
  AllOptionsResponse,
  CheckOptionResponse,
  Config,
  SampleGaugeMsgsResponse,
} from "../../../clients/types/WyndexGaugeAdapter.types";
import { cosmWasmStargateClientSelector as cosmWasmClient } from "../chain";
type QueryClientParams = {
  contractAddress: string;
};
export const queryClient = selectorFamily<WyndexGaugeAdapterQueryClient, QueryClientParams>({
  key: "wyndexGaugeAdapterQueryClient",
  get:
    ({ contractAddress }) =>
    ({ get }) => {
      const client = get(cosmWasmClient);
      return new WyndexGaugeAdapterQueryClient(client, contractAddress);
    },
});
export const configSelector = selectorFamily<
  Config,
  QueryClientParams & {
    params: Parameters<WyndexGaugeAdapterQueryClient["config"]>;
  }
>({
  key: "wyndexGaugeAdapterConfig",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.config(...params);
    },
});
export const allOptionsSelector = selectorFamily<
  AllOptionsResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeAdapterQueryClient["allOptions"]>;
  }
>({
  key: "wyndexGaugeAdapterAllOptions",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.allOptions(...params);
    },
});
export const checkOptionSelector = selectorFamily<
  CheckOptionResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeAdapterQueryClient["checkOption"]>;
  }
>({
  key: "wyndexGaugeAdapterCheckOption",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.checkOption(...params);
    },
});
export const sampleGaugeMsgsSelector = selectorFamily<
  SampleGaugeMsgsResponse,
  QueryClientParams & {
    params: Parameters<WyndexGaugeAdapterQueryClient["sampleGaugeMsgs"]>;
  }
>({
  key: "wyndexGaugeAdapterSampleGaugeMsgs",
  get:
    ({ params, ...queryClientParams }) =>
    async ({ get }) => {
      const client = get(queryClient(queryClientParams));
      return await client.sampleGaugeMsgs(...params);
    },
});
