import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/amino";
import { Asset, Decimal } from "./types/WyndexPair.types";
export class Cw20QueryClient {
  client: CosmWasmClient;

  constructor(client: CosmWasmClient) {
    this.client = client;
  }
}

export class CustomClient extends Cw20QueryClient {
  client: SigningCosmWasmClient;
  sender: string;

  constructor(client: SigningCosmWasmClient, sender: string) {
    super(client);
    this.client = client;
    this.sender = sender;
    this.customProvideLP = this.customProvideLP.bind(this);
  }

  customProvideLP = async ({
    assets,
    pairContractAddress,
    funds,
    slippageTolerance,
  }: {
    pairContractAddress: string;
    assets: Asset[];
    slippageTolerance?: Decimal;
    funds?: Coin[];
  }): Promise<ExecuteResult> => {
    // Check if there is a native token in the swap
    let msgs: any[] = [];

    if (assets.find((asset) => asset.info.hasOwnProperty("token")) === undefined) {
      msgs = [
        {
          contractAddress: pairContractAddress,
          msg: {
            provide_liquidity: {
              assets,
              slippage_tolerance: slippageTolerance,
            },
          },
          funds,
        },
      ];
    } else if (assets.find((asset) => asset.info.hasOwnProperty("native_token"))) {
      msgs = [
        {
          //@ts-ignore
          contractAddress: assets.find((asset) => asset.info.hasOwnProperty("token"))?.info.token,
          msg: {
            increase_allowance: {
              amount: assets.find((asset) => asset.info.hasOwnProperty("token"))?.amount,
              spender: pairContractAddress,
            },
          },
        },
        {
          contractAddress: pairContractAddress,
          msg: {
            provide_liquidity: {
              assets,
              slippage_tolerance: slippageTolerance,
            },
          },
          funds,
        },
      ];
    } else {
      msgs = [
        ...assets.map((asset) => {
          return {
            //@ts-ignore
            contractAddress: asset.info.token,
            msg: {
              increase_allowance: {
                amount: asset.amount,
                spender: pairContractAddress,
              },
            },
          };
        }),
        {
          contractAddress: pairContractAddress,
          msg: {
            provide_liquidity: {
              assets,
              slippage_tolerance: slippageTolerance,
            },
          },
        },
      ];
    }
    return await this.client.executeMultiple(this.sender, msgs, "auto");
  };
}
