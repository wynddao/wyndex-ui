import { Coin } from "cosmwasm";
import { AssetsRecap } from "../components/Dex/AssetBalances/AssetsRecapGallery";
import { REST_API_ENDPOINT } from "./constants";
import { Asset, Pair } from "./types";

/**
 * Get all assets, might have to add pagination later
 *
 * @returns Asset[]
 */
export const getAssets = async (): Promise<Asset[]> => {
  return fetch(REST_API_ENDPOINT + "/assets")
    .then((res) => res.json())
    .then((res) => {
      return res as Asset[];
    });
};

/**
 * Get one asset by name
 *
 * @param asset
 * @returns Asset
 */
export const getAsset = async (asset: string): Promise<Asset> => {
  return fetch(REST_API_ENDPOINT + "/asset/" + asset)
    .then((res) => res.json())
    .then((res) => {
      return res as Asset;
    });
};

/**
 * Get balance for all IBC coins from address
 *
 * @param address
 * @returns readonly Coin[]
 */
export const getIbcBalances = async (address: string): Promise<readonly Coin[]> => {
  try {
    const ibcBalancesResponse = await fetch(REST_API_ENDPOINT + "/balances/ibc/" + address);
    const ibcBalancesJson = await ibcBalancesResponse.json();
    if (ibcBalancesJson.error) return [];

    const ibcBalances: readonly Coin[] = ibcBalancesJson;
    return ibcBalances;
  } catch {
    return [];
  }
};

/**
 * Get balance for all CW20 coins from address
 *
 * @param address
 * @returns readonly Coin[]
 */
export const getCw20Balances = async (address: string): Promise<readonly Coin[]> => {
  try {
    const cw20BalancesResponse = await fetch(REST_API_ENDPOINT + "/balances/cw20/" + address);
    const cw20BalancesJson = await cw20BalancesResponse.json();
    if (cw20BalancesJson.error) return [];

    const cw20Balances: readonly Coin[] = cw20BalancesJson;
    return cw20Balances;
  } catch {
    return [];
  }
};

/**
 * Get IBC balance from address and coinName
 *
 * @param address
 * @param coinName
 * @returns Coin
 */
export const getIbcBalance = async (address: string, coinName: string): Promise<Coin | null> => {
  try {
    const ibcBalanceResponse = await fetch(REST_API_ENDPOINT + "/balance/" + address + "/ibc/" + coinName);
    const ibcBalanceJson = await ibcBalanceResponse.json();
    if (ibcBalanceJson.error) return null;

    const ibcBalance: Coin = ibcBalanceJson;
    return ibcBalance;
  } catch {
    return null;
  }
};

/**
 * Get native balance from address and coinName
 *
 * @param address
 * @param coinName
 * @returns Coin
 */
export const getNativeBalance = async (address: string, coinName: string): Promise<Coin | null> => {
  try {
    const nativeBalanceResponse = await fetch(
      REST_API_ENDPOINT + "/balance/" + address + "/native/" + coinName,
    );
    const nativeBalanceJson = await nativeBalanceResponse.json();
    if (nativeBalanceJson.error) return null;

    const nativeBalance: Coin = nativeBalanceJson;
    return nativeBalance;
  } catch {
    return null;
  }
};

/**
 * Get AssetsRecap from address
 *
 * @param address
 * @returns AssetsRecap
 */
export const getAssetsRecap = async (address: string): Promise<AssetsRecap> => {
  return fetch(REST_API_ENDPOINT + "/assetsRecap/" + address)
    .then((res) => res.json())
    .then((res) => {
      return res as AssetsRecap;
    });
};

/**
 * Get all pairs, might have to add pagination later
 *
 * @returns Pair[]
 */
export const getPairs = async (): Promise<Pair[]> => {
  return fetch(REST_API_ENDPOINT + "/pairs/")
    .then((res) => res.json())
    .then((res) => {
      return res as Pair[];
    });
};

/**
 * Get a pair by id
 *
 * @param pair
 * @returns
 */
export const getPair = async (pair: string): Promise<Pair> => {
  return fetch(REST_API_ENDPOINT + "/pair/" + pair)
    .then((res) => res.json())
    .then((res) => {
      return res as Pair;
    });
};
