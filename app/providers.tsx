"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { wallets } from "@cosmos-kit/keplr";
import { WalletProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import { RecoilRoot } from "recoil";
import ConnectWalletModal from "../components/ConnectWalletModal";
import { extendedTheme } from "../theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={extendedTheme}>
      <RecoilRoot>
        <WalletProvider
          chains={chains}
          assetLists={assets}
          wallets={wallets}
          walletModal={ConnectWalletModal}
        >
          {children}
        </WalletProvider>
      </RecoilRoot>
    </ChakraProvider>
  );
}
