import { Coin } from "cosmwasm";
import { selector, selectorFamily } from "recoil";
import { CHAIN_RPC_ENDPOINT, cosmWasmClientRouter, cosmWasmStargateClientRouter } from "../../../utils";

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
  {
    readonly address?: string | undefined;
    readonly denom?: string | undefined;
  }
>({
  key: "coinByDenom",
  get:
    ({ address, denom }) =>
    async ({ get }) => {
      if (!address || !denom) return { denom: "", amount: "0" };

      const client = get(cosmWasmClientSelector);
      const coin = await client.getBalance(address, denom);
      return coin;
    },
});
