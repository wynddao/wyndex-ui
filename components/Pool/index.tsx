"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import LiquidityMining from "./LiquidityMining";
import PoolCatalyst from "./PoolCatalyst";
import PoolHeader from "./PoolHeader";
import { Pair } from "../../utils/types";
import { getPair } from "../../utils";
import { usePairInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexFactory.types";
import { getAssetInfo } from "../../utils/assets";
import PoolWrapper from "./PoolWrapper";
export interface UnbondingPeriodListData {
  days: string;
  apr: number;
  amount: number;
}

interface PoolProps {
  readonly poolAddress: string;
}

export default function Pool({ poolAddress }: PoolProps) {
  const [poolData, setPoolData] = useState<Pair | undefined>(undefined);

  const getAsync = async () => {
    const pair = await getPair(poolAddress);
    setPoolData(pair);
  };

  useEffect(() => {
    getAsync();
  }, []);

  return <Box>{poolData ? <PoolWrapper poolData={poolData} /> : null}</Box>;
}
