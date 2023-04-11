import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { Suspense, useEffect, useRef, useState } from "react";
import { WyndexStakeHooks } from "../../../../../state";
import { BondingPeriodInfo, StakedResponse } from "../../../../../state/clients/types/WyndexStake.types";
import { useIndexerInfos, useToast, UseTokenNameResponse } from "../../../../../state/hooks";
import { useUserStakeInfos } from "../../../../../state/hooks/useUserStakeInfos";
import { renderUnboundingText } from "../../../../../utils/text";
import { secondsToDays } from "../../../../../utils/time";
import { amountToMicroamount, microamountToAmount } from "../../../../../utils/tokens";
import RadioCard from "../../../../General/RadioCard";

interface ManageBoundingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenInfo: UseTokenNameResponse;
  stake: StakedResponse;
  higherDuration: BondingPeriodInfo | undefined;
  lowerDuration: BondingPeriodInfo | undefined;
  wyndexStakeAddress: string;
}

export default function ManageStakeModal(props: ManageBoundingsModalProps) {
  const { isOpen, onClose, tokenInfo, stake, higherDuration, lowerDuration, wyndexStakeAddress } = props;
  const { address: walletAddress } = useChain("juno");
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { refreshBondings } = useUserStakeInfos(wyndexStakeAddress, walletAddress || "");
  const { refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({});
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "selectedMode",
    onChange: (v) => {
      setSelectedMode(v);
    },
    defaultValue: selectedMode,
  });
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });
  const group = getRootProps();
  const { txToast } = useToast();
  const roundForExecution = (N: number): number => Math.floor(N * 10000) / 10000;
  const maxAmount = roundForExecution(
    Number(microamountToAmount(Number(stake.stake) - Number(stake.total_locked), tokenInfo.tokenDecimals)),
  );

  const ChooseModeContent = () => {
    const mode = [];

    if (higherDuration) {
      mode.push("bondUp");
    }
    if (lowerDuration) {
      mode.push("bondDown");
    }
    mode.push("unstake");
    return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Text align="center" marginTop={5} marginBottom={2} fontSize="xl">
          What do you want to do?
        </Text>
        <VStack marginBottom={5} {...group}>
          {mode.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <RadioCard key={value} {...radio} isChecked={selectedMode === value}>
                <Text as="p" align="center">
                  {renderUnboundingText(value, higherDuration, lowerDuration, stake)}
                </Text>
              </RadioCard>
            );
          })}
        </VStack>
      </Flex>
    );
  };

  const ChooseAmountContent = () => {
    const inputRef = useRef(null);
    useEffect(() => {
      if (inputRef.current) {
        // @ts-ignore
        inputRef.current.focus();
      }
    }, []);
    return (
      <Flex
        key={1}
        border="1px solid"
        borderColor={"wynd.alpha.800"}
        borderRadius="1rem 1rem 1rem 0"
        align="center"
        flexDirection={{ base: "column", sm: "row" }}
        wrap="wrap"
        p={4}
        marginY={5}
        gap={4}
      >
        <Flex flex={1} align="center" mb={{ base: 4, sm: 0 }} mr={{ base: 0, sm: 4 }} py={2}>
          <Flex position="relative" align="center">
            <Text fontWeight="bold" fontSize={{ base: "xl" }}>
              {tokenInfo.tokenName}
            </Text>
          </Flex>
        </Flex>
        <Box flex={1}>
          <Stack
            isInline={true}
            w="full"
            justify={{ base: "center", sm: "end" }}
            align="center"
            wrap="wrap"
            spacing={2}
            mb={2}
          >
            <Text fontWeight="medium" textAlign="center">
              Available&nbsp;
              <Text as="span" color={"wynd.cyan.700"}></Text>
              <strong>{maxAmount}</strong>
            </Text>
            <Button
              onClick={() => setAmount(String(maxAmount))}
              alignSelf="end"
              size="xs"
              _focus={{ outline: "none" }}
            >
              MAX
            </Button>
          </Stack>
          <NumberInput
            alignItems="center"
            bg={"wynd.alpha.50"}
            value={amount}
            key="amount"
            max={maxAmount}
            onChange={(e) => setAmount(e)}
          >
            <NumberInputField ref={inputRef} textAlign="end" pr={4} />
          </NumberInput>
        </Box>
      </Flex>
    );
  };

  const ResultInnerContent = () => {
    switch (selectedMode) {
      case "unstake":
        return (
          <Text fontSize="large">
            You{"'"}re about to unbond {amount || "0"} {tokenInfo.tokenSymbol}!
          </Text>
        );
      case "bondDown":
        return (
          <Stack>
            <p>
              You{"'"}re about to rebond {amount || "0"} {tokenInfo.tokenSymbol} from a duration of{" "}
              {secondsToDays(stake.unbonding_period)} days to a lower duration of{" "}
              {secondsToDays(lowerDuration?.unbonding_period ?? 0)} days!
            </p>
            <p>
              If executed, this means that your liquidity will take a minimum of{" "}
              {secondsToDays(lowerDuration?.unbonding_period ?? 0)} days to become liquid once you decide to
              rebond or unbond
            </p>
          </Stack>
        );
      case "bondUp":
        return (
          <Stack>
            <p>
              You{"'"}re about to rebond {amount || "0"} {tokenInfo.tokenSymbol} from a duration of{" "}
              {secondsToDays(stake.unbonding_period)} days to a higher duration of {/* @ts-ignore */}
              {secondsToDays(higherDuration?.unbonding_period)} days!
            </p>
            <p>
              If executed, this means that your liquidity will take a minimum of{" "}
              {secondsToDays(higherDuration?.unbonding_period ?? 0)} days to become liquid once you decide to
              rebond or unbond
            </p>
          </Stack>
        );
      default:
        return null;
    }
  };

  const ResultContent = () => (
    <Flex marginY={5} justifyContent="center" alignItems="center">
      <ResultInnerContent />
    </Flex>
  );

  const steps = [
    { label: "Mode", content: <ChooseModeContent /> },
    { label: "Amount", content: <ChooseAmountContent /> },
    { label: "Execute", content: <ResultContent /> },
  ];

  const doUnbond = WyndexStakeHooks.useUnbond({
    contractAddress: wyndexStakeAddress,
    sender: walletAddress || "",
  });

  const doRebond = WyndexStakeHooks.useRebond({
    contractAddress: wyndexStakeAddress,
    sender: walletAddress || "",
  });

  const doExecute = async () => {
    setLoading(true);
    switch (selectedMode) {
      case "bondDown": {
        await txToast(async () => {
          const res = await doRebond({
            bondFrom: stake.unbonding_period,
            bondTo: lowerDuration?.unbonding_period || 0,
            tokens: amountToMicroamount(amount || "0", tokenInfo.tokenDecimals),
          });
          reset();
          setAmount("");
          onClose();
          return res;
        });
        break;
      }
      case "bondUp": {
        await txToast(async () => {
          const res = await doRebond({
            bondFrom: stake.unbonding_period,
            bondTo: higherDuration?.unbonding_period || 0,
            tokens: amountToMicroamount(amount || "0", tokenInfo.tokenDecimals),
          });
          reset();
          setAmount("");
          onClose();
          return res;
        });
        break;
      }
      case "unstake": {
        await txToast(async () => {
          const res = await doUnbond({
            tokens: amountToMicroamount(amount || "0", tokenInfo.tokenDecimals),
            unbondingPeriod: stake.unbonding_period,
          });
          reset();
          setAmount("");
          onClose();
          return res;
        });
      }
    }
    setLoading(false);
    // New balances will not appear until the next block.
    await new Promise((resolve) => setTimeout(resolve, 6500));
    refreshBondings();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setAmount("");
        onClose();
      }}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent h={450} bgColor="wynd.base.subBg">
        <ModalHeader>Manage Bonding</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Suspense fallback={<p>Loading...</p>}>
            <Flex flexDir="column" width="100%">
              <Steps colorScheme={"cyan"} activeStep={activeStep}>
                {steps.map(({ label, content }) => (
                  <Step label={label} key={label}>
                    {content}
                  </Step>
                ))}
              </Steps>
              {activeStep === steps.length ? (
                <Flex p={4}>
                  <Button mx="auto" size="sm" onClick={reset}>
                    Reset
                  </Button>
                </Flex>
              ) : (
                <Flex width="100%" position={"absolute"} right={6} bottom={5} justify="flex-end">
                  <Button isDisabled={activeStep === 0} mr={4} onClick={prevStep} size="sm" variant="ghost">
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    onClick={activeStep === steps.length - 1 ? () => doExecute() : nextStep}
                    isDisabled={
                      activeStep === 1 && (Number(amount || "0") <= 0 || Number(amount || "0") > maxAmount)
                    }
                    isLoading={loading}
                    loadingText={"Executing"}
                  >
                    {activeStep === steps.length - 1 ? "Execute" : "Next"}
                  </Button>
                </Flex>
              )}
            </Flex>
          </Suspense>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
