import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilValue } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../utils";
import { IndexerSelectors } from "../recoil";

interface UseIndexerInfos {
  fetchPoolData?: boolean;
  fetchIbcBalances?: boolean;
  fetchCw20Balances?: boolean;
}

export const useIndexerInfos = ({
  fetchPoolData = false,
  fetchIbcBalances = false,
  fetchCw20Balances = false,
}: UseIndexerInfos) => {
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

  const ibcBalances = useRecoilValue(
    fetchIbcBalances
      ? IndexerSelectors.ibcBalancesSelector({ apiUrl: INDEXER_API_ENDPOINT, params: [walletAddress] })
      : constSelector([]),
  );

  const ibcBalanceSelector = (microdenom: string) =>
    IndexerSelectors.ibcBalanceSelector({
      apiUrl: INDEXER_API_ENDPOINT,
      params: [walletAddress, microdenom],
    });

  const cw20Balances = useRecoilValue(
    fetchCw20Balances
      ? IndexerSelectors.cw20BalancesSelector({ apiUrl: INDEXER_API_ENDPOINT, params: [walletAddress] })
      : constSelector([]),
  );

  const cw20BalanceSelector = (microdenom: string) =>
    IndexerSelectors.cw20BalanceSelector({
      apiUrl: INDEXER_API_ENDPOINT,
      params: [walletAddress, microdenom],
    });

  return {
    pools,
    userPools,
    assetPrices,
    ibcBalances,
    ibcBalanceSelector,
    cw20Balances,
    cw20BalanceSelector,
  };
};
