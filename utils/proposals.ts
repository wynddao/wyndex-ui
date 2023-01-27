import { MsgType } from "../components/Dao/Actions/types";

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
