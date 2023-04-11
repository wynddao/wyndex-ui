"use client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { CosmosMsg_for_Empty } from "../../../state/clients/Cw-proposal-single";
import { simulateProposal } from "../../../utils/proposals";
import { MsgType } from "../Actions/types";
import { Message } from "../Proposal/Message";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";
import { useChain } from "@cosmos-kit/react-lite";
import { CwProposalSingleHooks, useToast } from "../../../state";
import { ExecuteResult } from "cosmwasm";

interface PreviewProps {
  msgs: MsgType[];
  title: string;
  description: string;
}

interface PropOptions {
  description: string;
  msgs: CosmosMsg_for_Empty[];
  title: string;
}

export const Preview = ({ msgs, title, description }: PreviewProps) => {
  const [isTested, setIsTested] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTest, setLoadingTest] = useState<boolean>(false);
  const { address: walletAddress } = useChain("juno");
  const { txToast } = useToast();

  const testMsgsInProp = async () => {
    setLoadingTest(true);
    const res = await simulateProposal(
      WYND_VOTE_MODULE_ADDRESS,
      msgs.map((msg) => msg.rawMsg),
    );
    setTestResults(res);
    if (res.success) {
      setIsTested(true);
    }
    setLoadingTest(false);
  };

  const propose = CwProposalSingleHooks.usePropose({
    contractAddress: WYND_VOTE_MODULE_ADDRESS,
    sender: walletAddress ?? "",
  });

  const doPropose = async (msgs: CosmosMsg_for_Empty[]) => {
    setLoading(true);

    await txToast(async (): Promise<ExecuteResult> => {
      const result = await propose({
        description,
        msgs,
        title,
      });

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      return result;
    });
    setLoading(false);
  };

  const submitProp = async () => {
    const _msgs: CosmosMsg_for_Empty[] = msgs.map((msg) => msg.rawMsg);
    doPropose(_msgs);
  };

  return (
    <Grid templateColumns="1fr 3fr 1fr">
      <GridItem colStart={2} colSpan={1}>
        <Box>
          <Text fontSize="4xl">Title: {title}</Text>
          <BorderedBox bgImageActive={false}>
            <Text fontSize={"4xl"}>Description</Text>
            <BorderedBox bgImageActive={false}>
              <Text>
                <ReactMarkdown components={ChakraUIRenderer()}>{description}</ReactMarkdown>
              </Text>
            </BorderedBox>
          </BorderedBox>
          <Box mt={4}>
            {msgs.map((msg, i) => {
              return (
                <Box key={i} mb={5}>
                  <BorderedBox>
                    <Message type={msg} />{" "}
                  </BorderedBox>
                </Box>
              );
            })}
          </Box>
        </Box>
        {testResults && (
          <Alert my={3} status={testResults.success ? "success" : "error"}>
            <AlertIcon />
            <AlertTitle>{testResults.success ? "Success!" : "Error!"}</AlertTitle>
            <AlertDescription>{testResults.msg}</AlertDescription>
          </Alert>
        )}
        <Flex justifyContent="space-between">
          <Button isLoading={loadingTest} onClick={() => testMsgsInProp()}>Test Proposal</Button>
          {!isTested ? (
            <Tooltip label="You need to test your proposal before submitting">
              <Button disabled>Submit Proposal</Button>
            </Tooltip>
          ) : (
            <Button isLoading={loading} onClick={() => submitProp()}>
              Submit Proposal
            </Button>
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
