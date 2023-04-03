import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const UnbondingPeriodsField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgUnbondingPeriods = (unbondingPeriods: string) => {
    const stakingConfig = msgBeautifiedObj.create_pair_and_distribution_flows.staking_config ?? {};

    try {
      stakingConfig.unbonding_periods = JSON.parse(unbondingPeriods);
      msgBeautifiedObj.create_pair_and_distribution_flows.staking_config = stakingConfig;

      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [unbondingPeriods, setUnbondingPeriods] = useState(
    createPoolMsg.staking_config?.unbonding_periods
      ? JSON.stringify(createPoolMsg.staking_config.unbonding_periods, null, 2)
      : "",
  );

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Unbonding periods:{" "}
      <Input
        onChange={(e) => setUnbondingPeriods(e.target.value)}
        onBlur={(e) => setMsgUnbondingPeriods(e.target.value)}
        value={unbondingPeriods}
        type="text"
      />
    </BorderedBox>
  );
};
