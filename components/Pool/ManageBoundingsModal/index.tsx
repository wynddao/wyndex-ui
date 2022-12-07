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
import { StakedResponse } from "../../../state/clients/types/WyndexStake.types";
import { useToast } from "../../../state/hooks";
import { useUserStakeInfos } from "../../../state/hooks/useUserStakeInfos";
import { renderUnboundingText } from "../../../utils/text";
import { handleChangeColorModeValue } from "../../../utils/theme";
import { secondsToDays } from "../../../utils/time";
import RadioCard from "../../RadioCard";

interface ManageBoundingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenName: any;
  stake: StakedResponse;
  higherDuration: StakedResponse | undefined;
  lowerDuration: StakedResponse | undefined;
  wyndexStakeAddress: string;
}

export default function ManageBoundingsModal(props: ManageBoundingsModalProps) {
  const { isOpen, onClose, tokenName, stake, higherDuration, lowerDuration, wyndexStakeAddress } = props;
  const { address: walletAddress } = useWallet();
  const { colorMode } = useColorMode();
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
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
      <>
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
      </>
    );
  };

  const ChooseAmountContent = () => {
    return (
      <Flex
        key={1}
        border="1px solid"
        borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.100", "whiteAlpha.100")}
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
              <Text
                as="span"
                color={handleChangeColorModeValue(colorMode, "primary.500", "primary.300")}
              ></Text>
              <strong>{stake.stake}</strong>
            </Text>
            <Button
              onClick={() => setAmount(Number(stake.stake))}
              alignSelf="end"
              size="xs"
              _focus={{ outline: "none" }}
            >
              MAX
            </Button>
          </Stack>
          <NumberInput
            alignItems="center"
            bg={handleChangeColorModeValue(colorMode, "whiteAlpha.500", "whiteAlpha.50")}
            min={0}
            value={amount}
            max={Number(stake.stake)}
            onChange={(e) => setAmount(Number(e))}
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
          <p>
            You{"'"}re about to unstake {amount} {tokenName}!
          </p>
        );
      case "bondDown":
        return (
          <p>
            You{"'"}re about to re-bond {amount} {tokenName} from a duration of{" "}
            {secondsToDays(stake.unbonding_period)} days to a lower duration of {/* @ts-ignore */}
            {secondsToDays(lowerDuration?.unbonding_period)} days!
          </p>
        );
      case "bondUp":
        return (
          <p>
            You{"'"}re about to re-bond {amount} {tokenName} from a duration of{" "}
            {secondsToDays(stake.unbonding_period)} days to a higher duration of {/* @ts-ignore */}
            {secondsToDays(higherDuration?.unbonding_period)} days!
          </p>
        );
      default:
        return null;
    }
  };

  const ResultContent = () => (
    <Box marginY={5}>
      <ResultInnerContent />
    </Box>
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
    switch (selectedMode) {
      case "bondDown": {
        txToast(async () => {
          await doRebond({
            bondFrom: stake.unbonding_period,
            bondTo: lowerDuration?.unbonding_period || 0,
            tokens: amount.toString(),
          });
          await new Promise((resolve) => setTimeout(resolve, 6500));
          refreshBondings();
        });
        break;
      }
      case "bondUp": {
        txToast(async () => {
          await doRebond({
            bondFrom: stake.unbonding_period,
            bondTo: higherDuration?.unbonding_period || 0,
            tokens: amount.toString(),
          });
          await new Promise((resolve) => setTimeout(resolve, 6500));
          refreshBondings();
        });
        break;
      }
      case "unstake": {
        txToast(async () => {
          await doUnbond({
            tokens: amount.toString(),
            unbondingPeriod: stake.unbonding_period,
          });
          await new Promise((resolve) => setTimeout(resolve, 6500));
          refreshBondings();
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
        setAmount(0);
      }}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent h={450}>
        <ModalHeader>Manage Bonding</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir="column" width="100%">
            <Steps colorScheme={"orange"} activeStep={activeStep}>
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
                  isDisabled={activeStep === 1 && amount === 0}
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
