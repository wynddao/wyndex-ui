"use client";
import { Box } from "@chakra-ui/react";
import { usePoolInfos } from "../../state";
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
  const { pool } = usePoolInfos(poolAddress);

  return <Box p="4">{pool ? <PoolWrapper poolData={pool} /> : null}</Box>;
}
