import { useWallet } from "@cosmos-kit/react";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../utils";
import { RequestSwap } from "../clients/Indexer.client";
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

  const ibcBalancesSelector = IndexerSelectors.ibcBalancesSelector({
    apiUrl: INDEXER_API_ENDPOINT,
    params: [walletAddress],
  });

  const ibcBalances = useRecoilValue(fetchIbcBalances ? ibcBalancesSelector : constSelector([]));

  const refreshIbcBalances = useRecoilRefresher_UNSTABLE(ibcBalancesSelector);

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

  const userFiat = useRecoilValue(
    fetchCw20Balances
      ? IndexerSelectors.userFiatSelector({
          apiUrl: INDEXER_API_ENDPOINT,
          params: [walletAddress || ""],
        })
      : constSelector({ availableBalance: { eur: 0, usd: 0 }, lockedBalance: { eur: 0, usd: 0 } }),
  );

  const swapOperationRoutes = (reqOperation: RequestSwap) => {
    return IndexerSelectors.swapRouteSelector({
      apiUrl: INDEXER_API_ENDPOINT,
      params: [reqOperation],
    });
  };

  // TODO: type each returned property to avoid errors
  return {
    pools,
    userPools,
    assetPrices,
    ibcBalances,
    refreshIbcBalances,
    ibcBalanceSelector,
    cw20Balances,
    cw20BalanceSelector,
    userFiat,
    swapOperationRoutes,
  };
};
