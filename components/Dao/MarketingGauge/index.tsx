"use client";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { ExecuteResult } from "cosmwasm";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { GaugesHooks, useToast } from "../../../state";
import { GaugeResponse, Vote } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { useUserVotes } from "../../../state/hooks/gauge/useUserVotes";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import AssetImage from "../../Dex/AssetImage";
import ConnectWalletButton from "../../General/Sidebar/ConnectWalletButton";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeHeader } from "./GaugeHeader";
import { mock, MarketingGaugeMock } from "./mock.json";
import VoteSelector from "./VoteSelector";

export interface OptionsWithInfos {
  address: string;
  currentVotePower: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface BallotEntry {
  option: OptionsWithInfos;
  votingWeight: string;
}

export const MarketingGauge = ({
  options,
  gauge,
  refreshVotes,
}: {
  options: string[][];
  gauge: GaugeResponse;
  refreshVotes: () => void;
}) => {
  const { address: walletAddress } = useChain("juno");

  const { vote: userVotes } = useUserVotes(gauge.id, walletAddress || "");
  const { txToast } = useToast();
  const currency = useRecoilValue(currencyAtom);

  const [selectedVotes, setSelectedVotes] = useState<BallotEntry[]>([]);
  const [weightInput, setWeightInput] = useState<string | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);
  const [loadingReset, setLoadingReset] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  let totalVotes = 0;
  const optionsWithInfos: OptionsWithInfos[] = mock.map((mock: MarketingGaugeMock) => {
    const optionDetails = options.find((el) => el[0] === mock.address);
    const optionPower = optionDetails ? Number(optionDetails[1]) : 0;

    console.log(options);

    totalVotes += optionPower;

    return {
      ...mock,
      currentVotePower: optionPower,
    };
  });
  const totalValidVotes: number = optionsWithInfos.reduce((acc, red) => {
    return acc + (0.1 < (red.currentVotePower / totalVotes) * 100 ? red.currentVotePower : 0);
  }, 0);

  console.log(totalValidVotes);

  const [selectedOption, setSelectedOption] = useState<OptionsWithInfos>(optionsWithInfos[0]);
  const [availableOptions, setAvailableOptions] = useState<OptionsWithInfos[]>(optionsWithInfos);

