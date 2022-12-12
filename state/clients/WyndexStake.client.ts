import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Uint128,
  AssetInfo,
  Binary,
  AdminResponse,
  AllStakedResponse,
  StakedResponse,
  BondingInfoResponse,
  ClaimsResponse,
  DelegatedResponse,
  DistributedRewardsResponse,
  DistributionDataResponse,
  RewardsPowerResponse,
  TotalStakedResponse,
  TotalUnbondingResponse,
  WithdrawableRewardsResponse,
  WithdrawAdjustment,
} from "./types/WyndexStake.types";
export interface WyndexStakeReadOnlyInterface {
  contractAddress: string;
  claims: ({ address }: { address: string }) => Promise<ClaimsResponse>;
  staked: ({
    address,
    unbondingPeriod,
  }: {
    address: string;
    unbondingPeriod: number;
  }) => Promise<StakedResponse>;
  allStaked: ({ address }: { address: string }) => Promise<AllStakedResponse>;
  totalStaked: () => Promise<TotalStakedResponse>;
  totalUnbonding: () => Promise<TotalUnbondingResponse>;
  totalRewardsPower: () => Promise<RewardsPowerResponse>;
  rewardsPower: ({ address }: { address: string }) => Promise<RewardsPowerResponse>;
  admin: () => Promise<AdminResponse>;
  bondingInfo: () => Promise<BondingInfoResponse>;
  withdrawableRewards: ({ owner }: { owner: string }) => Promise<WithdrawableRewardsResponse>;
  distributedRewards: () => Promise<DistributedRewardsResponse>;
  undistributedRewards: () => Promise<WithdrawableRewardsResponse>;
  delegated: ({ owner }: { owner: string }) => Promise<DelegatedResponse>;
  distributionData: () => Promise<DistributionDataResponse>;
  withdrawAdjustmentData: ({
    addr,
    asset,
  }: {
    addr: string;
    asset: AssetInfo;
  }) => Promise<WithdrawAdjustment>;
}
export class WyndexStakeQueryClient implements WyndexStakeReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.claims = this.claims.bind(this);
    this.staked = this.staked.bind(this);
    this.allStaked = this.allStaked.bind(this);
    this.totalStaked = this.totalStaked.bind(this);
    this.totalUnbonding = this.totalUnbonding.bind(this);
    this.totalRewardsPower = this.totalRewardsPower.bind(this);
    this.rewardsPower = this.rewardsPower.bind(this);
    this.admin = this.admin.bind(this);
    this.bondingInfo = this.bondingInfo.bind(this);
    this.withdrawableRewards = this.withdrawableRewards.bind(this);
    this.distributedRewards = this.distributedRewards.bind(this);
    this.undistributedRewards = this.undistributedRewards.bind(this);
    this.delegated = this.delegated.bind(this);
    this.distributionData = this.distributionData.bind(this);
    this.withdrawAdjustmentData = this.withdrawAdjustmentData.bind(this);
  }

  claims = async ({ address }: { address: string }): Promise<ClaimsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      claims: {
        address,
      },
    });
  };
  staked = async ({
    address,
    unbondingPeriod,
  }: {
    address: string;
    unbondingPeriod: number;
  }): Promise<StakedResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      staked: {
        address,
        unbonding_period: unbondingPeriod,
      },
    });
  };
  allStaked = async ({ address }: { address: string }): Promise<AllStakedResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_staked: {
        address,
      },
    });
  };
  totalStaked = async (): Promise<TotalStakedResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_staked: {},
    });
  };
  totalUnbonding = async (): Promise<TotalUnbondingResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_unbonding: {},
    });
  };
  totalRewardsPower = async (): Promise<RewardsPowerResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      total_rewards_power: {},
    });
  };
  rewardsPower = async ({ address }: { address: string }): Promise<RewardsPowerResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      rewards_power: {
        address,
      },
    });
  };
  admin = async (): Promise<AdminResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      admin: {},
    });
  };
  bondingInfo = async (): Promise<BondingInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      bonding_info: {},
    });
  };
  withdrawableRewards = async ({ owner }: { owner: string }): Promise<WithdrawableRewardsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      withdrawable_rewards: {
        owner,
      },
    });
  };
  distributedRewards = async (): Promise<DistributedRewardsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      distributed_rewards: {},
    });
  };
  undistributedRewards = async (): Promise<WithdrawableRewardsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      undistributed_rewards: {},
    });
  };
  delegated = async ({ owner }: { owner: string }): Promise<DelegatedResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      delegated: {
        owner,
      },
    });
  };
  distributionData = async (): Promise<DistributionDataResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      distribution_data: {},
    });
  };
  withdrawAdjustmentData = async ({
    addr,
    asset,
  }: {
    addr: string;
    asset: AssetInfo;
  }): Promise<WithdrawAdjustment> => {
    return this.client.queryContractSmart(this.contractAddress, {
      withdraw_adjustment_data: {
        addr,
        asset,
      },
    });
  };
}
export interface WyndexStakeInterface extends WyndexStakeReadOnlyInterface {
  contractAddress: string;
  sender: string;
  rebond: (
    {
      bondFrom,
      bondTo,
      tokens,
    }: {
      bondFrom: number;
      bondTo: number;
      tokens: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  unbond: (
    {
      tokens,
      unbondingPeriod,
    }: {
      tokens: Uint128;
      unbondingPeriod: number;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  claim: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateAdmin: (
    {
      admin,
    }: {
      admin?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  createDistributionFlow: (
    {
      asset,
      manager,
      rewardDuration,
      rewards,
    }: {
      asset: AssetInfo;
      manager: string;
      rewardDuration: number;
      rewards: number[][];
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
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
  distributeRewards: (
    {
      sender,
    }: {
      sender?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  withdrawRewards: (
    {
      owner,
      receiver,
    }: {
      owner?: string;
      receiver?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  delegateWithdrawal: (
    {
      delegated,
    }: {
      delegated: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  fundDistribution: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class WyndexStakeClient extends WyndexStakeQueryClient implements WyndexStakeInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.rebond = this.rebond.bind(this);
    this.unbond = this.unbond.bind(this);
    this.claim = this.claim.bind(this);
    this.updateAdmin = this.updateAdmin.bind(this);
    this.createDistributionFlow = this.createDistributionFlow.bind(this);
    this.receive = this.receive.bind(this);
    this.distributeRewards = this.distributeRewards.bind(this);
    this.withdrawRewards = this.withdrawRewards.bind(this);
    this.delegateWithdrawal = this.delegateWithdrawal.bind(this);
    this.fundDistribution = this.fundDistribution.bind(this);
  }

  rebond = async (
    {
      bondFrom,
      bondTo,
      tokens,
    }: {
      bondFrom: number;
      bondTo: number;
      tokens: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        rebond: {
          bond_from: bondFrom,
          bond_to: bondTo,
          tokens,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  unbond = async (
    {
      tokens,
      unbondingPeriod,
    }: {
      tokens: Uint128;
      unbondingPeriod: number;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        unbond: {
          tokens,
          unbonding_period: unbondingPeriod,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  claim = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        claim: {},
      },
      fee,
      memo,
      funds,
    );
  };
  updateAdmin = async (
    {
      admin,
    }: {
      admin?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_admin: {
          admin,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  createDistributionFlow = async (
    {
      asset,
      manager,
      rewardDuration,
      rewards,
    }: {
      asset: AssetInfo;
      manager: string;
      rewardDuration: number;
      rewards: number[][];
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        create_distribution_flow: {
          asset,
          manager,
          reward_duration: rewardDuration,
          rewards,
        },
      },
      fee,
      memo,
      funds,
    );
  };
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
  distributeRewards = async (
    {
      sender,
    }: {
      sender?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        distribute_rewards: {
          sender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  withdrawRewards = async (
    {
      owner,
      receiver,
    }: {
      owner?: string;
      receiver?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        withdraw_rewards: {
          owner,
          receiver,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  delegateWithdrawal = async (
    {
      delegated,
    }: {
      delegated: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        delegate_withdrawal: {
          delegated,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  fundDistribution = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        fund_distribution: {},
      },
      fee,
      memo,
      funds,
    );
  };
}
