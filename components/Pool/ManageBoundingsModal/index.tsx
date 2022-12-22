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
  useColorMode,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useState } from "react";
import { WyndexStakeHooks } from "../../../state";
import { BondingPeriodInfo, StakedResponse } from "../../../state/clients/types/WyndexStake.types";
import { useToast } from "../../../state/hooks";
import { useUserStakeInfos } from "../../../state/hooks/useUserStakeInfos";
import { renderUnboundingText } from "../../../utils/text";
import { secondsToDays } from "../../../utils/time";
import { amountToMicroamount, microamountToAmount } from "../../../utils/tokens";
import RadioCard from "../../RadioCard";

interface ManageBoundingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenName: any;
  tokenSymbol: any;
  stake: StakedResponse;
  higherDuration: BondingPeriodInfo | undefined;
  lowerDuration: BondingPeriodInfo | undefined;
  wyndexStakeAddress: string;
}

export default function ManageBoundingsModal(props: ManageBoundingsModalProps) {
  const {
    isOpen,
    onClose,
    tokenName,
    stake,
    higherDuration,
    lowerDuration,
    wyndexStakeAddress,
    tokenSymbol,
  } = props;
  const { address: walletAddress } = useWallet();
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const { refreshBondings } = useUserStakeInfos(wyndexStakeAddress, walletAddress || "");
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
              {tokenName}
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
              <strong>{roundForExecution(Number(microamountToAmount(stake.stake, 6)))}</strong>
            </Text>
            <Button
              onClick={() =>
                setAmount(roundForExecution(Number(microamountToAmount(stake.stake, 6))).toString())
              }
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
            min={0}
            value={amount}
            max={roundForExecution(Number(microamountToAmount(stake.stake, 6)))}
            onChange={(e) => setAmount(e)}
          >
            <NumberInputField textAlign="end" pr={4} />
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
            You{"'"}re about to unstake {amount} {tokenSymbol}!
          </Text>
        );
      case "bondDown":
        return (
          <p>
            You{"'"}re about to re-bond {amount} {tokenSymbol} from a duration of{" "}
            {secondsToDays(stake.unbonding_period)} days to a lower duration of {/* @ts-ignore */}
            {secondsToDays(lowerDuration?.unbonding_period)} days!
          </p>
        );
      case "bondUp":
        return (
          <p>
            You{"'"}re about to re-bond {amount} {tokenSymbol} from a duration of{" "}
            {secondsToDays(stake.unbonding_period)} days to a higher duration of {/* @ts-ignore */}
            {secondsToDays(higherDuration?.unbonding_period)} days!
          </p>
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
    console.log({
      bondFrom: stake.unbonding_period,
      bondTo: lowerDuration?.unbonding_period || 0,
      tokens: Number(amountToMicroamount(amount, 6)).toFixed(5).toString(),
    });
    switch (selectedMode) {
      case "bondDown": {
        txToast(async () => {
          const res = await doRebond({
            bondFrom: stake.unbonding_period,
            bondTo: lowerDuration?.unbonding_period || 0,
            tokens: amountToMicroamount(amount, 6),
          });
          await new Promise((resolve) => setTimeout(resolve, 6500));
          refreshBondings();
          onClose();
          return res;
        });
        break;
      }
      case "bondUp": {
        txToast(async () => {
          const res = await doRebond({
            bondFrom: stake.unbonding_period,
            bondTo: higherDuration?.unbonding_period || 0,
            tokens: amountToMicroamount(amount, 6),
          });
          await new Promise((resolve) => setTimeout(resolve, 6500));
          refreshBondings();
          onClose();
          return res;
        });
        break;
      }
      case "unstake": {
        txToast(async () => {
          const res = await doUnbond({
            tokens: amountToMicroamount(amount, 6),
            unbondingPeriod: stake.unbonding_period,
          });
          await new Promise((resolve) => setTimeout(resolve, 6500));
          refreshBondings();
          onClose();
          return res;
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
        setAmount("0");
      }}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent h={450} bgColor="wynd.base.subBg">
        <ModalHeader>Manage Bonding</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                    activeStep === 1 &&
                    (Number(amount) === 0 || Number(amountToMicroamount(amount, 6)) > Number(stake.stake))
                  }
                >
                  {activeStep === steps.length - 1 ? "Execute" : "Next"}
                </Button>
              </Flex>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
