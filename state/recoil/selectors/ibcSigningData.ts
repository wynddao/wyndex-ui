import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { CosmostationExtensionWallet } from "@cosmos-kit/cosmostation-extension";
import { KeplrExtensionWallet } from "@cosmos-kit/keplr-extension";
import { LeapExtensionWallet } from "@cosmos-kit/leap-extension";
import { useWalletClient } from "@cosmos-kit/react";
import { Asset, IBCAsset } from "@wynddao/asset-list";
import { RecoilValueReadOnly, selectorFamily } from "recoil";
import { chainInfos } from "../../../utils/chaindata/keplr/chainInfos";
import { getAssetList } from "../../../utils/getAssetList";

export const walletNames = {
  keplr: "keplr-extension",
  leap: "leap-extension",
  cosmostation: "cosmostation-extension",
};

export function getIbcSigningDataSelector(
  chainId?: string,
  walletName?: string,
): RecoilValueReadOnly<IbcSigningData> {
  switch (walletName) {
    case walletNames.keplr:
      return getKeplrIbcSigningData({ chainId });
    case walletNames.leap:
      return getLeapIbcSigningData({ chainId });
    case walletNames.cosmostation:
      return getCosmostationIbcSigningData({ chainId });
    default:
      return getKeplrIbcSigningData({ chainId });
  }
}

export interface IbcSigningData {
  readonly feeAsset?: IBCAsset;
  readonly ibcSigningClient?: SigningStargateClient;
  readonly nativeAddress?: string;
}

export const getKeplrIbcSigningData = selectorFamily<
  IbcSigningData,
  { readonly chainId?: string | null | undefined }
>({
  key: "getKeplrIbcSigningData",
  get:
    ({ chainId }) =>
    async () => {

      if (!chainId) return {};

      try {
        const chainInfo = chainInfos[chainId];

        if (!chainInfo) return {};

        const assets: readonly Asset[] = getAssetList().tokens;
        const ibcAssets: readonly IBCAsset[] = assets.filter(
          (asset): asset is IBCAsset => asset.tags !== "cw20",
        );

        const feeAsset = ibcAssets.find((asset) => asset.chain_id === chainId);
        if (!feeAsset) return {};

        const keplrWallet = new KeplrExtensionWallet(
          { name: walletNames.keplr, prettyName: "Keplr", mode: "extension", mobileDisabled: true },
          { [chainInfo.chainName]: { rpc: [feeAsset.rpc] } },
        );
        const { status, client } = useWalletClient("keplr-extension");

        // @ts-ignore
        const keplrSigner = await client.getOfflineSigner(chainInfo.chainId);
        const gasPrice = GasPrice.fromString(
          String(
            chainInfo.feeCurrencies.find((currency) => currency.coinMinimalDenom === feeAsset.denom)
              ?.gasPriceStep?.average,
          ) + feeAsset.denom,
        );

        let ibcSigningClientAny: any = await SigningStargateClient.connectWithSigner(
          feeAsset.rpc,
          keplrSigner,
          {
            gasPrice,
          },
        );
        // NOTE ibc deposit fails without manually adding this field
        ibcSigningClientAny.chainId = chainInfo.chainId;
        const ibcSigningClient: SigningStargateClient = ibcSigningClientAny;

        // @ts-ignore
        const { address: nativeAddress } = await client.getAccount(chainInfo.chainId);

        return { feeAsset, ibcSigningClient, nativeAddress };
      } catch (e) {
        console.error(e);
        return {};
      }
    },
});

export const getLeapIbcSigningData = selectorFamily<
  IbcSigningData,
  { readonly chainId?: string | null | undefined }
>({
  key: "getLeapIbcSigningData",
  get:
    ({ chainId }) =>
    async () => {
      if (!chainId) return {};

      try {
        const chainInfo = chainInfos[chainId];
        if (!chainInfo) return {};

        const assets: readonly Asset[] = getAssetList().tokens;
        const ibcAssets: readonly IBCAsset[] = assets.filter(
          (asset): asset is IBCAsset => asset.tags !== "cw20",
        );
        const feeAsset = ibcAssets.find((asset) => asset.chain_id === chainId);
        if (!feeAsset) return {};

        const leapWallet = new LeapExtensionWallet({
          name: walletNames.leap,
          prettyName: "Leap",
          mode: "extension",
          mobileDisabled: true,
        });
        const { status, client } = useWalletClient("leap-extension");

        // @ts-ignore
        const leapSigner = await client.getOfflineSigner(chainInfo.chainId);
        const gasPrice = GasPrice.fromString(
          String(
            chainInfo.feeCurrencies.find((currency) => currency.coinMinimalDenom === feeAsset.denom)
              ?.gasPriceStep?.average,
          ) + feeAsset.denom,
        );
        let ibcSigningClientAny: any = await SigningStargateClient.connectWithSigner(
          chainInfo.rpc,
          leapSigner,
          {
            gasPrice,
          },
        );
        // NOTE ibc deposit fails without manually adding this field
        ibcSigningClientAny.chainId = chainInfo.chainId;
        const ibcSigningClient: SigningStargateClient = ibcSigningClientAny;

        // @ts-ignore
        const { address: nativeAddress } = await client.getAccount(chainInfo.chainId);

        return { feeAsset, ibcSigningClient, nativeAddress };
      } catch {
        return {};
      }
    },
});

export const getCosmostationIbcSigningData = selectorFamily<
  IbcSigningData,
  { readonly chainId?: string | null | undefined }
>({
  key: "getCosmostationIbcSigningData",
  get:
    ({ chainId }) =>
    async () => {
      if (!chainId) return {};

      try {
        const chainInfo = chainInfos[chainId];
        if (!chainInfo) return {};

        const assets: readonly Asset[] = getAssetList().tokens;
        const ibcAssets: readonly IBCAsset[] = assets.filter(
          (asset): asset is IBCAsset => asset.tags !== "cw20",
        );
        const feeAsset = ibcAssets.find((asset) => asset.chain_id === chainId);
        if (!feeAsset) return {};

        const cosmostationWallet = new CosmostationExtensionWallet({
          name: walletNames.cosmostation,
          prettyName: "Cosmostation",
          mode: "extension",
          mobileDisabled: true,
        });
        const { status, client } = useWalletClient("cosmostation-extension");

        // @ts-ignore
        const cosmostationSigner = await client.getOfflineSigner(chainInfo.chainId);
        const gasPrice = GasPrice.fromString(
          String(
            chainInfo.feeCurrencies.find((currency) => currency.coinMinimalDenom === feeAsset.denom)
              ?.gasPriceStep?.average,
          ) + feeAsset.denom,
        );
        let ibcSigningClientAny: any = await SigningStargateClient.connectWithSigner(
          chainInfo.rpc,
          cosmostationSigner,
          {
            gasPrice,
          },
        );
        // NOTE ibc deposit fails without manually adding this field
        ibcSigningClientAny.chainId = chainInfo.chainId;
        const ibcSigningClient: SigningStargateClient = ibcSigningClientAny;

        // @ts-ignore
        const { address: nativeAddress } = await client.getAccount(chainInfo.chainId);

        return { feeAsset, ibcSigningClient, nativeAddress };
      } catch {
        return {};
      }
    },
});
