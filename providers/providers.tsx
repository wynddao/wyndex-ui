import { Chain } from "@chain-registry/types";
import { MainWalletBase, SignerOptions } from "@cosmos-kit/core";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap-extension";
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
          //! FIXME type missmatch, try fixing after updating all @cosmos-kit
          // @ts-ignore
          wallets={[...keplrWallets, ...(leapwallets as unknown as MainWalletBase[]), ...cosmostationWallets]}
          signerOptions={signerOptions}
          endpointOptions={{
            junotestnet1: {
              rpc: ["https://rpc.uni.juno.deuslabs.fi/"],
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
