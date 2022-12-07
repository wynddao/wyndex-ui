"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { useWallet, WalletProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { extendedTheme } from "../theme";
import { testnet as junoTestnet, testnet_assets as junoAssets } from "../utils/chaindata";
import { signingCosmWasmClientAtom } from "../state";
import { useEffect } from "react";
import { GasPrice } from "cosmwasm";
import { SignerOptions } from "@cosmos-kit/core";
import { Chain } from "@chain-registry/types";

// construct signer options
const signerOptions: SignerOptions = {
  //@ts-ignore
  signingCosmwasm: (chain: Chain) => {
    // return corresponding cosmwasm options or undefined
    switch (chain.chain_name) {
      case "osmosis":
        return {
          gasPrice: GasPrice.fromString("0.0025uosmo"),
        };
      case "juno":
        return {
          gasPrice: GasPrice.fromString("0.0025ujuno"),
        };
      case "junotestnet":
        return {
          gasPrice: GasPrice.fromString("0.0050ujunox"),
        };
    }
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={extendedTheme} cssVarsRoot="body">
      <RecoilRoot>
        <WalletProvider
          chains={[...chains, junoTestnet]}
          assetLists={[...assets, junoAssets]}
          wallets={[...keplrWallet, ...cosmostationWallets, ...leapwallets]}
          signerOptions={signerOptions}
        >
          <InnerWalletProvider>{children}</InnerWalletProvider>
        </WalletProvider>
      </RecoilRoot>
    </ChakraProvider>
  );
}

const InnerWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const setSigningCosmWasmClient = useSetRecoilState(signingCosmWasmClientAtom);
  const { getSigningCosmWasmClient, address } = useWallet();

  // Save client in recoil atom so it can be used by selectors.
  useEffect(() => {
    const async = async () => {
      const signingCosmWasmClient = await getSigningCosmWasmClient();
      //@ts-ignore
      setSigningCosmWasmClient(signingCosmWasmClient);
    };
    async();
  }, [getSigningCosmWasmClient, setSigningCosmWasmClient, address]);

  return <>{children}</>;
};
