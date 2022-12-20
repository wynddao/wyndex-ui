export type Uint128 = string;
export type Decimal = string;
export type PairType =
  | {
      xyk: {};
    }
  | {
      stable: {};
    }
  | {
      custom: string;
    };
export interface InstantiateMsg {
  default_stake_config: DefaultStakeConfig;
  fee_address?: string | null;
  max_referral_commission: Decimal;
  owner: string;
  pair_configs: PairConfig[];
  token_code_id: number;
  trading_starts?: number | null;
}
export interface DefaultStakeConfig {
  max_distributions: number;
  min_bond: Uint128;
  staking_code_id: number;
  tokens_per_power: Uint128;
  unbonding_periods: number[];
}
export interface PairConfig {
  code_id: number;
  fee_config: FeeConfig;
  is_disabled: boolean;
  pair_type: PairType;
}
export interface FeeConfig {
  protocol_fee_bps: number;
  total_fee_bps: number;
}
export type ExecuteMsg =
  | {
      update_config: {
        fee_address?: string | null;
        only_owner_can_create_pairs?: boolean | null;
        token_code_id?: number | null;
      };
    }
  | {
      update_pair_config: {
        config: PairConfig;
      };
    }
  | {
      create_pair: {
        asset_infos: AssetInfo[];
        init_params?: Binary | null;
        pair_type: PairType;
        staking_config?: PartialStakeConfig;
        total_fee_bps?: number | null;
      };
    }
  | {
      update_pair_fees: {
        asset_infos: AssetInfo[];
        fee_config: FeeConfig;
      };
    }
  | {
      deregister: {
        asset_infos: AssetInfo[];
      };
    }
  | {
      propose_new_owner: {
        expires_in: number;
        owner: string;
      };
    }
  | {
      drop_ownership_proposal: {};
    }
  | {
      claim_ownership: {};
    }
  | {
      mark_as_migrated: {
        pairs: string[];
      };
    }
  | {
      create_pair_and_distribution_flows: {
        asset_infos: AssetInfo[];
        distribution_flows: DistributionFlow[];
        init_params?: Binary | null;
        pair_type: PairType;
        staking_config?: PartialStakeConfig;
        total_fee_bps?: number | null;
      };
    }
  | {
      create_distribution_flow: {
        asset: AssetInfo;
        asset_infos: AssetInfo[];
        reward_duration: number;
        rewards: [number, Decimal][];
      };
    };
export type AssetInfo =
  | {
      token: string;
    }
  | {
      native: string;
    };
export type Binary = string;
export interface PartialStakeConfig {
  max_distributions?: number | null;
  min_bond?: Uint128 | null;
  staking_code_id?: number | null;
  tokens_per_power?: Uint128 | null;
  unbonding_periods?: number[] | null;
}
export interface DistributionFlow {
  asset: AssetInfo;
  reward_duration: number;
  rewards: [number, Decimal][];
}
export type QueryMsg =
  | {
      config: {};
    }
  | {
      pair: {
        asset_infos: AssetInfo[];
      };
    }
  | {
      pairs: {
        limit?: number | null;
        start_after?: AssetInfo[] | null;
      };
    }
  | {
      fee_info: {
        pair_type: PairType;
      };
    }
  | {
      blacklisted_pair_types: {};
    }
  | {
      pairs_to_migrate: {};
    }
  | {
      validate_staking_address: {
        address: string;
      };
    };
export type ArrayOfPairType = PairType[];
export type Addr = string;
export interface ConfigResponse {
  fee_address?: Addr | null;
  max_referral_commission: Decimal;
  only_owner_can_create_pairs: boolean;
  owner: Addr;
  pair_configs: PairConfig[];
  token_code_id: number;
  trading_starts?: number | null;
}
export interface FeeInfoResponse {
  fee_address?: Addr | null;
  protocol_fee_bps: number;
  total_fee_bps: number;
}
export type AssetInfoValidated =
  | {
      token: Addr;
    }
  | {
      native: string;
    };
export interface PairInfo {
  asset_infos: AssetInfoValidated[];
  contract_addr: Addr;
  fee_config: FeeConfig;
  liquidity_token: Addr;
  pair_type: PairType;
  staking_addr: Addr;
}
export interface PairsResponse {
  pairs: PairInfo[];
}
export type ArrayOfAddr = Addr[];
export type Boolean = boolean;
