import { useRecoilValue } from "recoil";
import { PoolResponse } from "../clients/types/WyndexPair.types";
import { WyndexPairSelectors } from "../recoil";

interface UsePoolInfosResponse {
  pool: PoolResponse;
}

export const usePoolInfos = (poolAddress: string): UsePoolInfosResponse => {
  const pool = useRecoilValue(
    WyndexPairSelectors.poolSelector({
      contractAddress: poolAddress,
      params: [],
    }),
  );

  return {
    pool,
  };
};
