"use client";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Progress,
  Text,
  Tooltip,
  useClipboard,
  useRadioGroup,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { ExecuteResult } from "cosmwasm";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { BsChevronLeft, BsClipboard } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import { CwProposalSingleHooks, useIndexerInfos, useToast } from "../../../state";
import { Proposal, Status, Vote } from "../../../state/clients/Cw-proposal-single";
import { getMsgType, getResultInText } from "../../../utils/proposals";
import { capitalizeFirstLetter, truncate } from "../../../utils/text";
import ConnectWalletButton from "../../General/Sidebar/ConnectWalletButton";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { Message } from "./Message";
import { VoteRatioSkeleton } from "./Skeletons/VoteRatioSkeleton";
import { VoteRadio } from "./VoteRadio";

const ColoredVote = ({ vote }: { vote: Vote }) => {
  switch (vote) {
    case "yes":
      return (
        <Text display="inline" color={"#9AE6B4"} fontSize={"xl"}>
          YES
        </Text>
      );

    case "no":
      return (
        <Text display="inline" color={"#FEB2B2"} fontSize={"xl"}>
          NO
        </Text>
      );
    default:
      return (
        <Text display="inline" color={"#90cdf4"} fontSize={"xl"}>
          ABSTAIN
        </Text>
      );
  }
};

