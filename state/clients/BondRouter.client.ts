/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.26.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { InstantiateMsg, ExecuteMsg, QueryMsg, Uint128, MigrateMsg, ConfigResponse, SimulateResponse } from "./types/BondRouter.types";
export interface BondRouterReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  simulate: ({
    bond
  }: {
    bond: Uint128;
  }) => Promise<SimulateResponse>;
}
export class BondRouterQueryClient implements BondRouterReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.simulate = this.simulate.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  simulate = async ({
    bond
  }: {
    bond: Uint128;
  }): Promise<SimulateResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      simulate: {
        bond
      }
    });
  };
}
export interface BondRouterInterface extends BondRouterReadOnlyInterface {
  contractAddress: string;
  sender: string;
  bond: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class BondRouterClient extends BondRouterQueryClient implements BondRouterInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.bond = this.bond.bind(this);
  }

  bond = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      bond: {}
    }, fee, memo, funds);
  };
}