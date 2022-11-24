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
