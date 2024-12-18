import { useChain } from "@cosmos-kit/react-lite";
import { constSelector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../utils";
import { RequestSwap } from "../clients/Indexer.client";
import { IndexerSelectors } from "../recoil";

interface UseIndexerInfosProps {
  readonly fetchPoolData?: boolean;
  readonly fetchIbcBalances?: boolean;
  readonly fetchCw20Balances?: boolean;
}

export const useIndexerInfos = ({
  fetchPoolData = false,
  fetchIbcBalances = false,
  fetchCw20Balances = false,
}: UseIndexerInfosProps) => {
  const { address: walletAddress } = useChain("juno");

  const pools = useRecoilValue(
    fetchPoolData
      ? IndexerSelectors.poolsSelector({
          apiUrl: INDEXER_API_ENDPOINT,
        })
      : constSelector([]),
  );

  const pairs = useRecoilValue(
    fetchPoolData
      ? IndexerSelectors.pairsSelector({
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

  const cw20BalancesSelector = IndexerSelectors.cw20BalancesSelector({
    apiUrl: INDEXER_API_ENDPOINT,
    params: [walletAddress],
  });

  const cw20Balances = useRecoilValue(fetchCw20Balances ? cw20BalancesSelector : constSelector([]));

  const refreshCw20Balances = useRecoilRefresher_UNSTABLE(cw20BalancesSelector);

  const cw20BalanceSelector = (tokenAddress: string) =>
    IndexerSelectors.cw20BalanceSelector({
      apiUrl: INDEXER_API_ENDPOINT,
      params: [walletAddress, tokenAddress],
    });

  const userFiat = useRecoilValue(
    fetchCw20Balances
      ? IndexerSelectors.userFiatSelector({
          apiUrl: INDEXER_API_ENDPOINT,
          params: [walletAddress || ""],
        })
      : constSelector({ availableBalance: { eur: 0, usd: 0 }, lockedBalance: { eur: 0, usd: 0 } }),
  );

  const userVotes = useRecoilValue(
    walletAddress
      ? IndexerSelectors.userVotesSelector({
          apiUrl: INDEXER_API_ENDPOINT,
          params: [walletAddress],
        })
      : constSelector([]),
  );

  const refreshUserVotes = useRecoilRefresher_UNSTABLE(
    walletAddress
      ? IndexerSelectors.userVotesSelector({
          apiUrl: INDEXER_API_ENDPOINT,
          params: [walletAddress],
        })
      : constSelector([]),
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
    pairs,
    userPools,
    assetPrices,
    ibcBalances,
    refreshIbcBalances,
    ibcBalanceSelector,
    cw20Balances,
    refreshCw20Balances,
    cw20BalanceSelector,
    userFiat,
    swapOperationRoutes,
    userVotes,
    refreshUserVotes,
  };
};
