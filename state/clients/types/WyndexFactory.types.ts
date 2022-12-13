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
  default_stake_config: StakeConfig;
  fee_address?: string | null;
  max_referral_commission: Decimal;
  owner: string;
  pair_configs: PairConfig[];
  token_code_id: number;
}
export interface StakeConfig {
  admin: string;
  max_distributions: number;
  min_bond: Uint128;
  reward_duration: number;
  staking_code_id: number;
  tokens_per_power: Uint128;
  unbonding_periods: number[];
}
export interface PairConfig {
  code_id: number;
  is_disabled: boolean;
  maker_fee_bps: number;
  pair_type: PairType;
  total_fee_bps: number;
}
export type ExecuteMsg =
  | {
      update_config: {
        fee_address?: string | null;
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
    };
export type AssetInfo =
  | {
      token: string;
    }
  | {
      native_token: string;
    };
export type Binary = string;
export interface PartialStakeConfig {
  admin?: string | null;
  max_distributions?: number | null;
  min_bond?: Uint128 | null;
  staking_code_id?: number | null;
  tokens_per_power?: Uint128 | null;
  unbonding_periods?: number[] | null;
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
  owner: Addr;
  pair_configs: PairConfig[];
  token_code_id: number;
}
export interface FeeInfoResponse {
  fee_address?: Addr | null;
  maker_fee_bps: number;
  total_fee_bps: number;
}
export type AssetInfoValidated =
  | {
      token: Addr;
    }
  | {
      native_token: string;
    };
export interface PairInfo {
  asset_infos: AssetInfoValidated[];
  contract_addr: Addr;
  liquidity_token: Addr;
  pair_type: PairType;
  staking_addr: Addr;
}
export interface PairsResponse {
  pairs: PairInfo[];
}
export type ArrayOfAddr = Addr[];
export type Boolean = boolean;
