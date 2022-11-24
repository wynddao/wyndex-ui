import { usePairInfos, usePoolInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexFactory.types";
import { getAssetInfo } from "../../utils/assets";
import { Pair } from "../../utils/types";
import LiquidityMining from "./LiquidityMining";
import PoolCatalyst from "./PoolCatalyst";
import PoolHeader from "./PoolHeader";

interface PoolWrapperOptions {
  poolData: Pair;
}

export default function PoolWrapper({ poolData }: PoolWrapperOptions) {
  const assetInfo: AssetInfo[] = [getAssetInfo(poolData.tokens[0]), getAssetInfo(poolData.tokens[1])];
  const { pair } = usePairInfos(assetInfo);
  const { pool } = usePoolInfos(pair.contract_addr);

  return (
    <>
      <PoolHeader poolData={poolData} chainData={pool} pairData={pair} />
      <LiquidityMining poolData={poolData} />
      <PoolCatalyst poolData={poolData} chainData={pool} />
    </>
  );
}
