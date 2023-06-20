import { CosmWasmClient } from "cosmwasm";
import { useIndexerInfos } from "../state";
import { AnnualizedRewardsResponse } from "../state/clients/types/WyndexStake.types";
import { getAssetInfoDetails, getAssetPrice } from "./assets";
import { CHAIN_RPC_ENDPOINT, FACTORY_CONTRACT_ADDRESS, INDEXER_API_ENDPOINT } from "./constants";
import { microamountToAmount } from "./tokens";

export interface AprCalculated {
  unbonding_period: number;
  apr: string;
}

export const getAprForPool = async (poolAddress: string, assetPrices: any, permlessAssets?: any): Promise<AprCalculated[]> => {
  const client = await CosmWasmClient.connect(CHAIN_RPC_ENDPOINT);
  const poolData = await client.queryContractSmart(poolAddress, {
    pool: {},
  });
  const tokenPrice1 = getAssetPrice(poolData.assets[0].info, assetPrices);
  const tokenPrice2 = getAssetPrice(poolData.assets[1].info, assetPrices);
  const tokenInfo1 = getAssetInfoDetails(poolData.assets[0].info, permlessAssets);
  const tokenInfo2 = getAssetInfoDetails(poolData.assets[1].info, permlessAssets);

  // Calculate total share in USD
  const totalFiatShares =
    Number(microamountToAmount(poolData.assets[0].amount, tokenInfo1.decimals)) * tokenPrice1.priceInUsd +
    Number(microamountToAmount(poolData.assets[1].amount, tokenInfo2.decimals)) * tokenPrice2.priceInUsd;

  // Value of one LP token in $
  const lpTokenValue = (1 / Number(microamountToAmount(poolData.total_share, 6))) * totalFiatShares;
  const apr_res: AnnualizedRewardsResponse = await (
    await fetch(`${INDEXER_API_ENDPOINT}/pools/apr/${poolAddress}`)
  ).json();

  const apr = apr_res.rewards;

  // Loop through APR for every unbonding time to calculat the % of each reward and add it up
  const aprCalculated = apr.map((bucket) => {
    let value = 0;

    // Loop for through reward in bucket
    bucket[1].map((reward) => {
      const price = getAssetPrice(reward.info, assetPrices);
      value += (Number(reward.amount) / 1000000) * price.priceInUsd * 10 ** 6; //! TODO
    });

    return {
      unbonding_period: bucket[0],
      // Calculate APR by that
      apr: poolData.assets[0].amount + "/" + poolData.assets[1].amount,
    };
  });

  return aprCalculated;
};
