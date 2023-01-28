import { MsgType } from "../components/Dao/Actions/types";
import { Status } from "../state/clients/Cw-proposal-single";

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
