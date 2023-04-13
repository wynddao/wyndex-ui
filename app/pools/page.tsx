"use client";
import Pools from "../../components/Dex/Pools";
import { useIndexerInfos } from "../../state";

export default function Page() {
  const { pools, userPools, assetPrices, ibcBalances, cw20Balances } = useIndexerInfos({
    fetchPoolData: true,
    fetchIbcBalances: true,
    fetchCw20Balances: true,
  });

  return (
    <>
      <Pools
        pools={pools}
        userPools={userPools}
        assetPrices={assetPrices}
        ibcBalances={ibcBalances}
        cw20Balances={cw20Balances}
      />
    </>
  );
}
