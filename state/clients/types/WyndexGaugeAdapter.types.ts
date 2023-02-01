export type Uint128 = string
export type AssetInfo =
  | {
      token: string
    }
  | {
      native: string
    }
export interface InstantiateMsg {
  epoch_length: number
  factory: string
  owner: string
  rewards_asset: Asset
}
export interface Asset {
  amount: Uint128
  info: AssetInfo
}
export type ExecuteMsg = {
  update_rewards: {
    amount: Uint128
  }
}
export type QueryMsg =
  | {
      config: {}
    }
  | {
      all_options: {}
    }
  | {
      check_option: {
        option: string
      }
    }
  | {
      sample_gauge_msgs: {
        selected: [string, Decimal][]
      }
    }
export type Decimal = string
export interface AllOptionsResponse {
  options: string[]
}
export interface CheckOptionResponse {
  valid: boolean
}
export type ScalableCurve =
  | {
      constant: {
        ratio: Decimal
        [k: string]: unknown
      }
    }
  | {
      scalable_linear: ScalableLinear
    }
  | {
      scalable_piecewise: ScalablePiecewise
    }
export type Addr = string
export type AssetInfoValidated =
  | {
      token: Addr
    }
  | {
      native: string
    }
export interface Config {
  distribution_curve: ScalableCurve
  factory: Addr
  owner: Addr
  rewards_asset: AssetValidated
}
export interface ScalableLinear {
  max_x: number
  max_y: Decimal
  min_x: number
  min_y: Decimal
  [k: string]: unknown
}
export interface ScalablePiecewise {
  steps: [number, Decimal][]
  [k: string]: unknown
}
export interface AssetValidated {
  amount: Uint128
  info: AssetInfoValidated
}
export type CosmosMsgForEmpty =
  | {
      bank: BankMsg
    }
  | {
      custom: Empty
    }
  | {
      staking: StakingMsg
    }
  | {
      distribution: DistributionMsg
    }
  | {
      stargate: {
        type_url: string
        value: Binary
        [k: string]: unknown
      }
    }
  | {
      ibc: IbcMsg
    }
  | {
      wasm: WasmMsg
    }
  | {
      gov: GovMsg
    }
export type BankMsg =
  | {
      send: {
        amount: Coin[]
        to_address: string
        [k: string]: unknown
      }
    }
  | {
      burn: {
        amount: Coin[]
        [k: string]: unknown
      }
    }
export type StakingMsg =
  | {
      delegate: {
        amount: Coin
        validator: string
        [k: string]: unknown
      }
    }
  | {
      undelegate: {
        amount: Coin
        validator: string
        [k: string]: unknown
      }
    }
  | {
      redelegate: {
        amount: Coin
        dst_validator: string
        src_validator: string
        [k: string]: unknown
      }
    }
export type DistributionMsg =
  | {
      set_withdraw_address: {
        address: string
        [k: string]: unknown
      }
    }
  | {
      withdraw_delegator_reward: {
        validator: string
        [k: string]: unknown
      }
    }
export type Binary = string
export type IbcMsg =
  | {
      transfer: {
        amount: Coin
        channel_id: string
        timeout: IbcTimeout
        to_address: string
        [k: string]: unknown
      }
    }
  | {
      send_packet: {
        channel_id: string
        data: Binary
        timeout: IbcTimeout
        [k: string]: unknown
      }
    }
  | {
      close_channel: {
        channel_id: string
        [k: string]: unknown
      }
    }
export type Timestamp = Uint64
export type Uint64 = string
export type WasmMsg =
  | {
      execute: {
        contract_addr: string
        funds: Coin[]
        msg: Binary
        [k: string]: unknown
      }
    }
  | {
      instantiate: {
        admin?: string | null
        code_id: number
        funds: Coin[]
        label: string
        msg: Binary
        [k: string]: unknown
      }
    }
  | {
      migrate: {
        contract_addr: string
        msg: Binary
        new_code_id: number
        [k: string]: unknown
      }
    }
  | {
      update_admin: {
        admin: string
        contract_addr: string
        [k: string]: unknown
      }
    }
  | {
      clear_admin: {
        contract_addr: string
        [k: string]: unknown
      }
    }
export type GovMsg = {
  vote: {
    proposal_id: number
    vote: VoteOption
    [k: string]: unknown
  }
}
export type VoteOption = 'yes' | 'no' | 'abstain' | 'no_with_veto'
export interface SampleGaugeMsgsResponse {
  execute: CosmosMsgForEmpty[]
}
export interface Coin {
  amount: Uint128
  denom: string
  [k: string]: unknown
}
export interface Empty {
  [k: string]: unknown
}
export interface IbcTimeout {
  block?: IbcTimeoutBlock | null
  timestamp?: Timestamp | null
  [k: string]: unknown
}
export interface IbcTimeoutBlock {
  height: number
  revision: number
  [k: string]: unknown
}
