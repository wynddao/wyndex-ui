import { ChainRecord } from "@cosmos-kit/core";
import { Asset } from "@wynddao/asset-list";
import { Coin } from "cosmwasm";
import { selector, selectorFamily } from "recoil";
import {
  CHAIN_RPC_ENDPOINT,
  cosmWasmClientRouter,
  cosmWasmStargateClientRouter,
  DAO_STAKING_ADDRESS,
  WYND_TOKEN_ADDRESS,
} from "../../../utils";
import { microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import { balanceSelector, vestingSelector } from "./clients/cw20";
import { allStakedSelector } from "./clients/stake";

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

      if (!("token_address" in asset)) {
        const client = get(cosmWasmStargateClientSelector);
        const nativeDenom = "juno_denom" in asset ? asset.juno_denom : asset.denom;
        const nativeBalance = await client.getBalance(address, nativeDenom);
        return nativeBalance;
      }

      const { balance } = get(
        balanceSelector({ contractAddress: asset.token_address, params: [{ address }] }),
      );

      if (asset.token_address !== WYND_TOKEN_ADDRESS) {
        return { amount: balance, denom: asset.denom };
      }

      // For WYND token, take into account staked and vesting
      let { locked } = get(vestingSelector({ contractAddress: asset.token_address, params: [{ address }] }));
      if (!locked) {
        locked = "0";
      }
      const { stakes } = get(
        allStakedSelector({ contractAddress: DAO_STAKING_ADDRESS, params: [{ address }] }),
      );
      const totalStaked = stakes.reduce(
        (prevStake, stakedRes) => BigInt(prevStake) + BigInt(stakedRes.stake),
        BigInt(0),
      );
      const amount = (BigInt(balance) + totalStaked - BigInt(locked)).toString();

      return { amount, denom: asset.denom };
    },
});

export const blockHeightSelector = selector({
  key: "blockHeight",
  get: async ({ get }) => {
    const client = get(cosmWasmClientSelector);
    return await client.getHeight();
  },
});

export const blockHeightTimestampSafeSelector = selectorFamily<Date | undefined, number>({
  key: "blockHeightTimestamp",
  get:
    (blockHeight) =>
    async ({ get }) => {
      const client = get(cosmWasmClientSelector);
      try {
        const block = await client.getBlock(blockHeight);
        return new Date(Date.parse(block.header.time));
      } catch (error) {
        console.error(error);
      }
    },
});
