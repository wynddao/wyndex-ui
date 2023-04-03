import { Container, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ExecuteMsg } from "../../../../state/clients/types/WyndexFactory.types";
import { BorderedBox } from "../../Stake/MyTokens/BorderedBox";
import { MsgType } from "../types";
import { DistributionFlowsField } from "./DistributionFlowsField";
import { InitParamsField } from "./InitParamsField";
import { MaxDistributionsField } from "./MaxDistributionsField";
import { MinBondField } from "./MinBondField";
import { PairTypeField } from "./PairTypeField";
import { StakingCodeIdField } from "./StakingCodeIdField";
import { TokenAField } from "./TokenAField";
import { TokenBField } from "./TokenBField";
import { TokensPerPowerField } from "./TokensPerPowerField";
import { TotalFeeBpsField } from "./TotalFeeBpsField";
import { UnbondingPeriodsField } from "./UnbondingPeriodsField";

export type CreatePoolMsg = Partial<
  Extract<ExecuteMsg, { create_pair_and_distribution_flows: unknown }>["create_pair_and_distribution_flows"]
>;

export const CreatePool = ({
  msg,
  edit = false,
  setMsg = (msg: MsgType) => {},
}: {
  msg: MsgType;
  edit?: boolean;
  setMsg?: (msg: MsgType) => void;
}) => {
  const createPoolMsg: CreatePoolMsg = JSON.parse(msg.msgBeautified).create_pair_and_distribution_flows ?? {};

  const setMsgContractAddress = (contract_addr: string) => {
    setMsg({ ...msg, contract_addr });
  };

  const [contractAddress, setContractAddress] = useState(msg.contract_addr);

  return (
    <>
      <Text fontSize={"xl"}>Create Pool</Text>
      <Stack>
        <BorderedBox bgImageActive={false} overflowX={"auto"}>
          Contract Address:{" "}
          {edit ? (
            <Input
              onChange={(e) => setContractAddress(e.target.value)}
              onBlur={() => setMsgContractAddress(contractAddress)}
              value={contractAddress}
              type="text"
            />
          ) : (
            msg && msg.contract_addr
          )}
        </BorderedBox>
        {edit ? (
          <>
            <HStack>
              <TokenAField msg={msg} setMsg={setMsg} />
              <TokenBField msg={msg} setMsg={setMsg} />
            </HStack>
            <DistributionFlowsField msg={msg} setMsg={setMsg} />
            <InitParamsField msg={msg} setMsg={setMsg} />
            <HStack>
              <PairTypeField msg={msg} setMsg={setMsg} />
            </HStack>
            <MaxDistributionsField msg={msg} setMsg={setMsg} />
            <MinBondField msg={msg} setMsg={setMsg} />
            <StakingCodeIdField msg={msg} setMsg={setMsg} />
            <TokensPerPowerField msg={msg} setMsg={setMsg} />
            <UnbondingPeriodsField msg={msg} setMsg={setMsg} />
            <TotalFeeBpsField msg={msg} setMsg={setMsg} />
          </>
        ) : null}
      </Stack>
      <Text fontSize={"xl"} mt={5}>
        Message:
      </Text>
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
    </>
  );
};
