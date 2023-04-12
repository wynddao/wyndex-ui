import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const MinBondField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgMinBond = (minBond: string) => {
    const stakingConfig = msgBeautifiedObj.create_pair_and_distribution_flows.staking_config ?? {};
    stakingConfig.min_bond = minBond;
    msgBeautifiedObj.create_pair_and_distribution_flows.staking_config = stakingConfig;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [minBond, setMinBond] = useState(createPoolMsg.staking_config?.min_bond || "");

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Minimum bond:{" "}
      <Input
        onChange={(e) => setMinBond(e.target.value)}
        onBlur={(e) => setMsgMinBond(e.target.value)}
        value={minBond}
        type="text"
      />
    </BorderedBox>
  );
};
