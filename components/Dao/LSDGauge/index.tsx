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
import { useWallet } from "@cosmos-kit/react";
import { ExecuteResult } from "cosmwasm";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { GaugesHooks, useGaugeConfigs, useToast } from "../../../state";
import { GaugeResponse, Vote } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { useUserVotes } from "../../../state/hooks/gauge/useUserVotes";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { getAllValidators } from "../../../utils/chain";
import ConnectWalletButton from "../../General/Sidebar/ConnectWalletButton";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { GaugeHeader } from "./GaugeHeader";
import ValidatorSelector from "./VoteSelector";

export const LSDGauge = ({
  options,
  gauge,
  refreshVotes,
}: {
  options: string[][];
  gauge: GaugeResponse;
  refreshVotes: () => void;
}) => {
  const { address: walletAddress } = useWallet();
  const { config } = useGaugeConfigs(gauge.adapter);

  const { vote: userVotes } = useUserVotes(gauge.id, walletAddress || "");
  const { txToast } = useToast();
  const currency = useRecoilValue(currencyAtom);

  const [selectedVotes, setSelectedVotes] = useState<any[]>([]);
  const [allValidators, setAllValidators] = useState<any[]>([]);
  const [sumVotes, setSumVotes] = useState<number>(0);
  const [weightInput, setWeightInput] = useState<string | undefined>(undefined);
  const { isOpen: isVisible, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });
  const [error, setError] = useState<any>(undefined);
  const [loadingReset, setLoadingReset] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  let totalVotes = 0;

  const [selectedValidator, setSelectedValidator] = useState<any>(allValidators[0]);
  const [availableValidators, setAvailableValidators] = useState<any[]>([]);

  const addToBallot = () => {
    setError(undefined);
    // Add chosen Validator to chosen ones
    const _selectedVotes: any[] = [
      ...selectedVotes,
      {
        option: selectedValidator,
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

    // Remove chosen Validator from the available ones
    const _availableValidators = [...availableValidators].filter(
      (el) => el.operator_address !== selectedValidator.operator_address,
    );
    setSelectedValidator(_availableValidators[0]);
    setAvailableValidators(_availableValidators);
  };

  const removeFromBallot = (item: any) => {
    // Remove chosen Validator from chosen ones
    const _selectedVotes = [...selectedVotes].filter((el) => el !== item);
    setSelectedVotes(_selectedVotes);

    // Add chosen Validator to the available ones
    const _availableValidators = [...availableValidators, item.option];
    setAvailableValidators(_availableValidators);
  };

  const doVote = GaugesHooks.useVote({
    contractAddress: process.env.NEXT_PUBLIC_GAUGE_ADDRESS as string,
    sender: walletAddress ?? "",
  });

  const executeVote = async () => {
    setLoadingSubmit(true);
    const voteOptions: Vote[] = selectedVotes.map((vote) => {
      return {
        option: vote.option.operator_address,
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

  const getData = async () => {
    const _allValidators = await getAllValidators();

    const _allValidValidatorsWithOptions = options.map((option) => {
      const validator = _allValidators.find((el: any) => el.operator_address === option[0])!;
      return {
        ...validator,
        votes: option[1],
      };
    });
    const _sumVotes = _allValidValidatorsWithOptions.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.votes),
      0,
    );

    setSumVotes(_sumVotes);
    setAllValidators(_allValidValidatorsWithOptions);
    setSelectedValidator(_allValidValidatorsWithOptions[0]);

    try {
      if (userVotes) {
        // Set current votes of user
        const _predefinedVotes: any[] = userVotes.votes.map((vote) => {
          return {
            option: _allValidValidatorsWithOptions.find((el) => el.operator_address === vote.option)!,
            votingWeight: (Number(vote.weight) * 100).toString(),
          };
        });
        setSelectedVotes(_predefinedVotes);

        // Remove those from available ones
        const _availableValidators = [..._allValidValidatorsWithOptions].filter((el) => {
          let check = true;

          _predefinedVotes.map((ele) => {
            if (ele.option.operator_address === el.operator_address) {
              check = false;
            }
          });
          return check;
        });

        setAvailableValidators(_availableValidators);

        // Set chosen pool to something realistic
        setSelectedValidator(_availableValidators[0]);
      } else {
        setAvailableValidators(_allValidValidatorsWithOptions);
        setSelectedVotes([]);
      }
    } catch (e) {
      // Nothing but
      return;
    }
  };

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, userVotes, options]);

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
                          <Flex align="center">{vote.option.description?.moniker}</Flex>
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
              <Divider my={2} />
              <Text>Choose a validator</Text>{" "}
              <Flex justifyContent="space-between" alignItems="center">
                {allValidators.length > 0 && (
                  <ValidatorSelector
                    selectedValidator={selectedValidator}
                    setSelectedValidator={setSelectedValidator}
                    options={availableValidators}
                  />
                )}
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
            templateColumns={"5fr 1fr 1fr"}
            fontSize="xs"
            fontWeight="semibold"
            color={"wynd.neutral.900"}
            p="2"
            gap="4"
            bg="wynd.gray.alpha.20"
            borderTopRadius="lg"
          >
            <GridItem textAlign="start">Validator</GridItem>
            <GridItem>Commision</GridItem>
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
            {[...allValidators]
              .sort((a, b) => b.votes - a.votes)
              .map((validator, i) => (
                <Grid
                  templateColumns={"5fr 1fr 1fr"}
                  py={2}
                  key={i}
                  borderBottom="solid 1px white"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Flex align="center">
                    <Flex position="relative" align="center" pr={{ base: 5, sm: 7 }}>
                      {validator.description?.moniker || ""}
                    </Flex>
                  </Flex>
                  <Flex>{(Number(validator.commission.commission_rates.rate) * 100).toFixed(0)}%</Flex>
                  <Flex align="center">
                    <Tooltip label={validator.votes}>
                      <Text>{((100 / Number(sumVotes)) * Number(validator.votes)).toFixed(2)}%</Text>
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
