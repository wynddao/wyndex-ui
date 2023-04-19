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
  useDisclosure,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { ExecuteResult } from "cosmwasm";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { GaugesHooks, useGaugeConfigs, useIndexerInfos, useToast } from "../../../state";
import { AssetInfoValidated } from "../../../state/clients/types/WyndexFactory.types";
import { GaugeResponse, Vote } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { useUserVotes } from "../../../state/hooks/gauge/useUserVotes";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { PairsResponse } from "../../../state/recoil/selectors/clients/indexer";
import { getAssetByDenom, getAssetInfoDetails, getAssetPriceByCurrency } from "../../../utils/assets";
import { formatCurrency } from "../../../utils/currency";
import { microdenomToDenom } from "../../../utils/tokens";
import AssetImage from "../../Dex/AssetImage";
import ConnectWalletButton from "../../General/Sidebar/ConnectWalletButton";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeHeader } from "./GaugeHeader";
import PoolSelector from "./VoteSelector";

export interface PoolWithAddresses {
  assets: AssetInfoValidated[];
  lp: string;
  pair: string;
  staking: string;
  currentVotePower: number;
}

interface BallotEntry {
  option: PoolWithAddresses;
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
  const { config } = useGaugeConfigs(gauge.adapter);
  const { pools, pairs, assetPrices } = useIndexerInfos({ fetchPoolData: true });

  const { vote: userVotes } = useUserVotes(gauge.id, walletAddress || "");
  const { txToast } = useToast();
  const currency = useRecoilValue(currencyAtom);

