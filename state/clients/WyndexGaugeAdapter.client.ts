import { StdFee } from "@cosmjs/amino";
import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import {
  AllOptionsResponse,
  CheckOptionResponse,
  Coin,
  Config,
  SampleGaugeMsgsResponse,
  Uint128,
} from "./types/WyndexGaugeAdapter.types";
export interface WyndexGaugeAdapterReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<Config>;
  allOptions: () => Promise<AllOptionsResponse>;
  checkOption: ({ option }: { option: string }) => Promise<CheckOptionResponse>;
  sampleGaugeMsgs: ({ selected }: { selected: string[][] }) => Promise<SampleGaugeMsgsResponse>;
}
export class WyndexGaugeAdapterQueryClient implements WyndexGaugeAdapterReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.allOptions = this.allOptions.bind(this);
    this.checkOption = this.checkOption.bind(this);
    this.sampleGaugeMsgs = this.sampleGaugeMsgs.bind(this);
  }

  config = async (): Promise<Config> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
  allOptions = async (): Promise<AllOptionsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_options: {},
    });
  };
  checkOption = async ({ option }: { option: string }): Promise<CheckOptionResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      check_option: {
        option,
      },
    });
  };
  sampleGaugeMsgs = async ({ selected }: { selected: string[][] }): Promise<SampleGaugeMsgsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      sample_gauge_msgs: {
        selected,
      },
    });
  };
}
export interface WyndexGaugeAdapterInterface extends WyndexGaugeAdapterReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateRewards: (
    {
      amount,
    }: {
      amount: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class WyndexGaugeAdapterClient
  extends WyndexGaugeAdapterQueryClient
  implements WyndexGaugeAdapterInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateRewards = this.updateRewards.bind(this);
  }

  updateRewards = async (
    {
      amount,
    }: {
      amount: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_rewards: {
          amount,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}
