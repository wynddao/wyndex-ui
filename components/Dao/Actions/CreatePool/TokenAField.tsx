import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { AssetInfo } from "../../../../state/clients/types/WyndexFactory.types";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const TokenAField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgTokenA = (tokenA: string) => {
    const assetInfo: AssetInfo = tokenA.startsWith("juno1") ? { token: tokenA } : { native: tokenA };
    const assetInfos = createPoolMsg.asset_infos?.length ? createPoolMsg.asset_infos : [];
    assetInfos[0] = assetInfo;
    msgBeautifiedObj.create_pair_and_distribution_flows.asset_infos = assetInfos;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const initTokenA = (() => {
    const assetInfoA = createPoolMsg.asset_infos?.[0];
    let tokenA = "";

    if (assetInfoA) {
      tokenA = "token" in assetInfoA ? assetInfoA.token : assetInfoA.native;
    }

    return tokenA;
  })();

  const [tokenA, setTokenA] = useState(initTokenA);

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"} w="full">
      Token A:{" "}
      <Input
        onChange={(e) => setTokenA(e.target.value)}
        onBlur={(e) => setMsgTokenA(e.target.value)}
        value={tokenA}
        type="text"
      />
    </BorderedBox>
  );
};
