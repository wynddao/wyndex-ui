import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { CHAIN_RPC_ENDPOINT } from "./constants";

export const getNativeTokenBalance = async (walletAddress: string, denom: string) => {
  const client = await CosmWasmClient.connect(CHAIN_RPC_ENDPOINT);
  const { amount } = await client.getBalance(walletAddress, denom);
  return amount;
};
