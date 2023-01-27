import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Progress,
  Text,
  useClipboard,
  useRadioGroup,
} from "@chakra-ui/react";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Proposal } from "../../../state/clients/Cw-proposal-single";
import { getMsgType } from "../../../utils/proposals";
import { Message } from "./Message";
import { VoteRadio } from "./VoteRadio";
import { useState } from "react";
import { truncate, capitalizeFirstLetter } from "../../../utils/text";
import { BsClipboard } from "react-icons/bs";

export const ProposalComponent = ({
  propId,
  proposalResponse,
}: {
  propId: number;
  proposalResponse: Proposal;
}) => {
  console.log(proposalResponse);
  const totalVoted =
    Number(proposalResponse.votes.yes) +
    Number(proposalResponse.votes.no) +
    Number(proposalResponse.votes.abstain);
  const turnout = (100 / Number(proposalResponse.total_power)) * totalVoted;
  const votesInPercent = {
    yes: (100 / totalVoted) * Number(proposalResponse.votes.yes),
    abstain: (100 / totalVoted) * Number(proposalResponse.votes.abstain),
    no: (100 / totalVoted) * Number(proposalResponse.votes.no),
  };
  const quorum = 0.3 * Number(proposalResponse.total_power);

  const [selectedVote, setSelectedVote] = useState<string>("");
  const { onCopy } = useClipboard(proposalResponse.proposer);

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "test",
    onChange: setSelectedVote,
  });
  const group = getRootProps();
  return (
    <Box p="4">
      <Box bg="url(/castle.jpeg)" rounded="lg" bgPosition="bottom" bgSize="cover">
        <Box bg="rgba(16, 11, 22,0.8)" w="full" h="full">
          <Flex
            gap={6}
            px={8}
            py={4}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Heading
              bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
              bgClip="text"
              display="inline"
              fontSize={{ base: "3xl", md: "6xl" }}
              pt="8"
            >
              # {propId}
            </Heading>
            <Text fontSize={{ base: "2xl", md: "2xl" }} fontWeight="bold">
              {proposalResponse.title}
            </Text>
          </Flex>
        </Box>
      </Box>
      <Grid templateColumns="6fr 2fr" mt={4} gap={30}>
        <Box>
          <BorderedBox bgImage={false}>
            <Text>
              <ReactMarkdown components={ChakraUIRenderer()}>{proposalResponse.description}</ReactMarkdown>
            </Text>
          </BorderedBox>
          <Box mt={4}>
            {proposalResponse.msgs.map((msg, i) => {
              const msgType = getMsgType(msg);
              return (
                <Box key={i} mb={5}>
                  <BorderedBox>
                    <Message type={msgType} />{" "}
                  </BorderedBox>
                </Box>
              );
            })}
          </Box>
        </Box>
        <BorderedBox>
          <Text fontSize={"2xl"}>Proposal Information</Text>
          <Grid columnGap={4} templateColumns="repeat(2, 1fr)">
            <Text fontWeight={"bold"}>Proposal:</Text>
            <Text>{propId}</Text>
            <Text fontWeight={"bold"}>Status:</Text>
            <Text>{capitalizeFirstLetter(proposalResponse.status)}</Text>
            <Text fontWeight={"bold"}>Proposer:</Text>
            <Flex
              onClick={() => onCopy()}
              alignItems={"center"}
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              <Text>{truncate(proposalResponse.proposer, 10)}</Text>
              <BsClipboard style={{ marginLeft: 8 }} />
            </Flex>
          </Grid>
          <Divider mt={5} />
          <Box mt={5}>
            <Text fontSize={"2xl"}>Vote Status</Text>
            <Text fontSize={"sm"}>
              If the current vote stands, this proposal will fail due to a lack of voter participation.
            </Text>
            <Text fontSize={"xl"} mt={3}>
              Ratio of Votes
            </Text>
            <Flex justifyContent={"space-around"} mt={2}>
              <Text color={"#9AE6B4"} fontSize={"small"}>
                {votesInPercent.yes.toFixed(2)}% Yes
              </Text>
              <Text color={"#90cdf4"} fontSize={"small"}>
                {votesInPercent.abstain.toFixed(2)}% Abstain
              </Text>
              <Text color={"#FEB2B2"} fontSize={"small"}>
                {votesInPercent.no.toFixed(2)}% No
              </Text>
            </Flex>
            <Progress
              variant="multiSegment"
              mx={4}
              min={0}
              max={100}
              //@ts-ignore
              values={{
                green: Number(votesInPercent.yes),
                blue: Number(votesInPercent.abstain),
                red: Number(votesInPercent.no),
              }}
            />
            <Flex mt={3} justifyContent={"space-between"}>
              <Text fontSize={"xl"}>Turnout</Text>
              <Text fontSize={"xl"}>{turnout.toFixed(3)}%</Text>
            </Flex>
            <Progress mx={4} mt={2} value={totalVoted} max={Number(proposalResponse.total_power)} />
          </Box>
          <Divider my={5} />
          <Box>
            <Text fontSize={"2xl"}>Vote!</Text>
            <Flex justifyContent={"space-between"} mt={2} flexDir={"column"} gap={3} alignItems={"center"}>
              <HStack {...group}>
                {["yes", "no", "abstain"].map((item) => (
                  <VoteRadio key={item} {...getRadioProps({ value: item })}>
                    {item}
                  </VoteRadio>
                ))}
              </HStack>
              <Button disabled={selectedVote === ""}>Vote!</Button>
            </Flex>
          </Box>
        </BorderedBox>
      </Grid>
    </Box>
  );
};
