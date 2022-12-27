import { Coin } from "cosmwasm";
import { RequestAssetPrice } from "../../utils/assets";
import { AssetInfo } from "./types/WyndexFactory.types";
import { SwapOperation } from "./types/WyndexMultiHop.types";

interface IbcBalanceResponse {
  readonly address: string;
  readonly denom: string;
  readonly amount: string;
  readonly last_import_block_height: number;
}

export interface Cw20BalanceResponse {
  readonly address: string;
  readonly balance: string;
}

export interface UserFiatResponse {
  readonly availableBalance: {
    usd: number;
    eur: number;
  };
  readonly lockedBalance: {
    usd: number;
    eur: number;
  };
}
export type RequestSwap = {
  readonly askAsset: AssetInfo;
  readonly offerAsset: AssetInfo;
};

export interface IndexerQueryClientReadOnlyInterface {
  apiUrl: string;
  pools: () => Promise<any>;
  userPools: (walletAddress: string) => Promise<any>;
  assetPrices: () => Promise<any>;
  ibcBalances: (walletAddress: string | undefined) => Promise<readonly Coin[]>;
  ibcBalance: (walletAddress: string | undefined, microdenom: string) => Promise<Coin>;
  cw20Balances: (walletAddress: string | undefined) => Promise<readonly Cw20BalanceResponse[]>;
  cw20Balance: (walletAddress: string | undefined, tokenAddress: string) => Promise<Cw20BalanceResponse>;
}

export class IndexerQueryClient implements IndexerQueryClientReadOnlyInterface {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.pools = this.pools.bind(this);
  }

  pools = async (): Promise<any> => {
    const res = await fetch(`${this.apiUrl}/pools`);
    return await res.json();
  };

  userPools = async (walletAddress: string): Promise<any> => {
    const res = await fetch(`${this.apiUrl}/pools/user/${walletAddress}`);
    return await res.json();
  };

  userFiat = async (walletAddress: string): Promise<any> => {
    const res = await fetch(`${this.apiUrl}/assets/prices/${walletAddress}`);
    return await res.json();
  };

  assetPrices = async (): Promise<RequestAssetPrice[]> => {
    const res = await fetch(`${this.apiUrl}/assets/prices`);
    return await res.json();
  };

  swapOperation = async (reqOperation: RequestSwap): Promise<SwapOperation[]> => {
    const res = await fetch(`${this.apiUrl}/swap`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqOperation),
    });
    return (await res.json()) as SwapOperation[];
  };

  ibcBalances = async (walletAddress: string | undefined): Promise<readonly Coin[]> => {
    try {
      if (!walletAddress) throw new Error("walletAddress needs to be set");

      const res = await fetch(`${this.apiUrl}/assets/bank/${walletAddress}`);
      const ibcBalancesResponses: readonly IbcBalanceResponse[] = await res.json();

      const fetchError = (ibcBalancesResponses as any).error;
      if (fetchError) throw new Error(String(fetchError));

      const ibcBalances: readonly Coin[] = ibcBalancesResponses.map(({ denom, amount }) => ({
        denom,
        amount,
      }));
      return ibcBalances;
    } catch (error) {
      return [];
    }
  };

  // TODO use single balance query instead of querying all
  ibcBalance = async (walletAddress: string | undefined, microdenom: string): Promise<Coin> => {
    if (!walletAddress) return { denom: microdenom, amount: "0" };

    const ibcBalances: readonly Coin[] = await this.ibcBalances(walletAddress);
    const ibcBalance = ibcBalances.find((balance) => balance.denom === microdenom);

    return ibcBalance ? ibcBalance : { denom: microdenom, amount: "0" };
  };

  cw20Balances = async (walletAddress: string | undefined): Promise<readonly Cw20BalanceResponse[]> => {
    if (!walletAddress) return [];
    const res = await fetch(`${this.apiUrl}/assets/cw20/${walletAddress}`);
    const cw20BalancesResponses: readonly Cw20BalanceResponse[] = await res.json();
    console.log(cw20BalancesResponses);
    return cw20BalancesResponses;
  };

  // TODO use single balance query instead of querying all
  cw20Balance = async (
    walletAddress: string | undefined,
    tokenAddress: string,
  ): Promise<Cw20BalanceResponse> => {
    if (!walletAddress) return { address: tokenAddress, balance: "0" };

    const cw20Balances: readonly Cw20BalanceResponse[] = await this.cw20Balances(walletAddress);
    const cw20Balance = cw20Balances.find((balance) => balance.address === tokenAddress);

    return cw20Balance ? cw20Balance : { address: tokenAddress, balance: "0" };
  };
}
