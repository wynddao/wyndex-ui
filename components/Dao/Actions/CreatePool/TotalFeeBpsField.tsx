import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const TotalFeeBpsField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgTotalFeeBps = (totalFeeBps: string) => {
    msgBeautifiedObj.create_pair_and_distribution_flows.total_fee_bps = Number(totalFeeBps);

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const [totalFeeBps, setTotalFeeBps] = useState(
    createPoolMsg.total_fee_bps ? String(createPoolMsg.total_fee_bps) : "",
  );

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"}>
      Total Fee BPS:{" "}
      <Input
        onChange={(e) => setTotalFeeBps(e.target.value)}
        onBlur={(e) => setMsgTotalFeeBps(e.target.value)}
        value={totalFeeBps}
        type="number"
      />
    </BorderedBox>
  );
};
