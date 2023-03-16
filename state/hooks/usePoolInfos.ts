import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { PoolResponse } from "../clients/types/WyndexPair.types";
import { WyndexPairSelectors } from "../recoil";

interface UsePoolInfosResponse {
  pool: PoolResponse;
  refreshPool: () => void;
}

export const usePoolInfos = (poolAddress: string): UsePoolInfosResponse => {
  const poolSelector = WyndexPairSelectors.poolSelector({
    contractAddress: poolAddress,
    params: [],
  });

  const pool = useRecoilValue(poolSelector);
  const refreshPool = useRecoilRefresher_UNSTABLE(poolSelector);

  return {
    pool,
    refreshPool,
  };
};
