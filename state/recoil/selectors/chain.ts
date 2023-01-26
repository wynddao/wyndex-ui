import { ChainRecord } from "@cosmos-kit/core";
import { Asset, CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { Coin } from "cosmwasm";
import { selector, selectorFamily } from "recoil";
import { CHAIN_RPC_ENDPOINT, cosmWasmClientRouter, cosmWasmStargateClientRouter } from "../../../utils";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import { balanceSelector } from "./clients/cw20";

export const cosmWasmClientSelector = selector({
  key: "cosmWasmClient",
  get: () => cosmWasmClientRouter.connect(CHAIN_RPC_ENDPOINT),
});

export const cosmWasmStargateClientSelector = selector({
  key: "cosmWasmStargateClient",
  get: () => cosmWasmStargateClientRouter.connect(CHAIN_RPC_ENDPOINT),
});

export const coinByDenomSelector = selectorFamily<
  Coin,
  { readonly address: string | undefined; readonly serializedChainRecord: string }
>({
  key: "coinByDenom",
  get:
    ({ address, serializedChainRecord }) =>
    async ({ get }) => {
      try {
        const chainRecord: ChainRecord = JSON.parse(serializedChainRecord || "");
        const microdenom = chainRecord?.assetList?.assets[0]?.base;
        const chainUnits = chainRecord?.assetList?.assets[0]?.denom_units;

        if (!address || !microdenom) return { denom: "", amount: "0" };

        const denom = microdenomToDenom(microdenom ?? "");
        const denomUnit = chainUnits?.find((unit) => unit.denom.toLowerCase() === denom.toLowerCase());
        const decimals = denomUnit?.exponent || 0;

        const client = get(cosmWasmClientSelector);
        const microBalance = await client.getBalance(address, microdenom);

        const balance: Coin = { denom, amount: microamountToAmount(microBalance.amount, decimals) };
        return balance;
      } catch {
        return { denom: "", amount: "0" };
      }
    },
});

export const getBalanceByAsset = selectorFamily<Coin, { address: string; asset: Readonly<Asset> }>({
  key: "getBalanceByAsset",
  get:
    ({ address, asset }) =>
    async ({ get }) => {
      if (!address) return { amount: "0", denom: asset.denom };
      if (asset.tags.includes("cw20")) {
        const { balance } = get(
          balanceSelector({ contractAddress: (asset as CW20Asset).token_address, params: [{ address }] }),
        );
        return { amount: balance, denom: asset.denom } as Coin;
      }
      const client = get(cosmWasmStargateClientSelector);
      return await client.getBalance(
        address,
        asset.hasOwnProperty("juno_denom") ? (asset as IBCAsset).juno_denom : asset.denom,
      );
    },
});

export const blockHeightSelector = selector({
  key: "blockHeight",
  get: async ({ get }) => {
    const client = get(cosmWasmClientSelector);
    return await client.getHeight();
  },
});
