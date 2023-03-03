export type Decimal = string;
export type Uint128 = string;
export type Logo =
  | {
      url: string;
    }
  | {
      embedded: EmbeddedLogo;
    };
export type EmbeddedLogo =
  | {
      svg: Binary;
    }
  | {
      png: Binary;
    };
export type Binary = string;
export interface InstantiateMsg {
  comission: Decimal;
  cw20_init: TokenInitInfo;
  epoch_period: number;
  liquidity_discount: Decimal;
  max_concurrent_unbondings: number;
  owner: string;
  treasury: string;
  unbond_period: number;
  validators: [string, Decimal][];
}
export interface TokenInitInfo {
  cw20_code_id: number;
  decimals: number;
  initial_balances: Cw20Coin[];
  label: string;
  marketing?: InstantiateMarketingInfo | null;
  name: string;
  symbol: string;
}
export interface Cw20Coin {
  address: string;
  amount: Uint128;
}
export interface InstantiateMarketingInfo {
  description?: string | null;
  logo?: Logo | null;
  marketing?: string | null;
  project?: string | null;
}
export type ExecuteMsg =
  | {
      receive: Cw20ReceiveMsg;
    }
  | {
      bond: {};
    }
  | {
      claim: {};
    }
  | {
      reinvest: {};
    }
  | {
      set_validators: {
        new_validators: [string, Decimal][];
      };
    }
  | {
      update_liquidity_discount: {
        new_discount: Decimal;
      };
    };
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export type QueryMsg =
  | {
      config: {};
    }
  | {
      claims: {
        address: string;
      };
    }
  | {
      validator_set: {};
    }
  | {
      last_reinvest: {};
    }
  | {
      supply: {};
    }
  | {
      exchange_rate: {};
    }
  | {
      target_value: {};
    };
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
export interface ConfigResponse {
  commission: Decimal;
  epoch_period: number;
  owner: Addr;
  token_contract: Addr;
  treasury: Addr;
  unbond_period: number;
}
export interface ExchangeRateResponse {
  exchange_rate: Decimal;
}
export interface ReinvestResponse {
  last_reinvest: number;
  next_reinvest: number;
}
export interface SupplyResponse {
  supply: Supply;
}
export interface Supply {
  bond_denom: string;
  bonded: [string, Uint128][];
  claims: Uint128;
  issued: Uint128;
  total_bonded: Uint128;
  total_unbonding: Uint128;
  unbonding: Unbonding[];
}
export interface Unbonding {
  a: Uint128;
  e: Expiration;
  v: string;
}
export interface TargetValueResponse {
  target_value: Decimal;
}
export interface ValidatorSetResponse {
  validator_set: [string, Decimal][];
}
