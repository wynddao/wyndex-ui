import { useWallet } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos, usePairInfos } from "../../state";
import { PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { getAssetPrice, getNativeIbcTokenDenom } from "../../utils/assets";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";
import TokenName from "../TokenName";
import LiquidityMining from "./LiquidityMining";
import PoolCatalyst from "./PoolCatalyst";
import PoolCatalystSimple from "./PoolCatalystSimple";
import PoolHeader from "./PoolHeader";
import UnboundingsGrid from "./UnbondingsGrid";

interface PoolWrapperOptions {
  poolData: PoolResponse;
}

export default function PoolWrapper({ poolData }: PoolWrapperOptions) {
  const assetInfo = [poolData.assets[0].info, poolData.assets[1].info];
  const { address: walletAddress } = useWallet();
  const { pair } = usePairInfos(assetInfo);
  const currency = useRecoilValue(currencyAtom);

  // Get Token prices
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  const tokenPrice1 = getAssetPrice(poolData.assets[0].info, assetPrices);
  const tokenPrice2 = getAssetPrice(poolData.assets[1].info, assetPrices);

  const pairNames = pair.asset_infos.map((assetInfo, index) => {
    if (assetInfo.hasOwnProperty("native")) {
      // @ts-ignore
      return <span key={index}>{microdenomToDenom(getNativeIbcTokenDenom(assetInfo.native))}</span>;
    } else {
      // @ts-ignore
      return <TokenName symbol={true} key={index} address={assetInfo.token} />;
    }
  });

  // Calculate total share in USD
  const totalFiatShares =
    Number(microamountToAmount(poolData.assets[0].amount, 6)) *
      (currency === "USD" ? tokenPrice1.priceInUsd : tokenPrice1.priceInEur) +
    Number(microamountToAmount(poolData.assets[1].amount, 6)) *
      (currency === "USD" ? tokenPrice2.priceInUsd : tokenPrice2.priceInEur);

  // Value of one LP token in $
  const lpTokenValue = (1 / Number(microamountToAmount(poolData.total_share, 6))) * totalFiatShares;

  // Value of APR token per LP token
  const { apr } = useStakeInfos(pair.staking_addr);

  // Loop through APR for every unbonding time to calculat the % of each reward and add it up
  const aprCalculated = apr.map((bucket) => {
    let value = 0;

    // Loop for through reward in bucket
    bucket[1].map((reward) => {
      const price = getAssetPrice(reward.info, assetPrices);
      value += Number(reward.amount) * (currency === "USD" ? price.priceInUsd : price.priceInEur);
    });

    return {
      unbonding_period: bucket[0],
      // Calculate APR by that
      apr: value > 0 ? value / lpTokenValue : 0,
    };
  });

  return (
    <>
      <PoolHeader
        totalInFiat={totalFiatShares}
        walletAddress={walletAddress || ""}
        chainData={poolData}
        pairData={pair}
        apr={aprCalculated}
        pairNames={pairNames}
      />
      {walletAddress ? (
        <PoolCatalyst chainData={poolData} pairData={pair} />
      ) : (
        <PoolCatalystSimple chainData={poolData} />
      )}
      {walletAddress ? (
        <LiquidityMining pairData={pair} apr={aprCalculated} pairNames={pairNames} />
      ) : (
        <UnboundingsGrid stakeAddress={pair.staking_addr} apr={aprCalculated} />
      )}
    </>
  );
}
