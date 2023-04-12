import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const DistributionFlowsField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgDistFlows = (distFlows: string) => {
    try {
      msgBeautifiedObj.create_pair_and_distribution_flows.distribution_flows = JSON.parse(distFlows);
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [distFlows, setDistFlows] = useState(
    createPoolMsg.distribution_flows ? JSON.stringify(createPoolMsg.distribution_flows) : "",
  );

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Distribution flows:{" "}
      <Input
        onChange={(e) => setDistFlows(e.target.value)}
        onBlur={(e) => setMsgDistFlows(e.target.value)}
        value={distFlows}
        type="text"
      />
    </BorderedBox>
  );
};
