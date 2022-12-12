import { useWallet } from "@cosmos-kit/react";
import { usePairInfos, usePoolInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexFactory.types";
import { PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { getAssetInfo } from "../../utils/assets";
import { Pair } from "../../utils/types";
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

  return (
    <>
      <PoolHeader walletAddress={walletAddress || ""} chainData={poolData} pairData={pair} />
      {walletAddress ? (
        <PoolCatalyst chainData={poolData} pairData={pair} />
      ) : (
        <PoolCatalystSimple chainData={poolData} />
      )}
      {walletAddress ? <LiquidityMining pairData={pair} /> : <UnboundingsGrid stakeAddress={pair.staking_addr} />}
    </>
  );
}
