import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { AssetInfo } from "../../../../state/clients/types/WyndexFactory.types";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

export const TokenBField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgTokenB = (tokenB: string) => {
    const assetInfo: AssetInfo = tokenB.startsWith("juno1") ? { token: tokenB } : { native: tokenB };
    const assetInfos = createPoolMsg.asset_infos?.length ? createPoolMsg.asset_infos : [];
    assetInfos[1] = assetInfo;
    msgBeautifiedObj.create_pair_and_distribution_flows.asset_infos = assetInfos;

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const initTokenB = (() => {
    const assetInfoB = createPoolMsg.asset_infos?.[1];
    let tokenB = "";

    if (assetInfoB) {
      tokenB = "token" in assetInfoB ? assetInfoB.token : assetInfoB.native;
    }

    return tokenB;
  })();

  const [tokenB, setTokenB] = useState(initTokenB);

  return (
    <BorderedBox bgImageActive={false} overflowX={"auto"} w="full">
      Token B:{" "}
      <Input
        onChange={(e) => setTokenB(e.target.value)}
        onBlur={(e) => setMsgTokenB(e.target.value)}
        value={tokenB}
        type="text"
      />
    </BorderedBox>
  );
};
