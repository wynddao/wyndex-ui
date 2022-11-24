export interface Asset {
  name: string;
  tokenType: TokenType;
  img: string;
  denom: string;
  decimals: number;
  chain: string;
  contractAddress?: string;
  liquidity?: Liquidity;
}

export interface Pair {
  id: number;
  apr: number;
  fee: number;
  tokens: Asset[];
  contractAddress: string;
  unbondingPeriods: UnbondingPeriod[];
}

export interface Liquidity {
  amount: number;
  shares: number;
}

export type TokenType = "cw20" | "native";

export interface UnbondingPeriod {
  duration: number;
  apr: number;
}
