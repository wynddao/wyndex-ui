export interface InstantiateMsg {
  wyndex_factory: string;
}
export type ExecuteMsg =
  | {
      receive: Cw20ReceiveMsg;
    }
  | {
      execute_swap_operations: {
        max_spread?: Decimal | null;
        minimum_receive?: Uint128 | null;
        operations: SwapOperation[];
        receiver?: string | null;
        referral_address?: string | null;
        referral_commission?: Decimal | null;
      };
    }
  | {
      execute_swap_operation: {
        max_spread?: Decimal | null;
        operation: SwapOperation;
        receiver?: string | null;
        referral_address?: string | null;
        referral_commission?: Decimal | null;
        single: boolean;
      };
    }
  | {
      assert_minimum_receive: {
        asset_info: AssetInfo;
        minimum_receive: Uint128;
        prev_balance: Uint128;
        receiver: string;
      };
    };
export type Uint128 = string;
export type Binary = string;
export type Decimal = string;
export type SwapOperation = {
  wyndex_swap: {
    ask_asset_info: AssetInfo;
    offer_asset_info: AssetInfo;
  };
};
export type AssetInfo =
  | {
      token: string;
    }
  | {
      native: string;
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
      simulate_swap_operations: {
        offer_amount: Uint128;
        operations: SwapOperation[];
        referral: boolean;
        referral_commission?: Decimal | null;
      };
    };
export interface ConfigResponse {
  wyndex_factory: string;
}
export type AssetInfoValidated =
  | {
      token: Addr;
    }
  | {
      native: string;
    };
export type Addr = string;
export interface SimulateSwapOperationsResponse {
  amount: Uint128;
  commission_amounts: AssetValidated[];
  referral_amount: AssetValidated;
  spread: Decimal;
  spread_amounts: AssetValidated[];
}
export interface AssetValidated {
  amount: Uint128;
  info: AssetInfoValidated;
}
