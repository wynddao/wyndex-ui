import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Text } from "@chakra-ui/react";

export const Execute = ({ msg }: { msg: MsgType }) => {
  return (
    <>
      <Text fontSize={"xl"}>Execute</Text>
      <BorderedBox bgImageActive={false}>Contract Address: {msg.contract_addr}</BorderedBox>
      <Text fontSize={"xl"} mt={5}>
        Message:
      </Text>
      <SyntaxHighlighter language="json" style={vscDarkPlus}>
        {msg.msgBeautified}
      </SyntaxHighlighter>
    </>
  );
};
