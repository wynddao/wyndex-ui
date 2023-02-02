import { Coin, StdFee } from "@cosmjs/amino";
import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import { ConfigResponse, Uint128 } from "./types/WyndDaoDistribution.types";
export interface DistributionReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
}
export class DistributionQueryClient implements DistributionReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
}
export interface DistributionInterface extends DistributionReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: (
    {
      admin,
      cw20Contract,
      epoch,
      payment,
      recipient,
    }: {
      admin?: string;
      cw20Contract?: string;
      epoch?: number;
      payment?: Uint128;
      recipient?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  payout: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class DistributionClient extends DistributionQueryClient implements DistributionInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.payout = this.payout.bind(this);
  }

  updateConfig = async (
    {
      admin,
      cw20Contract,
      epoch,
      payment,
      recipient,
    }: {
      admin?: string;
      cw20Contract?: string;
      epoch?: number;
      payment?: Uint128;
      recipient?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_config: {
          admin,
          cw20_contract: cw20Contract,
          epoch,
          payment,
          recipient,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  payout = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        payout: {},
      },
      fee,
      memo,
      funds,
    );
  };
}
