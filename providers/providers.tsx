import { Chain } from "@chain-registry/types";
import { SignerOptions } from "@cosmos-kit/core";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import { GasPrice } from "cosmwasm";
import { RecoilRoot } from "recoil";
import { InnerWalletProvider, ThemeProvider } from "../providers";
import { testnet as junoTestnet, testnet_assets as junoAssets } from "../utils/chaindata";

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
          wallets={[...keplrWallets, ...leapwallets, ...cosmostationWallets]}
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
