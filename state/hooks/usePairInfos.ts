import { Loadable, useRecoilValueLoadable } from "recoil";
import { FACTORY_CONTRACT_ADDRESS } from "../../utils";
import { AssetInfo, PairInfo } from "../clients/types/WyndexFactory.types";
import { WyndexFactorySelectors } from "../recoil";

interface UsePairInfosResponse {
  pair: Loadable<PairInfo>;
}

export const usePairInfos = (assetInfo: AssetInfo[]): UsePairInfosResponse => {
  const loadablePair = useRecoilValueLoadable(
    WyndexFactorySelectors.pairSelector({
      contractAddress: FACTORY_CONTRACT_ADDRESS,
      params: [{ assetInfos: assetInfo }],
    }),
  );

  return {
    pair: loadablePair,
  };
};
