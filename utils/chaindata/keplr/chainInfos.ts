import { KeplrClient } from "@cosmos-kit/keplr";

export type ChainInfo = Parameters<KeplrClient["client"]["experimentalSuggestChain"]>[0];

export const chainInfos: Record<string, ChainInfo> = {
  "axelar-dojo-1": {
    rpc: "https://rpc-axelar.imperator.co",
    rest: "https://lcd-axelar.imperator.co",
    chainId: "axelar-dojo-1",
    chainName: "axelar",
    stakeCurrency: {
      coinDenom: "axl",
      coinMinimalDenom: "uaxl",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "axelar",
      bech32PrefixAccPub: "axelar",
      bech32PrefixValAddr: "axelar",
      bech32PrefixValPub: "axelar",
      bech32PrefixConsAddr: "axelar",
      bech32PrefixConsPub: "axelar",
    },
    currencies: [
      {
        coinDenom: "axl",
        coinMinimalDenom: "uaxl",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "axl",
        coinMinimalDenom: "uaxl",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.007,
          average: 0.025,
          high: 0.05,
        },
      },
    ],
  },
  "cosmoshub-4": {
    rpc: "https://rpc-cosmoshub.blockapsis.com",
    rest: "https://lcd-cosmoshub.blockapsis.com",
    chainId: "cosmoshub-4",
    chainName: "cosmoshub",
    stakeCurrency: {
      coinDenom: "atom",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmos",
      bech32PrefixValAddr: "cosmos",
      bech32PrefixValPub: "cosmos",
      bech32PrefixConsAddr: "cosmos",
      bech32PrefixConsPub: "cosmos",
    },
    currencies: [
      {
        coinDenom: "atom",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "atom",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0,
          average: 0.025,
          high: 0.05,
        },
      },
    ],
  },
  "juno-1": {
    rpc: "https://rpc-juno.whispernode.com",
    rest: "https://lcd-juno.whispernode.com",
    chainId: "juno-1",
    chainName: "juno",
    stakeCurrency: {
      coinDenom: "juno",
      coinMinimalDenom: "ujuno",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "juno",
      bech32PrefixValAddr: "juno",
      bech32PrefixValPub: "juno",
      bech32PrefixConsAddr: "juno",
      bech32PrefixConsPub: "juno",
    },
    currencies: [
      {
        coinDenom: "juno",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "juno",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.03,
          average: 0.04,
          high: 0.05,
        },
      },
    ],
  },
  "kichain-t-4": {
    rpc: "https://testnet-rpc.kichain.chaintools.tech",
    rest: "https://testnet-api.kichain.chaintools.tech",
    chainId: "kichain-t-4",
    chainName: "kichaintestnet",
    stakeCurrency: {
      coinDenom: "tki",
      coinMinimalDenom: "utki",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "tki",
      bech32PrefixAccPub: "tki",
      bech32PrefixValAddr: "tki",
      bech32PrefixValPub: "tki",
      bech32PrefixConsAddr: "tki",
      bech32PrefixConsPub: "tki",
    },
    currencies: [
      {
        coinDenom: "tki",
        coinMinimalDenom: "utki",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "tki",
        coinMinimalDenom: "utki",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.025,
          average: 0.05,
          high: 0.075,
        },
      },
    ],
  },
  "stargaze-1": {
    rpc: "https://stargaze-rpc.polkachu.com/",
    rest: "https://testnet-api.kichain.chaintools.tech",
    chainId: "stargaze-1",
    chainName: "stargaze-1",
    stakeCurrency: {
      coinDenom: "stars",
      coinMinimalDenom: "ustars",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "stars",
      bech32PrefixAccPub: "stars",
      bech32PrefixValAddr: "stars",
      bech32PrefixValPub: "stars",
      bech32PrefixConsAddr: "stars", 
      bech32PrefixConsPub: "stars",
    },
    currencies: [
      {
        coinDenom: "stars",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "stars",
        coinMinimalDenom: "ustars",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.025,
          average: 0.05,
          high: 0.075,
        },
      },
    ],
  },
  "osmosis-1": {
    rpc: "https://rpc.osmosis.zone",
    rest: "https://lcd.osmosis.zone",
    chainId: "osmosis-1",
    chainName: "osmosis",
    stakeCurrency: {
      coinDenom: "osmo",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "osmo",
      bech32PrefixAccPub: "osmo",
      bech32PrefixValAddr: "osmo",
      bech32PrefixValPub: "osmo",
      bech32PrefixConsAddr: "osmo",
      bech32PrefixConsPub: "osmo",
    },
    currencies: [
      {
        coinDenom: "osmo",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
      },
      {
        coinDenom: "ion",
        coinMinimalDenom: "uion",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "osmo",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
  },
  "uni-5": {
    rpc: "https://rpc.uni.junonetwork.io",
    rest: "https://api.uni.junonetwork.io",
    chainId: "uni-5",
    chainName: "junotestnet",
    stakeCurrency: {
      coinDenom: "junox",
      coinMinimalDenom: "ujunox",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "juno",
      bech32PrefixValAddr: "juno",
      bech32PrefixValPub: "juno",
      bech32PrefixConsAddr: "juno",
      bech32PrefixConsPub: "juno",
    },
    currencies: [
      {
        coinDenom: "junox",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "junox",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.03,
          average: 0.04,
          high: 0.05,
        },
      },
    ],
  },
  "mars-1": {
    rpc: "https://rpc.expedition-mars.com",
    rest: "https://lcd.expedition-mars.com",
    chainId: "mars-1",
    chainName: "mars",
    stakeCurrency: {
      coinDenom: "mars",
      coinMinimalDenom: "umars",
      coinDecimals: 6,
    },
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: "mars",
      bech32PrefixAccPub: "mars",
      bech32PrefixValAddr: "mars",
      bech32PrefixValPub: "mars",
      bech32PrefixConsAddr: "mars",
      bech32PrefixConsPub: "mars",
    },
    currencies: [
      {
        coinDenom: "mars",
        coinMinimalDenom: "umars",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "mars",
        coinMinimalDenom: "umars",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.03,
          average: 0.04,
          high: 0.05,
        },
      },
    ],
  },
};
