export type Addr = string
export type Uint128 = string
export interface ConfigResponse {
  config: Config
  [k: string]: unknown
}
export interface Config {
  admin: Addr
  cw20_contract: Addr
  epoch: number
  last_payment: number
  payment: Uint128
  recipient: Addr
  [k: string]: unknown
}
export type ExecuteMsg =
  | {
      update_config: {
        admin?: string | null
        cw20_contract?: string | null
        epoch?: number | null
        payment?: Uint128 | null
        recipient?: string | null
        [k: string]: unknown
      }
    }
  | {
      payout: {
        [k: string]: unknown
      }
    }
export interface InstantiateMsg {
  admin: string
  cw20_contract: string
  epoch: number
  payment: Uint128
  recipient: string
  [k: string]: unknown
}
export type QueryMsg = {
  config: {
    [k: string]: unknown
  }
}
