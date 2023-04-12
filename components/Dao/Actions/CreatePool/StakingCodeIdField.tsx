import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const StakingCodeIdField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgStakingCodeId = (stakingCodeId: string) => {
    const stakingConfig = msgBeautifiedObj.create_pair_and_distribution_flows.staking_config ?? {};
    stakingConfig.staking_code_id = Number(stakingCodeId);
    msgBeautifiedObj.create_pair_and_distribution_flows.staking_config = stakingConfig;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [stakingCodeId, setStakingCodeId] = useState(
    createPoolMsg.staking_config?.staking_code_id ? String(createPoolMsg.staking_config.staking_code_id) : "",
  );

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Staking Code ID:{" "}
      <Input
        onChange={(e) => setStakingCodeId(e.target.value)}
        onBlur={(e) => setMsgStakingCodeId(e.target.value)}
        value={stakingCodeId}
        type="number"
      />
    </BorderedBox>
  );
};
