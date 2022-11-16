"use client";

import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import LiquidityMining from "./LiquidityMining";
import PoolCatalyst from "./PoolCatalyst";
import PoolHeader from "./PoolHeader";
import { getDefaultPoolData } from "./__mocks__/pool";

export interface PoolData {
  id: string;
  token1: {
    name: string;
    img: string;
    amount: number;
    tokenTotalAmount: number;
    percent: number;
  };
  token2: {
    name: string;
    img: string;
    amount: number;
    tokenTotalAmount: number;
    percent: number;
  };
  poolLiquidity: number;
  swapFee: number;
  myLiquidity: number;
  bounded: number;
}

export interface UnbondingPeriodListData {
  days: string;
  apr: number;
  amount: number;
}

interface PoolProps {
  readonly poolAddress: string;
}

export default function Pool({ poolAddress }: PoolProps) {
  const poolData = useMemo(() => getDefaultPoolData(poolAddress), [poolAddress]);

  return (
    <Box>
      <PoolHeader poolData={poolData} />
      <LiquidityMining />
      <PoolCatalyst poolData={poolData} />
    </Box>
  );
}
