/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.16.1.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { Coin, StdFee } from "@cosmjs/amino";
import { CosmWasmClient, ExecuteResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import {
  AllAccountsResponse,
  AllAllowancesResponse,
  AllowanceResponse,
  BalanceResponse,
  Binary,
  Curve,
  DelegatedResponse,
  DownloadLogoResponse,
  Expiration,
  MarketingInfoResponse,
  MaxVestingComplexityResponse,
  MinterResponse,
  StakingAddressResponse,
  TokenInfoResponse,
  Uint128,
  VestingAllowListResponse,
  VestingResponse,
} from "./types/Cw20Vesting.types";
export interface Cw20VestingReadOnlyInterface {
  contractAddress: string;
  balance: ({ address }: { address: string }) => Promise<BalanceResponse>;
  vesting: ({ address }: { address: string }) => Promise<VestingResponse>;
  delegated: ({ address }: { address: string }) => Promise<DelegatedResponse>;
  vestingAllowList: () => Promise<VestingAllowListResponse>;
  tokenInfo: () => Promise<TokenInfoResponse>;
  maxVestingComplexity: () => Promise<MaxVestingComplexityResponse>;
  minter: () => Promise<MinterResponse>;
  allowance: ({ owner, spender }: { owner: string; spender: string }) => Promise<AllowanceResponse>;
  allAllowances: ({
    limit,
    owner,
    startAfter,
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }) => Promise<AllAllowancesResponse>;
  allAccounts: ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  }) => Promise<AllAccountsResponse>;
  marketingInfo: () => Promise<MarketingInfoResponse>;
  downloadLogo: () => Promise<DownloadLogoResponse>;
  stakingAddress: () => Promise<StakingAddressResponse>;
}
export class Cw20VestingQueryClient implements Cw20VestingReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.balance = this.balance.bind(this);
    this.vesting = this.vesting.bind(this);
    this.delegated = this.delegated.bind(this);
    this.vestingAllowList = this.vestingAllowList.bind(this);
    this.tokenInfo = this.tokenInfo.bind(this);
    this.maxVestingComplexity = this.maxVestingComplexity.bind(this);
    this.minter = this.minter.bind(this);
    this.allowance = this.allowance.bind(this);
    this.allAllowances = this.allAllowances.bind(this);
    this.allAccounts = this.allAccounts.bind(this);
    this.marketingInfo = this.marketingInfo.bind(this);
    this.downloadLogo = this.downloadLogo.bind(this);
    this.stakingAddress = this.stakingAddress.bind(this);
  }

  balance = async ({ address }: { address: string }): Promise<BalanceResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      balance: {
        address,
      },
    });
  };
  vesting = async ({ address }: { address: string }): Promise<VestingResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      vesting: {
        address,
      },
    });
  };
  delegated = async ({ address }: { address: string }): Promise<DelegatedResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      delegated: {
        address,
      },
    });
  };
  vestingAllowList = async (): Promise<VestingAllowListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      vesting_allow_list: {},
    });
  };
  tokenInfo = async (): Promise<TokenInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      token_info: {},
    });
  };
  maxVestingComplexity = async (): Promise<MaxVestingComplexityResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      max_vesting_complexity: {},
    });
  };
  minter = async (): Promise<MinterResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      minter: {},
    });
  };
  allowance = async ({ owner, spender }: { owner: string; spender: string }): Promise<AllowanceResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      allowance: {
        owner,
        spender,
      },
    });
  };
  allAllowances = async ({
    limit,
    owner,
    startAfter,
  }: {
    limit?: number;
    owner: string;
    startAfter?: string;
  }): Promise<AllAllowancesResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_allowances: {
        limit,
        owner,
        start_after: startAfter,
      },
    });
  };
  allAccounts = async ({
    limit,
    startAfter,
  }: {
    limit?: number;
    startAfter?: string;
  }): Promise<AllAccountsResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      all_accounts: {
        limit,
        start_after: startAfter,
      },
    });
  };
  marketingInfo = async (): Promise<MarketingInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      marketing_info: {},
    });
  };
  downloadLogo = async (): Promise<DownloadLogoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      download_logo: {},
    });
  };
  stakingAddress = async (): Promise<StakingAddressResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      staking_address: {},
    });
  };
}
export interface Cw20VestingInterface extends Cw20VestingReadOnlyInterface {
  contractAddress: string;
  sender: string;
  transfer: (
    {
      amount,
      recipient,
    }: {
      amount: Uint128;
      recipient: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  transferVesting: (
    {
      amount,
      recipient,
      schedule,
    }: {
      amount: Uint128;
      recipient: string;
      schedule: Curve;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  burn: (
    {
      amount,
    }: {
      amount: Uint128;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  send: (
    {
      amount,
      contract,
      msg,
    }: {
      amount: Uint128;
      contract: string;
      msg: Binary;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  increaseAllowance: (
    {
      amount,
      expires,
      spender,
    }: {
      amount: Uint128;
      expires?: Expiration;
      spender: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  decreaseAllowance: (
    {
      amount,
      expires,
      spender,
    }: {
      amount: Uint128;
      expires?: Expiration;
      spender: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  transferFrom: (
    {
      amount,
      owner,
      recipient,
    }: {
      amount: Uint128;
      owner: string;
      recipient: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  sendFrom: (
    {
      amount,
      contract,
      msg,
      owner,
    }: {
      amount: Uint128;
      contract: string;
      msg: Binary;
      owner: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  burnFrom: (
    {
      amount,
      owner,
    }: {
      amount: Uint128;
      owner: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  mint: (
    {
      amount,
      recipient,
    }: {
      amount: Uint128;
      recipient: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  updateMinter: (
    {
      minter,
    }: {
      minter: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  updateMarketing: (
    {
      description,
      marketing,
      project,
    }: {
      description?: string;
      marketing?: string;
      project?: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  uploadLogo: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  allowVester: (
    {
      address,
    }: {
      address: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  denyVester: (
    {
      address,
    }: {
      address: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  updateStakingAddress: (
    {
      address,
    }: {
      address: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  delegate: (
    {
      amount,
      msg,
    }: {
      amount: Uint128;
      msg: Binary;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
  undelegate: (
    {
      amount,
      recipient,
    }: {
      amount: Uint128;
      recipient: string;
    },
    fee?: number | StdFee | "auto",
    memo?: string,
    funds?: Coin[],
  ) => Promise<ExecuteResult>;
}
export class Cw20VestingClient extends Cw20VestingQueryClient implements Cw20VestingInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.transfer = this.transfer.bind(this);
    this.transferVesting = this.transferVesting.bind(this);
    this.burn = this.burn.bind(this);
    this.send = this.send.bind(this);
    this.increaseAllowance = this.increaseAllowance.bind(this);
    this.decreaseAllowance = this.decreaseAllowance.bind(this);
    this.transferFrom = this.transferFrom.bind(this);
    this.sendFrom = this.sendFrom.bind(this);
    this.burnFrom = this.burnFrom.bind(this);
    this.mint = this.mint.bind(this);
    this.updateMinter = this.updateMinter.bind(this);
    this.updateMarketing = this.updateMarketing.bind(this);
    this.uploadLogo = this.uploadLogo.bind(this);
    this.allowVester = this.allowVester.bind(this);
    this.denyVester = this.denyVester.bind(this);
    this.updateStakingAddress = this.updateStakingAddress.bind(this);
    this.delegate = this.delegate.bind(this);
    this.undelegate = this.undelegate.bind(this);
  }

  transfer = async (
    {
      amount,
      recipient,
    }: {
      amount: Uint128;
      recipient: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        transfer: {
          amount,
          recipient,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  transferVesting = async (
    {
      amount,
      recipient,
      schedule,
    }: {
      amount: Uint128;
      recipient: string;
      schedule: Curve;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        transfer_vesting: {
          amount,
          recipient,
          schedule,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  burn = async (
    {
      amount,
    }: {
      amount: Uint128;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        burn: {
          amount,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  send = async (
    {
      amount,
      contract,
      msg,
    }: {
      amount: Uint128;
      contract: string;
      msg: Binary;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        send: {
          amount,
          contract,
          msg,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  increaseAllowance = async (
    {
      amount,
      expires,
      spender,
    }: {
      amount: Uint128;
      expires?: Expiration;
      spender: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        increase_allowance: {
          amount,
          expires,
          spender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  decreaseAllowance = async (
    {
      amount,
      expires,
      spender,
    }: {
      amount: Uint128;
      expires?: Expiration;
      spender: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        decrease_allowance: {
          amount,
          expires,
          spender,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  transferFrom = async (
    {
      amount,
      owner,
      recipient,
    }: {
      amount: Uint128;
      owner: string;
      recipient: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        transfer_from: {
          amount,
          owner,
          recipient,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  sendFrom = async (
    {
      amount,
      contract,
      msg,
      owner,
    }: {
      amount: Uint128;
      contract: string;
      msg: Binary;
      owner: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        send_from: {
          amount,
          contract,
          msg,
          owner,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  burnFrom = async (
    {
      amount,
      owner,
    }: {
      amount: Uint128;
      owner: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        burn_from: {
          amount,
          owner,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  mint = async (
    {
      amount,
      recipient,
    }: {
      amount: Uint128;
      recipient: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        mint: {
          amount,
          recipient,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  updateMinter = async (
    {
      minter,
    }: {
      minter: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_minter: {
          minter,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  updateMarketing = async (
    {
      description,
      marketing,
      project,
    }: {
      description?: string;
      marketing?: string;
      project?: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_marketing: {
          description,
          marketing,
          project,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  uploadLogo = async (
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        upload_logo: {},
      },
      fee,
      memo,
      funds,
    );
  };
  allowVester = async (
    {
      address,
    }: {
      address: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        allow_vester: {
          address,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  denyVester = async (
    {
      address,
    }: {
      address: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        deny_vester: {
          address,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  updateStakingAddress = async (
    {
      address,
    }: {
      address: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        update_staking_address: {
          address,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  delegate = async (
    {
      amount,
      msg,
    }: {
      amount: Uint128;
      msg: Binary;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        delegate: {
          amount,
          msg,
        },
      },
      fee,
      memo,
      funds,
    );
  };
  undelegate = async (
    {
      amount,
      recipient,
    }: {
      amount: Uint128;
      recipient: string;
    },
    fee: number | StdFee | "auto" = "auto",
    memo?: string,
    funds?: Coin[],
  ): Promise<ExecuteResult> => {
    return await this.client.execute(
      this.sender,
      this.contractAddress,
      {
        undelegate: {
          amount,
          recipient,
        },
      },
      fee,
      memo,
      funds,
    );
  };
}