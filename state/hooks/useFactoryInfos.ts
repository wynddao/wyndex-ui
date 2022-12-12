import { useRecoilValue } from "recoil";
import { FACTORY_CONTRACT_ADDRESS } from "../../utils";
import { PairInfo } from "../clients/types/WyndexFactory.types";
import { WyndexFactorySelectors } from "../recoil";

interface UseFactoryInfosResponse {
  allPairs: PairInfo[];
}

export const useFactoryInfos = (): UseFactoryInfosResponse => {
  const factoryAddress = FACTORY_CONTRACT_ADDRESS;
  const allPairs = useRecoilValue(
    WyndexFactorySelectors.pairsSelector({
      contractAddress: factoryAddress,
      params: [{}],
    }),
  ).pairs;

  return {
    allPairs,
  };
};
