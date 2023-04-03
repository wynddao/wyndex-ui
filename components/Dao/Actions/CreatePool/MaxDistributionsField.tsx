import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const MaxDistributionsField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgMaxDistributions = (maxDistributions: string) => {
    const stakingConfig = msgBeautifiedObj.create_pair_and_distribution_flows.staking_config ?? {};
    stakingConfig.max_distributions = Number(maxDistributions);
    msgBeautifiedObj.create_pair_and_distribution_flows.staking_config = stakingConfig;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [maxDistributions, setMaxDistributions] = useState(
    createPoolMsg.staking_config?.max_distributions
      ? String(createPoolMsg.staking_config.max_distributions)
      : "",
  );

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Maximum distributions:{" "}
      <Input
        onChange={(e) => setMaxDistributions(e.target.value)}
        onBlur={(e) => setMsgMaxDistributions(e.target.value)}
        value={maxDistributions}
        type="number"
      />
    </BorderedBox>
  );
};
