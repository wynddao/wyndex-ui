import { Asset, CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { Coin } from "cosmwasm";
import { Cw20BalanceResponse } from "../../../state/clients/Indexer.client";
import { TokenFilterOptions } from "./TokenFilter";

export type ExtendedAsset = Asset & {
  readonly balance: string;
  readonly isFav: boolean;
};

export function getAssetId(asset: Asset): string {
  return "token_address" in asset ? asset.token_address : asset.id;
}

export function extendIbcAssets(
  ibcAssets: readonly IBCAsset[],
  ibcBalances: readonly Coin[],
  favAssets: readonly string[],
): readonly ExtendedAsset[] {
  const extendIbcAsset = (asset: IBCAsset): ExtendedAsset => {
    const balance =
      ibcBalances.find((coin) => coin.denom === asset.juno_denom || coin.denom === asset.denom)?.amount ??
      "0";
    const isFav = favAssets.find((el) => el === getAssetId(asset)) ? true : false;
    return { ...asset, balance, isFav };
  };

  const ibcExtendedAssets = ibcAssets.map(extendIbcAsset);
  return ibcExtendedAssets;
}

export function extendCw20Assets(
  cw20Assets: readonly CW20Asset[],
  cw20Balances: readonly Cw20BalanceResponse[],
  favAssets: readonly string[],
): readonly ExtendedAsset[] {
  const extendCw20Asset = (asset: CW20Asset): ExtendedAsset => {
    const balance = cw20Balances.find((balance) => balance.address === asset.token_address)?.balance ?? "0";
    const isFav = favAssets.find((el) => el === getAssetId(asset)) ? true : false;
    return { ...asset, balance, isFav };
  };

  const cw20ExtendedAssets = cw20Assets.map(extendCw20Asset);
  return cw20ExtendedAssets;
}

export function filterAssets(
  assets: readonly ExtendedAsset[],
  filterOption: TokenFilterOptions,
  searchText: string,
): readonly ExtendedAsset[] {
  const isSearchedAsset = (asset: ExtendedAsset) =>
    asset.name.toLowerCase().includes(searchText.toLowerCase());

  if (filterOption === "Juno Assets") {
    return assets.filter((asset) => asset.tags === "cw20" && isSearchedAsset(asset));
  }

  if (filterOption === "Native") {
    return assets.filter((asset) => asset.tags !== "cw20" && isSearchedAsset(asset));
  }

  return assets.filter((asset) => isSearchedAsset(asset));
}

export function sortAssets(
  assets: readonly ExtendedAsset[],
  favAssets: readonly string[],
): readonly ExtendedAsset[] {
  const compareAssets = (a: ExtendedAsset, b: ExtendedAsset) => {
    const isFirstFav = favAssets.find((el) => el === getAssetId(a)) ? true : false;
    const isSecondFav = favAssets.find((el) => el === getAssetId(b)) ? true : false;

    if (isFirstFav && !isSecondFav) {
      return -1;
    }

    if (!isFirstFav && isSecondFav) {
      return 1;
    }

    return parseFloat(b.balance) - parseFloat(a.balance);
  };

  const sortedAssets = assets.slice().sort(compareAssets);
  return sortedAssets;
}

export function prepareAssets(
  assets: readonly Asset[],
  ibcBalances: readonly Coin[],
  cw20Balances: readonly Cw20BalanceResponse[],
  favAssets: readonly string[],
  filterOption: TokenFilterOptions,
  searchText: string,
): readonly ExtendedAsset[] {
  const ibcAssets = assets.filter((asset): asset is IBCAsset => asset.tags !== "cw20");
  const cw20Assets = assets.filter((asset): asset is CW20Asset => asset.tags === "cw20");
  const ibcExtendedAssets = extendIbcAssets(ibcAssets, ibcBalances, favAssets);
  const cw20ExtendedAssets = extendCw20Assets(cw20Assets, cw20Balances, favAssets);
  const extendedAssets = [...ibcExtendedAssets, ...cw20ExtendedAssets];
  const filteredAssets = filterAssets(extendedAssets, filterOption, searchText);
  const sortedAssets = sortAssets(filteredAssets, favAssets);

  return sortedAssets;
}