export const ProposalComponent = ({
  propId,
  proposalResponse,
  votingModuleAddress,
  walletVote,
  refreshData,
  walletStakedPowerAtHeight,
}: {
  propId: number;
  proposalResponse: Proposal;
  votingModuleAddress: string;
  walletVote: Vote | undefined;
  refreshData: () => void;
  walletStakedPowerAtHeight: number;
}) => {
  const { address: walletAddress } = useWallet();
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
  const [loading, setLoading] = useState<boolean>(false);
  const { onCopy } = useClipboard(proposalResponse.proposer);
  const { txToast } = useToast();
  const { refreshUserVotes } = useIndexerInfos({});

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "test",
    onChange: setSelectedVote,
  });

  const castVote = CwProposalSingleHooks.useCastVote({
    contractAddress: votingModuleAddress,
    sender: walletAddress ?? "",
  });

  const doCastVote = async () => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult | undefined> => {
      if (!selectedVote) {
        return;
      }
      const result = await castVote({
        proposalId: propId,
        vote: selectedVote as Vote,
      });

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshData();
      refreshUserVotes();
      return result;
    });
    refreshData();
    setLoading(false);
  };
  const router = useRouter();
  const group = getRootProps();
  return (
    <Box p="4">
      <Box bg="url(/castle.jpeg)" position="relative" rounded="lg" bgPosition="bottom" bgSize="cover">
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
        <Button
          onClick={() => router.push(`/vote`)}
          position="absolute"
          width="200px"
          height="100%"
          top="0"
          bgColor={"transparent"}
          bgGradient={"linear-gradient(90deg, rgba(113,204,152,0.5) 0%, rgba(0,0,0,0) 100%)"}
          _hover={{ bgColor: "transparent" }}
        >
          <BsChevronLeft /> Proposal Overview
        </Button>
      </Box>
      <Grid templateColumns={{ base: "1fr, 1fr", lg: "6fr 2fr" }} mt={4} gap={30}>
        <Box>
          <BorderedBox bgImageActive={false} width="fit-content">
            <Text fontSize={"4xl"}>Description</Text>
            <BorderedBox bgImageActive={false} maxW={{ base: "300px", sm: "440px", md: "500px", lg: "100%" }}>
              <Text sx={{ "& a": { color: "wynd.cyan.500", textDecoration: "underline" } }}>
                <ReactMarkdown components={ChakraUIRenderer()}>{proposalResponse.description}</ReactMarkdown>
              </Text>
            </BorderedBox>
          </BorderedBox>
          <Box mt={4}>
            {proposalResponse.msgs.map((msg, i) => {
              const msgType = getMsgType(msg);
              return (
                <Box key={i} mb={5}>
                  <BorderedBox maxW={{ base: "300px", sm: "440px", md: "500px", lg: "100%" }}>
                    <Message type={msgType} />{" "}
                  </BorderedBox>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box>
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
              <Text fontWeight={"bold"}>Expiration:</Text>
              <Text>
                {/* @ts-ignore */}
                {new Date(proposalResponse.expiration.at_time / 10 ** 6).toLocaleDateString()}{" "}
                {/* @ts-ignore */}
                {new Date(proposalResponse.expiration.at_time / 10 ** 6).toLocaleTimeString()}
              </Text>
            </Grid>
            <Divider mt={5} />
            <Suspense fallback={<VoteRatioSkeleton />}>
              <Box mt={5}>
                <Text fontSize={"2xl"}>Vote Status</Text>
                <Text fontSize={"sm"}>
                  {getResultInText(quorum, totalVoted, votesInPercent, proposalResponse.status)}
                </Text>
                <Text fontSize={"xl"} mt={8}>
                  Ratio of Votes
                </Text>
                <Flex justifyContent={"space-around"} mt={4}>
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
                <Box mx={4} mt={3} position={"relative"}>
                  <Progress
                    variant="multiSegment"
                    min={0}
                    max={100}
                    position="relative"
                    //@ts-ignore
                    values={{
                      green: Number(votesInPercent.yes),
                      blue: Number(votesInPercent.abstain),
                      red: Number(votesInPercent.no),
                    }}
                  />
                  <Tooltip
                    isOpen={true}
                    p={2}
                    hasArrow
                    label="Passing threshold: 51%"
                    bg="wynd.base.sidebar"
                    color="white"
                  >
                    <Box
                      height={5}
                      top={-1}
                      left={"calc(100% * 0.51)"}
                      width={"3px"}
                      bgColor={"white"}
                      position={"absolute"}
                    />
                  </Tooltip>
                </Box>
                <Flex mt={16} justifyContent={"space-between"}>
                  <Text fontSize={"xl"}>Turnout</Text>
                  <Text fontSize={"xl"}>{turnout.toFixed(3)}%</Text>
                </Flex>
                <Box position={"relative"} mb={16}>
                  <Progress mx={4} mt={2} value={totalVoted} max={Number(proposalResponse.total_power)} />
                  <Tooltip
                    isOpen={true}
                    p={2}
                    hasArrow
                    label="Quorum: 30%"
                    bg="wynd.base.sidebar"
                    color="white"
                  >
                    <Box
                      height={5}
                      top={-1}
                      left={"calc(100% * 0.3)"}
                      width={"3px"}
                      bgColor={"white"}
                      position={"absolute"}
                    />
                  </Tooltip>
                </Box>
              </Box>
            </Suspense>
            <Divider my={5} />
            <Text fontSize={"2xl"} mb={4}>
              Vote!
            </Text>
            <BorderedBox>
              <Flex justifyContent={"space-between"} py={2} flexDir={"column"} gap={3} alignItems={"center"}>
                {walletAddress ? (
                  <>
                    {!walletVote &&
                      proposalResponse.status === Status.Open &&
                      walletStakedPowerAtHeight > 0 && (
                        <>
                          <Grid w={"100%"} templateColumns={"1fr 1fr 1fr"} {...group}>
                            {["yes", "abstain", "no"].map((item) => (
                              <VoteRadio w="full" key={item} {...getRadioProps({ value: item })}>
                                {item}
                              </VoteRadio>
                            ))}
                          </Grid>
                          <Button
                            bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
                            _hover={{
                              bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                              ":disabled": {
                                bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                                cursor: "initial",
                              },
                            }}
                            _disabled={{
                              bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                              cursor: "initial",
                            }}
                            onClick={() => doCastVote()}
                            isLoading={loading}
                            borderRadius={"xl"}
                            w={"100%"}
                            disabled={selectedVote === ""}
                          >
                            Vote!
                          </Button>
                        </>
                      )}
                    {walletStakedPowerAtHeight <= 0 && (
                      <Text>{"You had no staked $WYND when the proposal started"}</Text>
                    )}
                    {walletVote && (
                      <Text>
                        You voted <ColoredVote vote={walletVote} />
                      </Text>
                    )}
                    {!walletVote && proposalResponse.status !== Status.Open && (
                      <Text>{"It's not longer possible to vote for this proposal"}</Text>
                    )}
                  </>
                ) : (
                  <ConnectWalletButton />
                )}
              </Flex>
            </BorderedBox>
          </BorderedBox>
        </Box>
      </Grid>
    </Box>
  );
};
