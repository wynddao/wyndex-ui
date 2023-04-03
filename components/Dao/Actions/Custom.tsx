import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "i18next-ssg";

export const Custom = ({ msg, edit = false }: { msg?: MsgType; edit?: boolean }) => {
  const [newMsg, setNewMsg] = useState<string>("{}");
  const { t } = useTranslation("common");
  return (
    <>
      <Text fontSize={"xl"}>{t("general.custom")}</Text>
      <Text fontSize={"xl"} mt={5}>
        {t("general.message")}
        {":"}
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
