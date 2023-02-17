import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSignResponse } from "@cosmjs/proto-signing";
import { AccountData, GasPrice, OfflineDirectSigner, toUtf8 } from "cosmwasm";
import { MsgType } from "../components/Dao/Actions/types";
import { CosmosMsg_for_Empty, Status } from "../state/clients/Cw-proposal-single";
import { WYND_VOTE_MODULE_ADDRESS, CHAIN_RPC_ENDPOINT, DAO_ADDRESS } from "./constants";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";

export const getMsgType = (msg: Record<string, any>): MsgType => {
  let type = "unknown";
  if (msg.wasm.hasOwnProperty("execute")) {
    type = "execute";
  } else if (msg.wasm.hasOwnProperty("migrate")) {
    type = "migrate";
  }

  if (type !== "unknown") {
    const decodedMsg = Buffer.from(msg.wasm[type].msg, "base64").toString();
    return {
      type: type,
      msg: decodedMsg,
      msgBeautified: JSON.stringify(JSON.parse(decodedMsg), null, 4),
      contract_addr: msg.wasm[type].contract_addr,
      rawMsg: msg,
    };
  } else {
    return {
      type: type,
      msg: "",
      msgBeautified: "",
      contract_addr: "",
      rawMsg: msg,
    };
  }
};

export const getResultInText = (quorum: number, totalVotes: number, votes: any, status: Status) => {
  const thresholdReached = votes.yes >= votes.no + votes.abstain;
  const quorumMet = quorum <= totalVotes;

  return status === Status.Open
    ? thresholdReached && quorumMet
      ? "If the current vote stands, this proposal will pass."
      : !thresholdReached && quorumMet
      ? "If the current vote stands, this proposal will fail because insufficient 'Yes' votes have been cast."
      : thresholdReached && !quorumMet
      ? "If the current vote stands, this proposal will fail due to a lack of voter participation."
      : undefined
    : undefined;
};

export const simulateProposal = async (sender: string, proposal: CosmosMsg_for_Empty[]): Promise<any> => {
  try {
    const gasPrice = GasPrice.fromString("0.01ujuno");
    const feeToken = "ujuno";

    // Setup signer
    const signer = new FakeDAOWallet(WYND_VOTE_MODULE_ADDRESS);

    // Init SigningCosmWasmClient client
    const client = await SigningCosmWasmClient.connectWithSigner(CHAIN_RPC_ENDPOINT, signer, {
      prefix: "juno",
      // @ts-ignore
      gasPrice,
    });

    console.log(`Testing if valid proposal:`);

    const simMsg = {
      execute_proposal_hook: {
        msgs: proposal,
      },
    };

    const msg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: WYND_VOTE_MODULE_ADDRESS,
        contract: DAO_ADDRESS,
        msg: toUtf8(JSON.stringify(simMsg)),
        funds: [],
      }),
    };

    const gasUsed = await client.simulate(WYND_VOTE_MODULE_ADDRESS, [msg], "");

    return {
      success: true,
      msg: `Expected Gas Needed: ${gasUsed}`,
    };
  } catch (e: any) {
    return {
      success: false,
      msg: e.toString(),
    };
  }
};

class FakeDAOWallet implements OfflineDirectSigner {
  protected address: string;

  constructor(address: string) {
    this.address = address;
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        address: this.address,
        algo: "secp256k1",
        pubkey: new Uint8Array([
          2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
          27, 28, 29, 30, 31, 32,
        ]),
      },
    ];
  }

  async signDirect(signerAddress: string, signDoc: any): Promise<DirectSignResponse> {
    throw new Error("signDirect not implemented");
  }
}