  const [selectedVotes, setSelectedVotes] = useState<BallotEntry[]>([]);
  const [weightInput, setWeightInput] = useState<string | undefined>(undefined);
  const { isOpen: isVisible, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });
  const [error, setError] = useState<any>(undefined);
  const [loadingReset, setLoadingReset] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  let totalVotes = 0;
  const poolsWithStakingAddress: PoolWithAddresses[] = pairs.map((pair: PairsResponse) => {
    const optionDetails = options.find((el) => el[0] === pair.staking);
    const optionPower = optionDetails ? Number(optionDetails[1]) : 0;

    totalVotes += optionPower;

    return {
      ...pair,
      assets: [...pools[pair.pair]],
      currentVotePower: optionPower,
    };
  });
  const totalValidVotes: number = poolsWithStakingAddress.reduce((acc, red) => {
    return acc + (0.1 < (red.currentVotePower / totalVotes) * 100 ? red.currentVotePower : 0);
  }, 0);

  const [selectedPool, setSelectedPool] = useState<PoolWithAddresses>(poolsWithStakingAddress[0]);
  const [availablePools, setAvailablePools] = useState<PoolWithAddresses[]>(poolsWithStakingAddress);

  const addToBallot = () => {
    setError(undefined);
    // Add chosen Pool to chosen ones
    const _selectedVotes: BallotEntry[] = [
      ...selectedVotes,
      {
        option: selectedPool,
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
    const _availablePools = [...availablePools].filter((el) => el !== selectedPool);
    setSelectedPool(_availablePools[0]);
    setAvailablePools(_availablePools);
  };

  const removeFromBallot = (item: BallotEntry) => {
    // Remove chosen Pool from chosen ones
    const _selectedVotes = [...selectedVotes].filter((el) => el !== item);
    setSelectedVotes(_selectedVotes);

    // Add chosen Pool to the available ones
    const _availablePools = [...availablePools, item.option];
    setAvailablePools(_availablePools);
  };

  const doVote = GaugesHooks.useVote({
    contractAddress: process.env.NEXT_PUBLIC_GAUGE_ADDRESS as string,
    sender: walletAddress ?? "",
  });

  const executeVote = async () => {
    setLoadingSubmit(true);
    const voteOptions: Vote[] = selectedVotes.map((vote) => {
      return {
        option: vote.option.staking,
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
            option: availablePools.find((el) => el.staking === vote.option)!,
            votingWeight: (Number(vote.weight) * 100).toString(),
          };
        });
        setSelectedVotes(_predefinedVotes);

        // Remove those from available ones
        const _availablePools = [...availablePools].filter((el) => {
          let check = true;
          _predefinedVotes.map((ele) => {
            if (ele.option.staking === el.staking) {
              check = false;
            }
          });
          return check;
        });

        setAvailablePools(_availablePools);

        // Set chosen pool to something realistic
        setSelectedPool(_availablePools[0]);
      } else {
        setAvailablePools(poolsWithStakingAddress);
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
                              <Box
                                w={{ base: 6, md: 7, lg: 8 }}
                                h={{ base: 6, md: 7, lg: 8 }}
                                bg="whiteAlpha.900"
                                borderRadius="full"
                                border="1px solid"
                                borderColor={"wynd.cyan.100"}
                                overflow="hidden"
                                p={0.5}
                              >
                                <AssetImage
                                  asset={
                                    // @ts-ignore
                                    (vote.option.assets[0].token || vote.option.assets[0].native) as string
                                  }
                                />
                              </Box>
                              <Box
                                position="absolute"
                                left={{ base: 4, sm: 5 }}
                                w={{ base: 6, md: 7, lg: 8 }}
                                h={{ base: 6, md: 7, lg: 8 }}
                                bg="whiteAlpha.900"
                                borderRadius="full"
                                border="1px solid"
                                borderColor={"wynd.cyan.100"}
                                overflow="hidden"
                                p={0.5}
                              >
                                <AssetImage
                                  asset={
                                    // @ts-ignore
                                    (vote.option.assets[1].token || vote.option.assets[1].native) as string
                                  }
                                />
                              </Box>
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
                Choose a pool
                <PoolSelector
                  selectedPool={selectedPool}
                  setSelectedPool={setSelectedPool}
                  options={availablePools}
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
            templateColumns={"3fr 2fr 2fr 1fr"}
            fontSize="xs"
            fontWeight="semibold"
            color={"wynd.neutral.900"}
            p="2"
            gap="4"
            bg="wynd.gray.alpha.20"
            borderTopRadius="lg"
          >
            <GridItem textAlign="start">Pool</GridItem>
            <GridItem textAlign="start">Reward next epoch</GridItem>
            <GridItem textAlign="start">TVL</GridItem>
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
            {[...poolsWithStakingAddress]
              .sort((a, b) => b.currentVotePower - a.currentVotePower)
              .map((pool, i) => (
                <Grid
                  templateColumns={"3fr 2fr 2fr 1fr"}
                  py={2}
                  key={i}
                  borderBottom="solid 1px white"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Flex align="center">
                    <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
                      <Box
                        w={{ base: 6, md: 7, lg: 8 }}
                        h={{ base: 6, md: 7, lg: 8 }}
                        bg="whiteAlpha.900"
                        borderRadius="full"
                        border="1px solid"
                        borderColor={"wynd.cyan.100"}
                        overflow="hidden"
                        p={0.5}
                      >
                        {/* @ts-ignore */}
                        <AssetImage asset={(pool.assets[0].token || pool.assets[0].native) as string} />
                      </Box>
                      <Box
                        position="absolute"
                        left={{ base: 4, sm: 5 }}
                        w={{ base: 6, md: 7, lg: 8 }}
                        h={{ base: 6, md: 7, lg: 8 }}
                        bg="whiteAlpha.900"
                        borderRadius="full"
                        border="1px solid"
                        borderColor={"wynd.cyan.100"}
                        overflow="hidden"
                        p={0.5}
                      >
                        {/* @ts-ignore */}
                        <AssetImage asset={(pool.assets[1].token || pool.assets[1].native) as string} />
                      </Box>
                    </Flex>
                    {" / "}
                  </Flex>
                  <Flex align="center">
                    {formatCurrency(
                      currency,
                      (
                        getAssetPriceByCurrency(currency, pool.assets[0], assetPrices) *
                        // @ts-ignore
                        Number(pool.assets[0].amount / 10 ** getAssetInfoDetails(pool.assets[0]).decimals) *
                        2
                      ).toString(),
                    )}
                  </Flex>
                  <Tooltip placement="left" label={`Voting Power: ${pool.currentVotePower} / ${totalVotes}`}>
                    <Flex align="center">{((pool.currentVotePower / totalVotes) * 100).toFixed(2)}%</Flex>
                  </Tooltip>
                </Grid>
              ))}
          </Box>
        </BorderedBox>
      </Grid>
    </>
  );
};
