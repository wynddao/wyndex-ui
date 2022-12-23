import { asset_list } from "@chain-registry/osmosis";
import { Asset, CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { AssetInfo } from "../state/clients/types/WyndexFactory.types";
import { Currency } from "../state/recoil/atoms/settings";
import { getAssetList } from "./getAssetList";

const handleRandomCase = (text: string) =>
  text
    .split("")
    .map((char) => {
      const val = Math.random();
      if (val >= 0.5) return char.toUpperCase();
      return char.toLowerCase();
    })
    .join("");

export const OsmosisTokens = asset_list.assets.map(({ name, logo_URIs, symbol, traces, base, ibc }) => ({
  name: name,
  imgSrc: logo_URIs?.png,
  address: traces?.[0].counterparty.chain_name + handleRandomCase(base.slice(4)), // fake address
  symbol: symbol,
  traces: traces?.[0],
  ibc: ibc,
}));

export const getAssetInfo = (item: Asset) => {
  // If there is a contract address, token is cw20
  return item.tags.includes("cw20")
    ? {
        token: (item as CW20Asset).token_address,
      }
    : {
        // Take juno denom if available
        native: item.hasOwnProperty("juno_denom") ? (item as IBCAsset).juno_denom : item.denom,
      };
};

export const getDenom = (item: Asset): string => {
  return item.tags.includes("native") ? item.denom.slice(1) : item.denom;
};

type AssetInfoIndexer =
  | {
      token: string;
      amount: string;
    }
  | {
      native: string;
      amount: string;
    };

interface RequestAssetPrice {
  asset: string;
  priceInJuno: string;
  priceInEur: number;
  priceInUsd: number;
}

export const getAssetPrice = (
  asset: AssetInfo | AssetInfoIndexer,
  assetPrices: RequestAssetPrice[],
): RequestAssetPrice => {
  const price = assetPrices.find((el: RequestAssetPrice) => {
    const assetName = asset.hasOwnProperty("token")
      ? // @ts-ignore
        asset.token
      : // @ts-ignore
        asset.native;
    return el.asset == assetName;
  });
  return price ?? { asset: "0", priceInJuno: "0", priceInEur: 0, priceInUsd: 0 };
};

export const getAssetPriceByCurrency = (
  currency: Currency,
  asset: AssetInfo | AssetInfoIndexer,
  assetPrices: RequestAssetPrice[],
): number => {
  const price = getAssetPrice(asset, assetPrices);
  if (currency === "USD") return price.priceInUsd;
  if (currency === "EUR") return price.priceInEur;
  return 0;
};

export const getAmountByPrice = (
  amount: string,
  currency: Currency,
  asset: Asset,
  assetPrices: RequestAssetPrice[],
): number => {
  const assetInfo = getAssetInfo(asset);
  const price = getAssetPrice(assetInfo, assetPrices);
  if (currency === "USD") return Number(amount) * price.priceInUsd;
  if (currency === "EUR") return Number(amount) * price.priceInEur;
  return 0;
};

export const getAssetByTokenAddr = (tokenAddr: string): Asset | undefined => {
  const assetList = getAssetList();
  return assetList.tokens.find((a) => a.token_address === tokenAddr);
};

export const getAssetByDenom = (denom: string): Asset => {
  const assetList = getAssetList();
  return assetList.tokens.find((a) => a.denom === denom || a.juno_denom === denom) || ({} as Asset);
};

export const getNativeIbcTokenDenom = (denom: string) =>
  (denom.toLowerCase().startsWith("ibc")
    ? getAssetList().tokens.find((a) => a.juno_denom === denom)?.denom
    : denom) || "";
