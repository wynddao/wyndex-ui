import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const InitParamsField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgInitParams = (initParams: string) => {
    msgBeautifiedObj.create_pair_and_distribution_flows.init_params = initParams;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [initParams, setInitParams] = useState(createPoolMsg.init_params || "");

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Init params:{" "}
      <Input
        onChange={(e) => setInitParams(e.target.value)}
        onBlur={(e) => setMsgInitParams(e.target.value)}
        value={initParams}
        type="text"
      />
    </BorderedBox>
  );
};
