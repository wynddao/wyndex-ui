import { useWallet } from "@cosmos-kit/react";
import { usePairInfos, usePoolInfos } from "../../state";
import { AssetInfo } from "../../state/clients/types/WyndexFactory.types";
import { getAssetInfo } from "../../utils/assets";
import { Pair } from "../../utils/types";
import LiquidityMining from "./LiquidityMining";
import PoolCatalyst from "./PoolCatalyst";
import PoolCatalystSimple from "./PoolCatalystSimple";
import PoolHeader from "./PoolHeader";
import UnboundingsGrid from "./UnboundingsGrid";

interface PoolWrapperOptions {
  poolData: Pair;
}

export default function PoolWrapper({ poolData }: PoolWrapperOptions) {
  const assetInfo: AssetInfo[] = [getAssetInfo(poolData.tokens[0]), getAssetInfo(poolData.tokens[1])];
  const { address: walletAddress } = useWallet();
  const { pair } = usePairInfos(assetInfo);
  const { pool } = usePoolInfos(pair.contract_addr);
  // TODO: Query is missing for stake contract address
  const wyndexStake = "juno1yt7m620jnug2hkzp0hwwud3sjdcq3hw7l8cs5yqyqulrntnmmkes9dwung";

  return (
    <>
      <PoolHeader chainData={pool} pairData={pair} />
      {walletAddress ? (
        <LiquidityMining poolData={poolData} pairData={pair} />
      ) : (
        <UnboundingsGrid stakeAddress={wyndexStake} />
      )}
      {walletAddress ? (
        <PoolCatalyst chainData={pool} pairData={pair} />
      ) : (
        <PoolCatalystSimple chainData={pool} />
      )}
    </>
  );
}
