/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.19.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Uint128,
  Logo,
  EmbeddedLogo,
  Binary,
  InstantiateMsg,
  Cw20Coin,
  InstantiateMarketingInfo,
  MinterResponse,
  ExecuteMsg,
  Expiration,
  Timestamp,
  Uint64,
  QueryMsg,
  AllAccountsResponse,
  AllAllowancesResponse,
  AllowanceInfo,
  AllSpenderAllowancesResponse,
  SpenderAllowanceInfo,
  AllowanceResponse,
  BalanceResponse,
  DownloadLogoResponse,
  LogoInfo,
  Addr,
  MarketingInfoResponse,
  TokenInfoResponse,
} from "./types/Cw20.types";
export class Cw20QueryClient {
  client: CosmWasmClient;

  constructor(client: CosmWasmClient) {
    this.client = client;
  }
}

export class Cw20Client extends Cw20QueryClient {
  client: SigningCosmWasmClient;
  sender: string;

  constructor(client: SigningCosmWasmClient, sender: string) {
    super(client);
    this.client = client;
    this.sender = sender;
    this.increaseAllowance = this.increaseAllowance.bind(this);
    this.decreaseAllowance = this.decreaseAllowance.bind(this);
  }

  increaseAllowance = async (
    {
      amount,
      expires,
      spender,
      contractAddress,
    }: {
      amount: Uint128;
      expires?: Expiration;
      spender: string;
      contractAddress: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      contractAddress,
      {
        increase_allowance: {
          amount,
          expires,
          spender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  decreaseAllowance = async (
    {
      amount,
      expires,
      spender,
      contractAddress,
    }: {
      amount: Uint128;
      expires?: Expiration;
      spender: string;
      contractAddress: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      contractAddress,
      {
        decrease_allowance: {
          amount,
          expires,
          spender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}
