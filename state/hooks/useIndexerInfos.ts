import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilValue } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../utils";
import { IndexerSelectors } from "../recoil";

interface UseIndexerInfos {
  fetchPoolData: boolean;
}

export const useIndexerInfos = ({ fetchPoolData = false }: UseIndexerInfos) => {
  const { address: walletAddress } = useWallet();

  const pools = useRecoilValue(
    fetchPoolData
      ? IndexerSelectors.poolsSelector({
          apiUrl: INDEXER_API_ENDPOINT,
        })
      : constSelector([]),
  );

  const userPools = useRecoilValue(
    fetchPoolData && walletAddress
      ? IndexerSelectors.userPoolsSelector({
          apiUrl: INDEXER_API_ENDPOINT,
          params: [walletAddress],
        })
      : constSelector([]),
  );

  const assetPrices = useRecoilValue(
    IndexerSelectors.assetPricesSelector({
      apiUrl: INDEXER_API_ENDPOINT,
    }),
  );

  return {
    pools,
    userPools,
    assetPrices,
  };
};
