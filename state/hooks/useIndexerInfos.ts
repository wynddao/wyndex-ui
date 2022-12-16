import { useRecoilValue } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../utils";
import { IndexerSelectors } from "../recoil";

export const useIndexerInfos = () => {
  const pools = useRecoilValue(
    IndexerSelectors.poolsSelector({
      apiUrl: INDEXER_API_ENDPOINT,
    }),
  );

  return {
    pools,
  };
};
