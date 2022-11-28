import { Coin } from "cosmwasm";
import { AssetsRecap } from "../components/AssetBalances";
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
 * Get balance for all coins from address
 *
 * @param address
 * @returns readonly Coin[]
 */
export const getBalances = async (address: string): Promise<readonly Coin[]> => {
  return fetch(REST_API_ENDPOINT + "/balances/" + address)
    .then((res) => res.json())
    .then((res) => {
      return res as readonly Coin[];
    });
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
