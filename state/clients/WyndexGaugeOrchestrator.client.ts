import { Coin, StdFee } from "@cosmjs/amino";
import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import {
  Decimal,
  GaugeResponse,
  InfoResponse,
  ListGaugesResponse,
  ListOptionsResponse,
  ListVotesResponse,
  MemberDiff,
  SelectedSetResponse,
  Vote,
  VoteResponse,
} from "./types/WyndexGaugeOrchestrator.types";
export interface WyndexGaugeOrchestratorReadOnlyInterface {
  contractAddress: string;
  info: () => Promise<InfoResponse>;
  gauge: ({ id }: { id: number }) => Promise<GaugeResponse>;
  listGauges: ({ limit, startAfter }: { limit?: number; startAfter?: number }) => Promise<ListGaugesResponse>;
  vote: ({ gauge, voter }: { gauge: number; voter: string }) => Promise<VoteResponse>;
  listVotes: ({
    gauge,
    limit,
    startAfter,
  }: {
    gauge: number;
    limit?: number;
    startAfter?: string;
  }) => Promise<ListVotesResponse>;
  listOptions: ({
    gauge,
    limit,
    startAfter,
  }: {
    gauge: number;
    limit?: number;
    startAfter?: string;
  }) => Promise<ListOptionsResponse>;
  selectedSet: ({ gauge }: { gauge: number }) => Promise<SelectedSetResponse>;
}
export class WyndexGaugeOrchestratorQueryClient implements WyndexGaugeOrchestratorReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.info = this.info.bind(this);
    this.gauge = this.gauge.bind(this);
    this.listGauges = this.listGauges.bind(this);
    this.vote = this.vote.bind(this);
    this.listVotes = this.listVotes.bind(this);
    this.listOptions = this.listOptions.bind(this);
    this.selectedSet = this.selectedSet.bind(this);
  }

  info = async (): Promise<InfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      info: {},
    });
  };
  gauge = async ({ id }: { id: number }): Promise<GaugeResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      gauge: {
        id,
      },
    });
  };
  listGauges = async ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: number;
  }): Promise<ListGaugesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_gauges: {
        limit,
        start_after: startAfter,
      },
    });
  };
  vote = async ({ gauge, voter }: { gauge: number; voter: string }): Promise<VoteResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      vote: {
        gauge,
        voter,
      },
    });
  };
  listVotes = async ({
    gauge,
    limit,
    startAfter,
  }: {
    gauge: number;
    limit?: number;
    startAfter?: string;
  }): Promise<ListVotesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_votes: {
        gauge,
        limit,
        start_after: startAfter,
      },
    });
  };
  listOptions = async ({
    gauge,
    limit,
    startAfter,
  }: {
    gauge: number;
    limit?: number;
    startAfter?: string;
  }): Promise<ListOptionsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      list_options: {
        gauge,
        limit,
        start_after: startAfter,
      },
    });
  };
  selectedSet = async ({ gauge }: { gauge: number }): Promise<SelectedSetResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      selected_set: {
        gauge,
      },
    });
  };
}
export interface WyndexGaugeOrchestratorInterface extends WyndexGaugeOrchestratorReadOnlyInterface {
  contractAddress: string;
  sender: string;
  memberChangedHook: (
    {
      diffs,
    }: {
      diffs: MemberDiff[];
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  createGauge: (
    {
      adapter,
      epochSize,
      maxOptionsSelected,
      minPercentSelected,
      title,
    }: {
      adapter: string;
      epochSize: number;
      maxOptionsSelected: number;
      minPercentSelected?: Decimal;
      title: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  stopGauge: (
    {
      gauge,
    }: {
      gauge: number;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  addOption: (
    {
      gauge,
      option,
    }: {
      gauge: number;
      option: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  placeVotes: (
    {
      gauge,
      votes,
    }: {
      gauge: number;
      votes?: Vote[];
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  execute: (
    {
      gauge,
    }: {
      gauge: number;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class WyndexGaugeOrchestratorClient
  extends WyndexGaugeOrchestratorQueryClient
  implements WyndexGaugeOrchestratorInterface
{
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.memberChangedHook = this.memberChangedHook.bind(this);
    this.createGauge = this.createGauge.bind(this);
    this.stopGauge = this.stopGauge.bind(this);
    this.addOption = this.addOption.bind(this);
    this.placeVotes = this.placeVotes.bind(this);
    this.execute = this.execute.bind(this);
  }

  memberChangedHook = async (
    {
      diffs,
    }: {
      diffs: MemberDiff[];
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        member_changed_hook: {
          diffs,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  createGauge = async (
    {
      adapter,
      epochSize,
      maxOptionsSelected,
      minPercentSelected,
      title,
    }: {
      adapter: string;
      epochSize: number;
      maxOptionsSelected: number;
      minPercentSelected?: Decimal;
      title: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        create_gauge: {
          adapter,
          epoch_size: epochSize,
          max_options_selected: maxOptionsSelected,
          min_percent_selected: minPercentSelected,
          title,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  stopGauge = async (
    {
      gauge,
    }: {
      gauge: number;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        stop_gauge: {
          gauge,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  addOption = async (
    {
      gauge,
      option,
    }: {
      gauge: number;
      option: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        add_option: {
          gauge,
          option,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  placeVotes = async (
    {
      gauge,
      votes,
    }: {
      gauge: number;
      votes?: Vote[];
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        place_votes: {
          gauge,
          votes,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  execute = async (
    {
      gauge,
    }: {
      gauge: number;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        execute: {
          gauge,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}
