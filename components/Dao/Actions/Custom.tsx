"use client";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Text } from "@chakra-ui/react";
import { useState } from "react";

export const Custom = ({ msg, edit = false }: { msg?: MsgType; edit?: boolean }) => {
  const [newMsg, setNewMsg] = useState<string>("{}");
  return (
    <>
      <Text fontSize={"xl"}>Custom</Text>
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
