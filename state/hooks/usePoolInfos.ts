import { Loadable, useRecoilValueLoadable } from "recoil";
import { PoolResponse } from "../clients/types/WyndexPair.types";
import { WyndexPairSelectors } from "../recoil";

interface UsePoolInfosResponse {
  pool: Loadable<PoolResponse>;
}

export const usePoolInfos = (poolAddress: string): UsePoolInfosResponse => {
  const loadablePool = useRecoilValueLoadable(
    WyndexPairSelectors.poolSelector({
      contractAddress: poolAddress,
      params: [],
    }),
  );

  return {
    pool: loadablePool,
  };
};
