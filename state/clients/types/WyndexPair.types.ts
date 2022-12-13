export type AssetInfo =
  | {
      token: string;
    }
  | {
      native_token: string;
    };
export type Binary = string;
export type Uint128 = string;
export interface InstantiateMsg {
  asset_infos: AssetInfo[];
  factory_addr: string;
  init_params?: Binary | null;
  staking_config: StakeConfig;
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
export type ExecuteMsg =
  | {
      receive: Cw20ReceiveMsg;
    }
  | {
      provide_liquidity: {
        assets: Asset[];
        receiver?: string | null;
        slippage_tolerance?: Decimal | null;
      };
    }
  | {
      swap: {
        ask_asset_info?: AssetInfo | null;
        belief_price?: Decimal | null;
        max_spread?: Decimal | null;
        offer_asset: Asset;
        referral_address?: string | null;
        referral_commission?: Decimal | null;
        to?: string | null;
      };
    }
  | {
      update_config: {
        params: Binary;
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
    };
export type Decimal = string;
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export interface Asset {
  amount: Uint128;
  info: AssetInfo;
}
export type QueryMsg =
  | {
      pair: {};
    }
  | {
      pool: {};
    }
  | {
      config: {};
    }
  | {
      share: {
        amount: Uint128;
      };
    }
  | {
      simulation: {
        ask_asset_info?: AssetInfo | null;
        offer_asset: Asset;
        referral: boolean;
        referral_commission?: Decimal | null;
      };
    }
  | {
      reverse_simulation: {
        ask_asset: Asset;
        offer_asset_info?: AssetInfo | null;
        referral: boolean;
        referral_commission?: Decimal | null;
      };
    }
  | {
      cumulative_prices: {};
    }
  | {
      query_compute_d: {};
    };
export type Addr = string;
export interface ConfigResponse {
  block_time_last: number;
  owner?: Addr | null;
  params?: Binary | null;
}
export type AssetInfoValidated =
  | {
      token: Addr;
    }
  | {
      native_token: string;
    };
export interface CumulativePricesResponse {
  assets: AssetValidated[];
  cumulative_prices: [AssetInfoValidated, AssetInfoValidated, Uint128][];
  total_share: Uint128;
}
export interface AssetValidated {
  amount: Uint128;
  info: AssetInfoValidated;
}
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
export interface PairInfo {
  asset_infos: AssetInfoValidated[];
  contract_addr: Addr;
  liquidity_token: Addr;
  pair_type: PairType;
  staking_addr: Addr;
}
export interface PoolResponse {
  assets: AssetValidated[];
  total_share: Uint128;
}
export interface ReverseSimulationResponse {
  commission_amount: Uint128;
  offer_amount: Uint128;
  spread_amount: Uint128;
}
export type ArrayOfAssetValidated = AssetValidated[];
export interface SimulationResponse {
  commission_amount: Uint128;
  return_amount: Uint128;
  spread_amount: Uint128;
}
