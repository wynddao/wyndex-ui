import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Uint128,
  Binary,
  Decimal,
  SwapOperation,
  AssetInfo,
  ConfigResponse,
  SimulateSwapOperationsResponse,
} from "./types/WyndexMultiHop.types";
export interface WyndexMultiHopReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  simulateSwapOperations: ({
    offerAmount,
    operations,
    referral,
    referralCommission,
  }: {
    offerAmount: Uint128;
    operations: SwapOperation[];
    referral: boolean;
    referralCommission?: Decimal;
  }) => Promise<SimulateSwapOperationsResponse>;
}
export class WyndexMultiHopQueryClient implements WyndexMultiHopReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.simulateSwapOperations = this.simulateSwapOperations.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
  simulateSwapOperations = async ({
    offerAmount,
    operations,
    referral,
    referralCommission,
  }: {
    offerAmount: Uint128;
    operations: SwapOperation[];
    referral: boolean;
    referralCommission?: Decimal;
  }): Promise<SimulateSwapOperationsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      simulate_swap_operations: {
        offer_amount: offerAmount,
        operations,
        referral,
        referral_commission: referralCommission,
      },
    });
  };
}
export interface WyndexMultiHopInterface extends WyndexMultiHopReadOnlyInterface {
  contractAddress: string;
  sender: string;
  receive: (
    {
      amount,
      msg,
      sender,
    }: {
      amount: Uint128;
      msg: Binary;
      sender: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  executeSwapOperations: (
    {
      maxSpread,
      minimumReceive,
      operations,
      receiver,
      referralAddress,
      referralCommission,
    }: {
      maxSpread?: Decimal;
      minimumReceive?: Uint128;
      operations: SwapOperation[];
      receiver?: string;
      referralAddress?: string;
      referralCommission?: Decimal;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  executeSwapOperation: (
    {
      maxSpread,
      operation,
      receiver,
      referralAddress,
      referralCommission,
      single,
    }: {
      maxSpread?: Decimal;
      operation: SwapOperation;
      receiver?: string;
      referralAddress?: string;
      referralCommission?: Decimal;
      single: boolean;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  assertMinimumReceive: (
    {
      assetInfo,
      minimumReceive,
      prevBalance,
      receiver,
    }: {
      assetInfo: AssetInfo;
      minimumReceive: Uint128;
      prevBalance: Uint128;
      receiver: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class WyndexMultiHopClient extends WyndexMultiHopQueryClient implements WyndexMultiHopInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.receive = this.receive.bind(this);
    this.executeSwapOperations = this.executeSwapOperations.bind(this);
    this.executeSwapOperation = this.executeSwapOperation.bind(this);
    this.assertMinimumReceive = this.assertMinimumReceive.bind(this);
  }

  receive = async (
    {
      amount,
      msg,
      sender,
    }: {
      amount: Uint128;
      msg: Binary;
      sender: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        receive: {
          amount,
          msg,
          sender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  executeSwapOperations = async (
    {
      maxSpread,
      minimumReceive,
      operations,
      receiver,
      referralAddress,
      referralCommission,
    }: {
      maxSpread?: Decimal;
      minimumReceive?: Uint128;
      operations: SwapOperation[];
      receiver?: string;
      referralAddress?: string;
      referralCommission?: Decimal;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        execute_swap_operations: {
          max_spread: maxSpread,
          minimum_receive: minimumReceive,
          operations,
          receiver,
          referral_address: referralAddress,
          referral_commission: referralCommission,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  executeSwapOperation = async (
    {
      maxSpread,
      operation,
      receiver,
      referralAddress,
      referralCommission,
      single,
    }: {
      maxSpread?: Decimal;
      operation: SwapOperation;
      receiver?: string;
      referralAddress?: string;
      referralCommission?: Decimal;
      single: boolean;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        execute_swap_operation: {
          max_spread: maxSpread,
          operation,
          receiver,
          referral_address: referralAddress,
          referral_commission: referralCommission,
          single,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  assertMinimumReceive = async (
    {
      assetInfo,
      minimumReceive,
      prevBalance,
      receiver,
    }: {
      assetInfo: AssetInfo;
      minimumReceive: Uint128;
      prevBalance: Uint128;
      receiver: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        assert_minimum_receive: {
          asset_info: assetInfo,
          minimum_receive: minimumReceive,
          prev_balance: prevBalance,
          receiver,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}
