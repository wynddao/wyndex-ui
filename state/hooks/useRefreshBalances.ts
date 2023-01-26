import { useWallet } from "@cosmos-kit/react";
import { Coin } from "cosmwasm";
import { useRecoilStateLoadable, useRecoilValueLoadable } from "recoil";
import { Cw20QueryClient } from "../clients";
import { Cw20BalanceResponse } from "../clients/Indexer.client";
import { AssetInfo } from "../clients/types/WyndexFactory.types";
import { cosmWasmStargateClientSelector } from "../recoil";
import { useIndexerInfos } from "./useIndexerInfos";

type NativeAssetInfo = Extract<AssetInfo, { native: string }>;
type Cw20AssetInfo = Extract<AssetInfo, { token: string }>;

export const useRefreshBalances = (): ((assets: readonly AssetInfo[]) => Promise<void>) => {
  const { address: walletAddress } = useWallet();
  const { state: clientState, contents: client } = useRecoilValueLoadable(cosmWasmStargateClientSelector);

  const { ibcBalancesSelector, cw20BalancesSelector } = useIndexerInfos({});
  const [, setIbcBalances] = useRecoilStateLoadable(ibcBalancesSelector);
  const [, setCw20Balances] = useRecoilStateLoadable(cw20BalancesSelector);

  async function refreshBalances(assets: readonly AssetInfo[]) {
    if (!walletAddress || clientState !== "hasValue") return;

    const ibcAssetsToRefresh = assets.filter((asset): asset is NativeAssetInfo => "native" in asset);
    const cw20AssetsToRefresh = assets.filter((asset): asset is Cw20AssetInfo => "token" in asset);

    if (ibcAssetsToRefresh.length) {
      const newBalances: readonly Coin[] = await Promise.all(
        ibcAssetsToRefresh.map(async ({ native: denom }) => {
          const { amount } = await client.getBalance(walletAddress, denom);
          return { denom, amount };
        }),
      );

      setIbcBalances((balances) => {
        const removedOldBalances = balances.filter(
          ({ denom }) => !newBalances.find((newBalance) => denom === newBalance.denom),
        );

        return [...removedOldBalances, ...newBalances];
      });
    }

    if (cw20AssetsToRefresh.length) {
      const newBalances: readonly Cw20BalanceResponse[] = await Promise.all(
        cw20AssetsToRefresh.map(async ({ token: address }) => {
          const cw20Client = new Cw20QueryClient(client, address);
          const { balance } = await cw20Client.balance({ address: walletAddress });
          return { address, balance };
        }),
      );

      setCw20Balances((balances) => {
        const removedOldBalances = balances.filter(
          ({ address }) => !newBalances.find((newBalance) => address === newBalance.address),
        );

        return [...removedOldBalances, ...newBalances];
      });
    }
  }

  return refreshBalances;
};
