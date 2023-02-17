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
import { getMsgType, simulateProposal } from "../../../utils/proposals";
import { MsgType } from "../Actions/types";
import { Message } from "../Proposal/Message";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";

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
  const createProposalAndSubmit = () => {
    const props: PropOptions = {
      description: description,
      title: title,
      msgs: msgs.map((msg) => msg.rawMsg),
    };
  };

  const testMsgsInProp = async () => {
    console.log(msgs.map((msg) => msg.rawMsg))
    const res = await simulateProposal(
      WYND_VOTE_MODULE_ADDRESS,
      msgs.map((msg) => msg.rawMsg),
    );
    setTestResults(res);
    if (res.success) {
      setIsTested(true);
    }
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
          <Button onClick={() => testMsgsInProp()}>Test Proposal</Button>
          {!isTested ? (
            <Tooltip label="You need to test your proposal before submitting">
              <Button disabled>Submit Proposal</Button>
            </Tooltip>
          ) : (
            <Button onClick={() => createProposalAndSubmit()}>Submit Proposal</Button>
          )}
        </Flex>
      </GridItem>
    </Grid>
  );
};
