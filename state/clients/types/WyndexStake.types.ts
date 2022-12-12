export type Uint128 = string;
export interface InstantiateMsg {
  admin?: string | null;
  cw20_contract: string;
  max_distributions: number;
  min_bond: Uint128;
  reward_duration: number;
  tokens_per_power: Uint128;
  unbonding_periods: number[];
}
export type ExecuteMsg =
  | {
      rebond: {
        bond_from: number;
        bond_to: number;
        tokens: Uint128;
      };
    }
  | {
      unbond: {
        tokens: Uint128;
        unbonding_period: number;
      };
    }
  | {
      claim: {};
    }
  | {
      update_admin: {
        admin?: string | null;
      };
    }
  | {
      create_distribution_flow: {
        asset: AssetInfo;
        manager: string;
        reward_duration: number;
        rewards: [number, Decimal][];
      };
    }
  | {
      receive: Cw20ReceiveMsg;
    }
  | {
      distribute_rewards: {
        sender?: string | null;
      };
    }
  | {
      withdraw_rewards: {
        owner?: string | null;
        receiver?: string | null;
      };
    }
  | {
      delegate_withdrawal: {
        delegated: string;
      };
    }
  | {
      fund_distribution: {};
    };
export type AssetInfo =
  | {
      token: string;
    }
  | {
      native_token: string;
    };
export type Decimal = string;
export type Binary = string;
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export type QueryMsg =
  | {
      claims: {
        address: string;
      };
    }
  | {
      staked: {
        address: string;
        unbonding_period: number;
      };
    }
  | {
      all_staked: {
        address: string;
      };
    }
  | {
      total_staked: {};
    }
  | {
      total_unbonding: {};
    }
  | {
      total_rewards_power: {};
    }
  | {
      rewards_power: {
        address: string;
      };
    }
  | {
      admin: {};
    }
  | {
      bonding_info: {};
    }
  | {
      withdrawable_rewards: {
        owner: string;
      };
    }
  | {
      distributed_rewards: {};
    }
  | {
      undistributed_rewards: {};
    }
  | {
      delegated: {
        owner: string;
      };
    }
  | {
      distribution_data: {};
    }
  | {
      withdraw_adjustment_data: {
        addr: string;
        asset: AssetInfo;
      };
    };
export interface AdminResponse {
  admin?: string | null;
}
export interface AllStakedResponse {
  stakes: StakedResponse[];
}
export interface StakedResponse {
  cw20_contract: string;
  stake: Uint128;
  total_locked: Uint128;
  unbonding_period: number;
}
export interface BondingInfoResponse {
  bonding: BondingPeriodInfo[];
}
export interface BondingPeriodInfo {
  total_staked: Uint128;
  unbonding_period: number;
}
export type Expiration =
  | {
      at_height: number;
    }
  | {
      at_time: Timestamp;
    }
  | {
      never: {};
    };
export type Timestamp = Uint64;
export type Uint64 = string;
export interface ClaimsResponse {
  claims: Claim[];
}
export interface Claim {
  amount: Uint128;
  release_at: Expiration;
}
export type Addr = string;
export interface DelegatedResponse {
  delegated: Addr;
}
export type AssetInfoValidated =
  | {
      token: Addr;
    }
  | {
      native_token: string;
    };
export interface DistributedRewardsResponse {
  distributed: AssetValidated[];
  withdrawable: AssetValidated[];
}
export interface AssetValidated {
  amount: Uint128;
  info: AssetInfoValidated;
}
export interface DistributionDataResponse {
  distributions: [AssetInfoValidated, Distribution][];
}
export interface Distribution {
  distributed_total: Uint128;
  manager: Addr;
  reward_multipliers: [number, Decimal][];
  shares_leftover: number;
  shares_per_point: Uint128;
  withdrawable_total: Uint128;
}
export interface RewardsPowerResponse {
  rewards: [AssetInfoValidated, Uint128][];
}
export interface TotalStakedResponse {
  total_staked: Uint128;
}
export interface TotalUnbondingResponse {
  total_unbonding: Uint128;
}
export interface WithdrawableRewardsResponse {
  rewards: AssetValidated[];
}
export interface WithdrawAdjustment {
  shares_correction: number;
  withdrawn_rewards: Uint128;
}
