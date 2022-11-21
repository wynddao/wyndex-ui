import { useRecoilValue } from "recoil";
import { FACTORY_CONTRACT_ADDRESS } from "../../utils";
import { PairInfo } from "../clients/types/WyndexFactory.types";
import { WyndexFactorySelectors } from "../recoil";

interface UseAllPairsInfosResponse {
  pairs: PairInfo[];
}

export const useAllPairsInfos = ({ limit = undefined, startAfter = undefined }): UseAllPairsInfosResponse => {
  const pairs = useRecoilValue(
    WyndexFactorySelectors.pairsSelector({
      contractAddress: FACTORY_CONTRACT_ADDRESS,
      params: [
        {
          limit,
          startAfter,
        },
      ],
    }),
  ).pairs;

  return {
    pairs,
  };
};
