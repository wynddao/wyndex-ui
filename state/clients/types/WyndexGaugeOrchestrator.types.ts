export type Decimal = string
export interface InstantiateMsg {
  gauges?: GaugeConfig[] | null
  owner: string
  voting_powers: string
}
export interface GaugeConfig {
  adapter: string
  epoch_size: number
  max_options_selected: number
  min_percent_selected?: Decimal | null
  title: string
}
export type ExecuteMsg =
  | {
      member_changed_hook: MemberChangedHookMsg
    }
  | {
      create_gauge: GaugeConfig
    }
  | {
      stop_gauge: {
        gauge: number
      }
    }
  | {
      add_option: {
        gauge: number
        option: string
      }
    }
  | {
      place_votes: {
        gauge: number
        votes?: Vote[] | null
      }
    }
  | {
      execute: {
        gauge: number
      }
    }
export type Uint128 = string
export interface MemberChangedHookMsg {
  diffs: MemberDiff[]
  [k: string]: unknown
}
export interface MemberDiff {
  key: string
  new?: Uint128 | null
  old?: Uint128 | null
  [k: string]: unknown
}
export interface Vote {
  option: string
  weight: Decimal
}
export type QueryMsg =
  | {
      info: {}
    }
  | {
      gauge: {
        id: number
      }
    }
  | {
      list_gauges: {
        limit?: number | null
        start_after?: number | null
      }
    }
  | {
      vote: {
        gauge: number
        voter: string
      }
    }
  | {
      list_votes: {
        gauge: number
        limit?: number | null
        start_after?: string | null
      }
    }
  | {
      list_options: {
        gauge: number
        limit?: number | null
        start_after?: string | null
      }
    }
  | {
      selected_set: {
        gauge: number
      }
    }
export interface GaugeResponse {
  adapter: string
  epoch_size: number
  id: number
  is_stopped: boolean
  max_options_selected: number
  min_percent_selected?: Decimal | null
  next_epoch: number
  title: string
}
export interface InfoResponse {
  info: ContractVersion
  [k: string]: unknown
}
export interface ContractVersion {
  contract: string
  version: string
}
export interface ListGaugesResponse {
  gauges: GaugeResponse[]
}
export interface ListOptionsResponse {
  options: [string, Uint128][]
}
export interface ListVotesResponse {
  votes: VoteInfo[]
}
export interface VoteInfo {
  voter: string
  votes: Vote[]
}
export interface SelectedSetResponse {
  votes: [string, Uint128][]
}
export interface VoteResponse {
  vote?: VoteInfo | null
}
