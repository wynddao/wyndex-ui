import { Asset, IBCAsset } from "@wynddao/asset-list";
import { CosmWasmClient } from "cosmwasm";
import { selectorFamily } from "recoil";
import { INDEXER_API_ENDPOINT } from "../../../utils";
import { ChainInfo, chainInfos } from "../../../utils/chaindata/keplr/chainInfos";
import { getAssetList } from "../../../utils/getAssetList";
import { microamountToAmount } from "../../../utils/tokens";
import { ibcBalanceSelector } from "./clients/indexer";

export interface TransferIbcData {
  readonly nativeChain?: {
    readonly tokenName?: string;
    readonly userAddress?: string;
    readonly balance?: string;
  };
  readonly ibcChain?: {
    readonly tokenName?: string;
    readonly userAddress?: string;
    readonly balance?: string;
  };
}

export const getTransferIbcData = selectorFamily<
  TransferIbcData,
  {
    readonly chainId?: string | null | undefined;
    readonly address?: string | null | undefined;
    readonly nativeAddress?: string | null | undefined;
  }
>({
  key: "getTransferIbcData",
  get:
    ({ chainId, address, nativeAddress }) =>
    async ({ get }) => {
      if (!chainId || !address || !nativeAddress) return {};

      try {
        const assets: readonly Asset[] = getAssetList().tokens;
        const ibcAssets: readonly IBCAsset[] = assets.filter(
          (asset): asset is IBCAsset => asset.tags !== "cw20",
        );
        const asset = ibcAssets.find((asset) => asset.chain_id === chainId);
        if (!asset) return {};

        const chainInfo: ChainInfo | undefined = chainInfos[chainId];
        const ibcBalance = get(
          ibcBalanceSelector({ apiUrl: INDEXER_API_ENDPOINT, params: [address, asset?.juno_denom ?? ""] }),
        );
        const cwClient = await CosmWasmClient.connect(chainInfo.rpc);
        const nativeBalance = await cwClient.getBalance(nativeAddress, asset.denom);

        const transferIbcData: TransferIbcData = {
          nativeChain: {
            tokenName: asset.name,
            userAddress: nativeAddress,
            balance: microamountToAmount(nativeBalance?.amount ?? 0, asset.decimals),
          },
          ibcChain: {
            tokenName: "IBC/" + asset.name,
            userAddress: address,
            balance: microamountToAmount(ibcBalance?.amount ?? 0, asset.decimals),
          },
        };

        return transferIbcData;
      } catch {
        return {};
      }
    },
});
