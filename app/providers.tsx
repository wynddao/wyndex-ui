"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { wallets } from "@cosmos-kit/keplr";
import { WalletProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { RecoilRoot } from "recoil";
import ConnectWalletModal from "../components/ConnectWalletModal";
import { extendedTheme } from "../theme";
import { testnet as junoTestnet, testnet_assets as junoAssets } from "../utils/chaindata";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={extendedTheme} cssVarsRoot="body">
      <RecoilRoot>
        <WalletProvider
          chains={[...chains, junoTestnet]}
          assetLists={[...assets, junoAssets]}
          wallets={wallets}
          walletModal={ConnectWalletModal}
        >
          {children}
        </WalletProvider>
      </RecoilRoot>
    </ChakraProvider>
  );
}
