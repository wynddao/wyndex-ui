import { useWallet } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { useCw20UserInfos, useIndexerInfos, usePairInfos, usePoolInfos } from "../../state";
import { PairInfo } from "../../state/clients/types/WyndexFactory.types";
import { PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { getAssetPrice } from "../../utils/assets";
import { formatCurrency } from "../../utils/currency";
import { microamountToAmount } from "../../utils/tokens";

interface MySharesOptions {
  poolAddress: string;
}

export default function MyShares({ poolAddress }: MySharesOptions) {
  const { pool: chainData } = usePoolInfos(poolAddress);
  const assetInfo = [chainData.assets[0].info, chainData.assets[1].info];
  const { pair: pairData } = usePairInfos(assetInfo);
  const { address: walletAddress } = useWallet();
  const wyndexStake = pairData.staking_addr;
  const { allStakes } = useUserStakeInfos(wyndexStake, walletAddress || "");
  const currency = useRecoilValue(currencyAtom);
  
  // Get Token prices
  const { assetPrices } = useIndexerInfos({ fetchPoolData: false });
  const tokenPrice1 = getAssetPrice(chainData.assets[0].info, assetPrices);
  const tokenPrice2 = getAssetPrice(chainData.assets[1].info, assetPrices);

  // Calculate total share in USD
  const totalFiatShares =
    Number(microamountToAmount(chainData.assets[0].amount, 6)) *
      (currency === "USD" ? tokenPrice1.priceInUsd : tokenPrice1.priceInEur) +
    Number(microamountToAmount(chainData.assets[1].amount, 6)) *
      (currency === "USD" ? tokenPrice2.priceInUsd : tokenPrice2.priceInEur);
  const { balance: lpBalance } = useCw20UserInfos(pairData.liquidity_token);

  //  Add currently unstaking amounts
  const { pendingUnstaking } = useStakeInfos(pairData.staking_addr, true);

  const unstakesSum = pendingUnstaking.reduce((acc, obj) => {
    return acc + Number(obj.amount);
  }, 0);

  const allStakesSum = allStakes.reduce((acc: number, obj) => {
    return acc + Number(obj.stake);
  }, 0);

  const totalTokens = unstakesSum + allStakesSum + Number(lpBalance);
  const myShare = totalTokens / Number(chainData.total_share);
  const myFiatShare = myShare * totalFiatShares;

  return <span>{formatCurrency(currency, `${myFiatShare}`)}</span>;
}
