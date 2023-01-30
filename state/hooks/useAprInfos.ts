import { useRecoilValue } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../utils";
import { IndexerSelectors } from "../recoil";

export const useAprInfos = (poolAddress: string) => {
  const { rewards } = useRecoilValue(
    IndexerSelectors.rewardsSelector({
      apiUrl: INDEXER_API_ENDPOINT,
      params: [poolAddress],
    }),
  );

  return {
    rewards,
  };
};
