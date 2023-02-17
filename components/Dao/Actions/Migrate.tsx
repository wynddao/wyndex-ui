import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Box, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

export const Migrate = ({
  msg,
  edit = false,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  edit?: boolean;
  setMsg?: (msg: MsgType) => void;
}) => {
  const [newMsg, setNewMsg] = useState<string>("{}");
  const setContractAddress = (contract_addr: string) => {
    setMsg({ ...msg, contract_addr });
  };

  const setNewCodeId = (new_code_id: string) => {
    setMsg({ ...msg, new_code_id });
  };

  const [contractAddr, setContractAddr] = useState<string>(msg.contract_addr);
  const [codeId, setCodeId] = useState<string>(msg.new_code_id || "");

  return (
    <>
      <Text fontSize={"xl"}>Migrate</Text>
      <BorderedBox bgImageActive={false}>
        Contract Address:{" "}
        {edit ? (
          <Input
            type="text"
            onChange={(e) => setContractAddr(e.target.value)}
            onBlur={() => setContractAddress(contractAddr)}
            value={contractAddr}
          />
        ) : (
          msg && msg.contract_addr
        )}
      </BorderedBox>
      <Box mt={4}>
        <BorderedBox>
          New Code Id:{" "}
          {edit ? (
            <Input
              type="text"
              onChange={(e) => setCodeId(e.target.value)}
              onBlur={() => setNewCodeId(codeId)}
              value={codeId}
            />
          ) : (
            (msg && msg.rawMsg.wasm?.migrate.new_code_id) || ""
          )}
        </BorderedBox>
      </Box>
      <Text fontSize={"xl"} mt={5}>
        Message:
      </Text>
      {msg ? (
        <SyntaxHighlighter language="json" style={vscDarkPlus}>
          {msg.msgBeautified}
        </SyntaxHighlighter>
      ) : (
        <p contentEditable={true} onInput={(e) => setNewMsg(e.currentTarget.textContent || "{}")}>
          {/* eslint-disable-next-line react/no-children-prop */}
          <SyntaxHighlighter language="json" style={vscDarkPlus} children={newMsg} />
        </p>
      )}
    </>
  );
};
