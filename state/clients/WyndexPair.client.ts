import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  AssetInfo,
  Binary,
  Uint128,
  FeeConfig,
  Decimal,
  Asset,
  ConfigResponse,
  CumulativePricesResponse,
  PairInfo,
  PoolResponse,
  ReverseSimulationResponse,
  ArrayOfAssetValidated,
  SimulationResponse,
} from "./types/WyndexPair.types";
export interface WyndexPairReadOnlyInterface {
  contractAddress: string;
  pair: () => Promise<PairInfo>;
  pool: () => Promise<PoolResponse>;
  config: () => Promise<ConfigResponse>;
  share: ({ amount }: { amount: Uint128 }) => Promise<ArrayOfAssetValidated>;
  simulation: ({
    askAssetInfo,
    offerAsset,
    referral,
    referralCommission,
  }: {
    askAssetInfo?: AssetInfo;
    offerAsset: Asset;
    referral: boolean;
    referralCommission?: Decimal;
  }) => Promise<SimulationResponse>;
  reverseSimulation: ({
    askAsset,
    offerAssetInfo,
    referral,
    referralCommission,
  }: {
    askAsset: Asset;
    offerAssetInfo?: AssetInfo;
    referral: boolean;
    referralCommission?: Decimal;
  }) => Promise<ReverseSimulationResponse>;
  cumulativePrices: () => Promise<CumulativePricesResponse>;
  queryComputeD: () => Promise<Uint128>;
}
export class WyndexPairQueryClient implements WyndexPairReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.pair = this.pair.bind(this);
    this.pool = this.pool.bind(this);
    this.config = this.config.bind(this);
    this.share = this.share.bind(this);
    this.simulation = this.simulation.bind(this);
    this.reverseSimulation = this.reverseSimulation.bind(this);
    this.cumulativePrices = this.cumulativePrices.bind(this);
    this.queryComputeD = this.queryComputeD.bind(this);
  }

  pair = async (): Promise<PairInfo> => {
    return this.client.queryContractSmart(this.contractAddress, {
      pair: {},
    });
  };
  pool = async (): Promise<PoolResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      pool: {},
    });
  };
  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
  share = async ({ amount }: { amount: Uint128 }): Promise<ArrayOfAssetValidated> => {
    return this.client.queryContractSmart(this.contractAddress, {
      share: {
        amount,
      },
    });
  };
  simulation = async ({
    askAssetInfo,
    offerAsset,
    referral,
    referralCommission,
  }: {
    askAssetInfo?: AssetInfo;
    offerAsset: Asset;
    referral: boolean;
    referralCommission?: Decimal;
  }): Promise<SimulationResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      simulation: {
        ask_asset_info: askAssetInfo,
        offer_asset: offerAsset,
        referral,
        referral_commission: referralCommission,
      },
    });
  };
  reverseSimulation = async ({
    askAsset,
    offerAssetInfo,
    referral,
    referralCommission,
  }: {
    askAsset: Asset;
    offerAssetInfo?: AssetInfo;
    referral: boolean;
    referralCommission?: Decimal;
  }): Promise<ReverseSimulationResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      reverse_simulation: {
        ask_asset: askAsset,
        offer_asset_info: offerAssetInfo,
        referral,
        referral_commission: referralCommission,
      },
    });
  };
  cumulativePrices = async (): Promise<CumulativePricesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      cumulative_prices: {},
    });
  };
  queryComputeD = async (): Promise<Uint128> => {
    return this.client.queryContractSmart(this.contractAddress, {
      query_compute_d: {},
    });
  };
}
export interface WyndexPairInterface extends WyndexPairReadOnlyInterface {
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
  provideLiquidity: (
    {
      assets,
      receiver,
      slippageTolerance,
    }: {
      assets: Asset[];
      receiver?: string;
      slippageTolerance?: Decimal;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  swap: (
    {
      askAssetInfo,
      beliefPrice,
      maxSpread,
      offerAsset,
      referralAddress,
      referralCommission,
      to,
    }: {
      askAssetInfo?: AssetInfo;
      beliefPrice?: Decimal;
      maxSpread?: Decimal;
      offerAsset: Asset;
      referralAddress?: string;
      referralCommission?: Decimal;
      to?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  updateConfig: (
    {
      params,
    }: {
      params: Binary;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  updateFees: (
    {
      feeConfig,
    }: {
      feeConfig: FeeConfig;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  proposeNewOwner: (
    {
      expiresIn,
      owner,
    }: {
      expiresIn: number;
      owner: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  dropOwnershipProposal: (
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  claimOwnership: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class WyndexPairClient extends WyndexPairQueryClient implements WyndexPairInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.receive = this.receive.bind(this);
    this.provideLiquidity = this.provideLiquidity.bind(this);
    this.swap = this.swap.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.updateFees = this.updateFees.bind(this);
    this.proposeNewOwner = this.proposeNewOwner.bind(this);
    this.dropOwnershipProposal = this.dropOwnershipProposal.bind(this);
    this.claimOwnership = this.claimOwnership.bind(this);
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
  provideLiquidity = async (
    {
      assets,
      receiver,
      slippageTolerance,
    }: {
      assets: Asset[];
      receiver?: string;
      slippageTolerance?: Decimal;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        provide_liquidity: {
          assets,
          receiver,
          slippage_tolerance: slippageTolerance,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  swap = async (
    {
      askAssetInfo,
      beliefPrice,
      maxSpread,
      offerAsset,
      referralAddress,
      referralCommission,
      to,
    }: {
      askAssetInfo?: AssetInfo;
      beliefPrice?: Decimal;
      maxSpread?: Decimal;
      offerAsset: Asset;
      referralAddress?: string;
      referralCommission?: Decimal;
      to?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        swap: {
          ask_asset_info: askAssetInfo,
          belief_price: beliefPrice,
          max_spread: maxSpread,
          offer_asset: offerAsset,
          referral_address: referralAddress,
          referral_commission: referralCommission,
          to,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  updateConfig = async (
    {
      params,
    }: {
      params: Binary;
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
          params,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  updateFees = async (
    {
      feeConfig,
    }: {
      feeConfig: FeeConfig;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_fees: {
          fee_config: feeConfig,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  proposeNewOwner = async (
    {
      expiresIn,
      owner,
    }: {
      expiresIn: number;
      owner: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        propose_new_owner: {
          expires_in: expiresIn,
          owner,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  dropOwnershipProposal = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        drop_ownership_proposal: {},
      },
      fee,
      memo,
      funds,
    );
  };
  claimOwnership = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        claim_ownership: {},
      },
      fee,
      memo,
      funds,
    );
  };
}
