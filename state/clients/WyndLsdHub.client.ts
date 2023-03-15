import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import {
  Decimal,
  Uint128,
  Binary,
  ClaimsResponse,
  ConfigResponse,
  ExchangeRateResponse,
  ReinvestResponse,
  SupplyResponse,
  TargetValueResponse,
  ValidatorSetResponse,
} from "./types/WyndLsdHub.types";
export interface WyndLsdHubReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
  claims: ({ address }: { address: string }) => Promise<ClaimsResponse>;
  validatorSet: () => Promise<ValidatorSetResponse>;
  lastReinvest: () => Promise<ReinvestResponse>;
  supply: () => Promise<SupplyResponse>;
  exchangeRate: () => Promise<ExchangeRateResponse>;
  targetValue: () => Promise<TargetValueResponse>;
}
export class WyndLsdHubQueryClient implements WyndLsdHubReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.claims = this.claims.bind(this);
    this.validatorSet = this.validatorSet.bind(this);
    this.lastReinvest = this.lastReinvest.bind(this);
    this.supply = this.supply.bind(this);
    // amount of juno I get for wyJUNO
    this.exchangeRate = this.exchangeRate.bind(this);
    this.targetValue = this.targetValue.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {},
    });
  };
  claims = async ({ address }: { address: string }): Promise<ClaimsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      claims: {
        address,
      },
    });
  };
  validatorSet = async (): Promise<ValidatorSetResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      validator_set: {},
    });
  };
  lastReinvest = async (): Promise<ReinvestResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      last_reinvest: {},
    });
  };
  supply = async (): Promise<SupplyResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      supply: {},
    });
  };
  exchangeRate = async (): Promise<ExchangeRateResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      exchange_rate: {},
    });
  };
  targetValue = async (): Promise<TargetValueResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      target_value: {},
    });
  };
}
export interface WyndLsdHubInterface extends WyndLsdHubReadOnlyInterface {
  contractAddress: string;
  sender: string;
  receive: (
    {
      amount,
      msg,
      sender,
    }: {
      amount: Uint128;
      msg: Binary;
      sender: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  bond: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  claim: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  reinvest: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  setValidators: (
    {
      newValidators,
    }: {
      newValidators: string[][];
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  updateLiquidityDiscount: (
    {
      newDiscount,
    }: {
      newDiscount: Decimal;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class WyndLsdHubClient extends WyndLsdHubQueryClient implements WyndLsdHubInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.receive = this.receive.bind(this);
    this.bond = this.bond.bind(this);
    this.claim = this.claim.bind(this);
    this.reinvest = this.reinvest.bind(this);
    this.setValidators = this.setValidators.bind(this);
    this.updateLiquidityDiscount = this.updateLiquidityDiscount.bind(this);
  }

  receive = async (
    {
      amount,
      msg,
      sender,
    }: {
      amount: Uint128;
      msg: Binary;
      sender: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        receive: {
          amount,
          msg,
          sender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  bond = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        bond: {},
      },
      fee,
      memo,
      funds,
    );
  };
  claim = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        claim: {},
      },
      fee,
      memo,
      funds,
    );
  };
  reinvest = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        reinvest: {},
      },
      fee,
      memo,
      funds,
    );
  };
  setValidators = async (
    {
      newValidators,
    }: {
      newValidators: string[][];
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        set_validators: {
          new_validators: newValidators,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  updateLiquidityDiscount = async (
    {
      newDiscount,
    }: {
      newDiscount: Decimal;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_liquidity_discount: {
          new_discount: newDiscount,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}
