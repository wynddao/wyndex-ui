"use client";
import { Chain } from "@chain-registry/types";
import { MainWalletBase, SignerOptions } from "@cosmos-kit/core";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap-extension";
import { ChainProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import { GasPrice } from "cosmwasm";
import { RecoilRoot } from "recoil";
import { InnerWalletProvider } from "../providers";
import { testnet as junoTestnet, testnet_assets as junoAssets } from "../utils/chaindata";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { darkTheme } from "../theme";
import ThemeProvider from "./ThemeProvider";

// construct signer options
const signerOptions = {
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
      case "junotestnet1":
        return {
          gasPrice: GasPrice.fromString("0.0050ujunox"),
        };
    }
  },
  signingStargate: (chain: Chain) => {
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
      case "junotestnet1":
        return {
          gasPrice: GasPrice.fromString("0.0050ujunox"),
        };
    }
  },
} as SignerOptions;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <RecoilRoot>
        <ChainProvider
          walletConnectOptions={undefined}
          chains={[...chains, junoTestnet]}
          assetLists={[...assets, junoAssets]}
          //! FIXME type missmatch, try fixing after updating all @cosmos-kit
          // @ts-ignore
          wallets={[...keplrWallets, ...(leapwallets as unknown as MainWalletBase[]), ...cosmostationWallets]}
          signerOptions={signerOptions}
        >
          <InnerWalletProvider>
            <ThemeProvider>{children} </ThemeProvider>
          </InnerWalletProvider>
        </ChainProvider>
      </RecoilRoot>
    </CacheProvider>
  );
}
