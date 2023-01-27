import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Box, Text } from "@chakra-ui/react";

export const Migrate = ({ msg }: { msg: MsgType }) => {
  return (
    <>
      <Text fontSize={"xl"}>Migrate</Text>
      <BorderedBox bgImage={false}>Contract Address: {msg.contract_addr}</BorderedBox>
      <Box mt={4}>
        <BorderedBox>New Code Id: {msg.rawMsg.wasm.migrate.new_code_id}</BorderedBox>
      </Box>
      <Text fontSize={"xl"} mt={5}>
        Message:
      </Text>
      <SyntaxHighlighter language="json" style={vscDarkPlus}>
        {msg.msgBeautified}
      </SyntaxHighlighter>
    </>
  );
};
