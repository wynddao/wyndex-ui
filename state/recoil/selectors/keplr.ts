import { KeplrClient, KeplrExtensionWallet } from "@cosmos-kit/keplr";
import { selectorFamily } from "recoil";
import { chainInfos } from "../../../utils/chaindata/keplr/chainInfos";

export interface NativeKeplrData {
  readonly keplrClient?: KeplrClient;
  readonly nativeAddress?: string;
}

export const getNativeKeplrData = selectorFamily<
  NativeKeplrData,
  { readonly chainId?: string | null | undefined }
>({
  key: "getNativeKeplrData",
  get:
    ({ chainId }) =>
    async () => {
      if (!chainId) return {};

      try {
        const chainInfo = chainInfos[chainId];
        if (!chainInfo) return {};

        const keplrWallet = new KeplrExtensionWallet(
          { name: "keplr-extension", prettyName: "Keplr", mode: "extension", mobileDisabled: true },
          { [chainInfo.chainName]: { rpc: [chainInfo.rpc] } },
        );
        const keplrClient = await keplrWallet.fetchClient();
        await keplrClient.client.experimentalSuggestChain(chainInfo);
        const { address: nativeAddress } = await keplrClient.getAccount(chainInfo.chainId);

        return { keplrClient, nativeAddress };
      } catch {
        return {};
      }
    },
});
