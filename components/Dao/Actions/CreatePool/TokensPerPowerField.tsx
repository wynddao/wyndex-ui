import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const TokensPerPowerField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgTokensPerPower = (tokensPerPower: string) => {
    const stakingConfig = msgBeautifiedObj.create_pair_and_distribution_flows.staking_config ?? {};
    stakingConfig.tokens_per_power = tokensPerPower;
    msgBeautifiedObj.create_pair_and_distribution_flows.staking_config = stakingConfig;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [tokensPerPower, setTokensPerPower] = useState(createPoolMsg.staking_config?.tokens_per_power || "");

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Tokens per power:{" "}
      <Input
        onChange={(e) => setTokensPerPower(e.target.value)}
        onBlur={(e) => setMsgTokensPerPower(e.target.value)}
        value={tokensPerPower}
        type="text"
      />
    </BorderedBox>
  );
};
