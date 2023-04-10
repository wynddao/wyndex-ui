import { Input } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useState } from "react";
import { CreatePoolMsg } from ".";
import { PairType } from "../../../../state/clients/types/WyndexFactory.types";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";

type PairTypeUnion = "xyk" | "stable" | "custom";

function getPairTypeObj(pairType: PairTypeUnion, customTypeValue?: string): PairType {
  switch (pairType) {
    case "xyk":
      return { xyk: {} };
    case "stable":
      return { stable: {} };
    case "custom":
      return { custom: customTypeValue || "" };
    default:
      throw new Error("Unsupported PairType");
  }
}

export const PairTypeField = ({
  msg,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};
  const msgBeautifiedObj = { create_pair_and_distribution_flows: { ...createPoolMsg } };

  const setMsgPairType = (pairType: PairTypeUnion) => {
    const currentPairType = msgBeautifiedObj.create_pair_and_distribution_flows.pair_type;
    const currentCustomTypeValue =
      currentPairType && "custom" in currentPairType ? currentPairType.custom : undefined;

    msgBeautifiedObj.create_pair_and_distribution_flows.pair_type = getPairTypeObj(
      pairType,
      currentCustomTypeValue,
    );

    try {
      setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
    } catch {}
  };

  const setMsgCustomTypeValue = (customTypeValue: string) => {
    if (
      msgBeautifiedObj.create_pair_and_distribution_flows.pair_type &&
      "custom" in msgBeautifiedObj.create_pair_and_distribution_flows.pair_type
    ) {
      msgBeautifiedObj.create_pair_and_distribution_flows.pair_type.custom = customTypeValue;

      try {
        setMsg({ ...msg, msgBeautified: JSON.stringify(msgBeautifiedObj, null, 4) });
      } catch {}
    }
  };

  const [initPairType, initCustomTypeValue] = ((): [PairTypeUnion, string] => {
    if (!createPoolMsg.pair_type) {
      return ["custom", ""];
    }

    if ("custom" in createPoolMsg.pair_type) {
      return ["custom", createPoolMsg.pair_type.custom];
    }

    return [Object.keys(createPoolMsg.pair_type)[0] as PairTypeUnion, ""];
  })();

  const [pairType, setPairType] = useState(initPairType);
  const [customTypeValue, setCustomTypeValue] = useState(initCustomTypeValue);

  return (
    <>
      <Select
        options={[
          { value: "xyk", label: "XYK" },
          { value: "stable", label: "Stable" },
          { value: "custom", label: "Custom" },
        ]}
        onChange={(e) => {
          const value = (e?.value as PairTypeUnion) || ("custom" as PairTypeUnion);
          setPairType(value);
          setMsgPairType(value);
        }}
      />
      <BorderedBox bgImageActive={false} overflowX={"auto"} w="full">
        Custom pair type value:{" "}
        <Input
          onChange={(e) => setCustomTypeValue(e.target.value)}
          onBlur={(e) => setMsgCustomTypeValue(e.target.value)}
          value={customTypeValue}
          type="text"
          disabled={pairType !== "custom"}
        />
      </BorderedBox>
    </>
  );
};
