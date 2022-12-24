"use client";

import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { RecoilRoot } from "recoil";
import { testnet as junoTestnet, testnet_assets as junoAssets } from "../utils/chaindata";
import { GasPrice } from "cosmwasm";
import { SignerOptions } from "@cosmos-kit/core";
import { Chain } from "@chain-registry/types";
import { InnerWalletProvider, ThemeProvider } from "../providers";

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
    <ThemeProvider>
      <RecoilRoot>
        <WalletProvider
          chains={[...chains, junoTestnet]}
          assetLists={[...assets, junoAssets]}
          wallets={[...keplrWallet, ...cosmostationWallets, ...leapwallets]}
          signerOptions={signerOptions}
          endpointOptions={{
            junotestnet1: {
              rpc: ["https://juno-uni-5.mib.tech/"],
              rest: ["https://juno-testnet-api.polkachu.com/"],
            },
          }}
        >
          <InnerWalletProvider>{children}</InnerWalletProvider>
        </WalletProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}
