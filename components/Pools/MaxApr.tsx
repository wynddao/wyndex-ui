import { useIndexerInfos, usePairInfos, usePoolInfos, useTokenInfo } from "../../state";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { getAssetInfoDetails, getAssetPrice } from "../../utils/assets";
import { microamountToAmount } from "../../utils/tokens";
import { getApr } from "../Pool/util/apr";

export default function MaxApr({ poolAddress }: { poolAddress: string }) {
  const { pool: poolData } = usePoolInfos(poolAddress);
  const assetInfo = [poolData.assets[0].info, poolData.assets[1].info];
  const { pair } = usePairInfos(assetInfo);

  // Get Token prices
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  const tokenPrice1 = getAssetPrice(poolData.assets[0].info, assetPrices);
  const tokenPrice2 = getAssetPrice(poolData.assets[1].info, assetPrices);
  const tokenInfo1 = getAssetInfoDetails(poolData.assets[0].info);
  const tokenInfo2 = getAssetInfoDetails(poolData.assets[1].info);

  // Calculate total share in USD
  const totalFiatShares =
    Number(microamountToAmount(poolData.assets[0].amount, tokenInfo1.decimals)) * tokenPrice1.priceInUsd +
    Number(microamountToAmount(poolData.assets[1].amount, tokenInfo2.decimals)) * tokenPrice2.priceInUsd;

  const ltokenInfo = useTokenInfo(pair.liquidity_token);
  // Value of one LP token in $
  const lpTokenValue =
    (1 / Number(microamountToAmount(poolData.total_share, ltokenInfo.tokenDecimals))) * totalFiatShares;

  // Value of APR token per LP token
  const { apr } = useStakeInfos(pair.staking_addr);

  // Loop through APR for every unbonding time to calculat the % of each reward and add it up
  const aprCalculated = apr.map((bucket) => {
    let value = 0;

    // Loop for through reward in bucket
    bucket[1].map((reward) => {
      const price = getAssetPrice(reward.info, assetPrices);
      value += (Number(reward.amount) / 1000000) * price.priceInUsd;
    });

    return {
      unbonding_period: bucket[0],
      // Calculate APR by that
      apr: value > 0 ? value / lpTokenValue : 0,
    };
  });

  return <strong>{getApr(aprCalculated, aprCalculated.slice(-1)[0].unbonding_period)}</strong>;
}
