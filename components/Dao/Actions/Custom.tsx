import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Text } from "@chakra-ui/react";

export const Custom = ({ msg }: { msg: MsgType }) => {
  return (
    <>
      <Text fontSize={"xl"}>Custom</Text>
      <BorderedBox bgImage={false}>Contract Address: {msg.contract_addr}</BorderedBox>
      <Text fontSize={"xl"} mt={5}>
        Message:
      </Text>
      <SyntaxHighlighter language="json" style={vscDarkPlus}>
        {JSON.stringify(msg.rawMsg)}
      </SyntaxHighlighter>
    </>
  );
};
