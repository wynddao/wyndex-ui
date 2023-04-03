import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { MsgType } from "./types";
import { Container, Input, Text } from "@chakra-ui/react";
import { FocusEvent, useState } from "react";
import { useTranslation } from "i18next-ssg";

export const Execute = ({
  msg,
  edit = false,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  edit?: boolean;
  setMsg?: (msg: MsgType) => void;
}) => {
  const setMsgBeautified = (e: FocusEvent<HTMLParagraphElement, Element>) => {
    setMsg({ ...msg, msgBeautified: e.currentTarget.textContent || "{}" });
  };

  const setContractAddress = (contract_addr: string) => {
    setMsg({ ...msg, contract_addr });
  };
  const { t } = useTranslation("common");

  const [contractAddr, setContractAddr] = useState<string>(msg.contract_addr);
  return (
    <>
      <Text fontSize={"xl"}>{t("actions.execute")}</Text>
      <BorderedBox bgImageActive={false} overflowX={"auto"}>
        {t("general.contractAddress")}
        {": "}
        {edit ? (
          <Input
            onChange={(e) => setContractAddr(e.target.value)}
            onBlur={() => setContractAddress(contractAddr)}
            value={contractAddr}
            type="text"
          />
        ) : (
          msg && msg.contract_addr
        )}
      </BorderedBox>
      <Text fontSize={"xl"} mt={5}>
        {t("general.message")}
        {":"}
      </Text>
      {!edit ? (
        <Container maxW="container.md">
          <SyntaxHighlighter
            customStyle={{ maxWidth: "100%" }}
            wrapLongLines={true}
            wrapLines={true}
            language="json"
            style={vscDarkPlus}
          >
            {msg.msgBeautified}
          </SyntaxHighlighter>
        </Container>
      ) : (
        <p contentEditable={true} onBlur={(e) => setMsgBeautified(e)}>
          <SyntaxHighlighter language="json" style={vscDarkPlus}>
            {msg.msgBeautified}
          </SyntaxHighlighter>
        </p>
      )}
    </>
  );
};