  const addToBallot = () => {
    setError(undefined);
    // Add chosen Pool to chosen ones
    const _selectedVotes: BallotEntry[] = [
      ...selectedVotes,
      {
        option: selectedOption,
        votingWeight: weightInput || "0",
      },
    ];
    // Check if valid
    const sumVotes = _selectedVotes.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.votingWeight),
      0,
    );
    if (sumVotes > 100) {
      setError(
        <>
          <Text>{"You can't vote with more then 100% of your total voting power!"}</Text>
          <Text fontSize="sm">(Tried to vote with {sumVotes}%)</Text>
        </>,
      );
      return;
    }
    // Check if vote weight
    if (Number(weightInput) <= 0 || weightInput === undefined) {
      setError(
        <>
          <Text>{"Voting weight must be higher then 0%!"}</Text>
        </>,
      );
      return;
    }

    setSelectedVotes(_selectedVotes);

    // Remove chosen Pool from the available ones
    const _availableOptions = [...availableOptions].filter((el) => el !== selectedOption);
    setSelectedOption(_availableOptions[0]);
    setAvailableOptions(_availableOptions);
  };

  const removeFromBallot = (item: BallotEntry) => {
    // Remove chosen Pool from chosen ones
    const _selectedVotes = [...selectedVotes].filter((el) => el !== item);
    setSelectedVotes(_selectedVotes);

    // Add chosen Pool to the available ones
    const _availableOptions = [...availableOptions, item.option];
    setAvailableOptions(_availableOptions);
  };

  const doVote = GaugesHooks.useVote({
    contractAddress: process.env.NEXT_PUBLIC_GAUGE_ADDRESS as string,
    sender: walletAddress ?? "",
  });

  const executeVote = async () => {
    setLoadingSubmit(true);
    const voteOptions: Vote[] = selectedVotes.map((vote) => {
      return {
        option: vote.option.address,
        weight: (Number(vote.votingWeight) / 100).toString(),
      };
    });

    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doVote({ gauge: gauge.id, votes: voteOptions });
      await new Promise((resolve) => setTimeout(resolve, 6500));
      return result;
    });

    setLoadingSubmit(false);
  };

  const resetAllVotes = async () => {
    setLoadingReset(true);

    await txToast(async (): Promise<ExecuteResult> => {
      const result = await doVote({ gauge: gauge.id, votes: [] });
      await new Promise((resolve) => setTimeout(resolve, 6500));
      return result;
    });

    setLoadingReset(false);
  };

  useEffect(() => {
    try {
      if (userVotes) {
        // Set current votes of user
        const _predefinedVotes: BallotEntry[] = userVotes.votes.map((vote) => {
          return {
            option: availableOptions.find((el) => el.address === vote.option)!,
            votingWeight: (Number(vote.weight) * 100).toString(),
          };
        });
        setSelectedVotes(_predefinedVotes);

        // Remove those from available ones
        const _availableOptions = [...availableOptions].filter((el) => {
          let check = true;
          _predefinedVotes.map((ele) => {
            if (ele.option.address === el.address) {
              check = false;
            }
          });
          return check;
        });

        setAvailableOptions(_availableOptions);

        // Set chosen pool to something realistic
        setSelectedOption(_availableOptions[0]);
      } else {
        setAvailableOptions(optionsWithInfos);
        setSelectedVotes([]);
      }
    } catch (e) {
      // Nothing but
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, userVotes]);

  return (
    <>
      <GaugeHeader gauge={gauge} />
      <Grid gap={6} mt={8} templateColumns={{ base: "repeat(1, 1fr)", lg: "1fr 1fr" }}>
        <BorderedBox mb={10}>
          <Text mb={4} fontSize="2xl">
            Place Your Vote
          </Text>
          <Grid gap={4} templateColumns={{ base: "repeat(1, 1fr)", lg: "4fr 3fr" }}>
            <Box
              overflowY="auto"
              height={80}
              css={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "linear-gradient(0deg, #95E0AD 0%, #52CFF4 100%)",
                  borderRadius: "24px",
                },
              }}
            >
              <BorderedBox bgImageActive={false} minHeight="full">
                {selectedVotes.map(
                  (vote, i) =>
                    vote.option && (
                      <Box key={i} mb={i === selectedVotes.length - 1 ? 0 : 3}>
                        <Flex justifyContent="space-between">
                          <Flex align="center">
                            <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
                              <Text>{vote.option.title}</Text>
                            </Flex>
                          </Flex>
                          <Flex alignItems="center">
                            <Text mr={3}>{vote.votingWeight} %</Text>
                            <Tooltip title="Remove from votes">
                              <IconButton
                                variant="ghost"
                                color="red.400"
                                aria-label="Delete"
                                icon={<BsTrash />}
                                onClick={() => removeFromBallot(vote)}
                              />
                            </Tooltip>
                          </Flex>
                        </Flex>
                      </Box>
                    ),
                )}
              </BorderedBox>
            </Box>
            <Box>
              <Text fontSize="xl">Add to your votes</Text>
              <Divider mt={2} />
              <Flex mt={2} justifyContent="space-between" alignItems="center">
                Choose a charity
                <VoteSelector
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  options={availableOptions}
                />
              </Flex>
              <Flex mt={2} justifyContent="space-between" alignItems="center">
                Voting Weight
                <InputGroup w={"50%"}>
                  <Input
                    type="number"
                    placeholder="0"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                  />
                  <InputRightAddon>%</InputRightAddon>
                </InputGroup>
              </Flex>
              {error && (
                <Alert mt={2} status="error">
                  <AlertIcon />
                  <Box>{error}</Box>
                </Alert>
              )}
              <Flex justifyContent="end">
                <Button onClick={() => addToBallot()} mt={2}>
                  Add
                </Button>
              </Flex>
            </Box>
            {walletAddress ? (
              <Flex alignItems="center" justifyContent="space-between">
                <Button
                  bgGradient="linear(to-l, red.800, red.700)"
                  transition="all 0.3s ease-in"
                  fontSize={"sm"}
                  _hover={{
                    bgGradient: "linear(to-l, red.700, red.600)",
                    transition: "all ease-in 0.3s",
                  }}
                  disabled={!userVotes || userVotes?.votes.length === 0}
                  isLoading={loadingReset}
                  onClick={() => resetAllVotes()}
                >
                  Delete previous votes
                </Button>
                <Button
                  bgGradient="linear(to-l, wynd.green.200, wynd.cyan.200)"
                  transition="all 0.3s ease-in"
                  disabled={selectedVotes.length === 0}
                  isLoading={loadingSubmit}
                  _hover={{
                    bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                    transition: "all ease-in 0.3s",
                  }}
                  onClick={() => executeVote()}
                >
                  Submit Vote
                </Button>
              </Flex>
            ) : (
              <ConnectWalletButton />
            )}
          </Grid>
        </BorderedBox>
        <BorderedBox mb={10}>
          <Text fontSize="2xl">Current Votes For Next Epoch</Text>
          <Text mb={4} fontSize="sm">
            (Starting {new Date(gauge.next_epoch * 1000).toLocaleDateString()})
          </Text>
          <Grid
            display="grid"
            templateColumns={"3fr 4fr 1fr"}
            fontSize="xs"
            fontWeight="semibold"
            color={"wynd.neutral.900"}
            p="2"
            gap="4"
            bg="wynd.gray.alpha.20"
            borderTopRadius="lg"
          >
            <GridItem textAlign="start">Project</GridItem>
            <GridItem textAlign="start">Description</GridItem>
            <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
              Votes
            </GridItem>
          </Grid>
          <Box
            overflowY="auto"
            h={80}
            resize="vertical"
            borderTop="1px white solid"
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(0deg, #95E0AD 0%, #52CFF4 100%)",
                borderRadius: "24px",
              },
            }}
          >
            {[...optionsWithInfos]
              .sort((a, b) => b.currentVotePower - a.currentVotePower)
              .map((option, i) => (
                <Grid
                  templateColumns={"3fr 4fr 1fr"}
                  py={2}
                  key={i}
                  borderBottom="solid 1px white"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Flex alignItems="center">
                      <Image
                        alt="Project Logo"
                        src={option.imageUrl}
                        width={70}
                        height={70}
                        style={{ marginRight: "6px" }}
                      />
                      <Text>{option.title}</Text>
                    </Flex>
                  </Box>
                  <Flex>
                    <Text>{option.description}</Text>
                  </Flex>
                  <Flex>
                    <Tooltip
                      placement="left"
                      label={`Voting Power: ${option.currentVotePower} / ${totalVotes}`}
                    >
                      <Flex align="center">{((option.currentVotePower / totalVotes) * 100).toFixed(2)}%</Flex>
                    </Tooltip>
                  </Flex>
                </Grid>
              ))}
          </Box>
        </BorderedBox>
      </Grid>
    </>
  );
};
