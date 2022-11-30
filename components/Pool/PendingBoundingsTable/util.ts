import { toUtf8, CosmWasmClient, fromUtf8 } from "cosmwasm";
import { CHAIN_RPC_ENDPOINT } from "../../../utils";

export interface BondingInfo {
  // strings are Uint128
  stake: string;
  votes: string;
  rewards: string;
  // array of [timestamp, amount] pairs
  locked_tokens: number[][];
}

export async function getPendingRebonding(address: string, unbondingPeriod: number, contractAddress: string) {
  const client = await CosmWasmClient.connect(CHAIN_RPC_ENDPOINT);
  const prefix1 = [0, 5];
  const val1 = toUtf8("stake");
  const prefix2 = [0, address.length];
  const val2 = toUtf8(address);
  const period = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 7; unbondingPeriod > 0; i--) {
    period[i] = unbondingPeriod % 256;
    unbondingPeriod = Math.floor(unbondingPeriod / 256);
  }
  const key = new Uint8Array([...prefix1, ...val1, ...prefix2, ...val2, ...period]);
  const bin = await client.queryContractRaw(contractAddress, key);
  if (!bin) {
    throw new Error(`No result for ${key}`);
  }
  try {
    const info = JSON.parse(fromUtf8(bin));
    return info;
  } catch (e) {
    return { locked_tokens: [] };
  }
}
