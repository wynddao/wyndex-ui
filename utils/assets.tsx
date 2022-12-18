import { asset_list } from "@chain-registry/osmosis";
import { Asset, CW20Asset } from "@wynddao/asset-list";
import { string } from "zod";
import { AssetInfo } from "../state/clients/types/WyndexFactory.types";
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
        native_token: item.denom,
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
      native_token: string;
      amount: string;
    };

interface GetAssetPriceResponse {
  token?: string;
  juno_price: string;
  priceInEur: number;
  priceInUsd: number;
}

export const getAssetPrice = (
  asset: AssetInfo | AssetInfoIndexer,
  assetPrices: any[],
): GetAssetPriceResponse => {
  const price = assetPrices.find((el: any) => {
    const assetName = asset.hasOwnProperty("token")
      ? // @ts-ignore
        asset.token
      : // @ts-ignore
        asset.native_token;
    return el.asset == assetName;
  });

  return price ?? { juno_price: 0, priceInEur: 0, priceInUsd: 0 };
};
