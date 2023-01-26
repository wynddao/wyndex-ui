import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
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
import { useState } from "react";
import { UseTokenNameResponse } from "../../../../../state";
import { BondingPeriodInfo } from "../../../../../state/clients/types/WyndexStake.types";
import { secondsToDays } from "../../../../../utils/time";
import { amountToMicroamount, microamountToAmount } from "../../../../../utils/tokens";
import RadioCard from "../../../../General/RadioCard";

interface StakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  bondingInfos: any;
  doStake: (amount: number, duration: number) => void;
  loading: boolean;
  tokenInfo: UseTokenNameResponse;
}

export default function StakeModal(props: StakeModalProps) {
  const { isOpen, onClose, balance, bondingInfos, doStake, tokenInfo, loading } = props;
  const [value, setValue] = useState<string>(bondingInfos[0].unbonding_period.toString());
  const [amount, setAmount] = useState<string>("0");
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "unbondingPeriod",
    onChange: (v) => {
      setValue(v);
    },
    defaultValue: "1",
  });

  const group = getRootProps();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent bgColor="wynd.base.subBg">
        <ModalHeader>Stake your WYND!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            key={1}
            border="1px solid"
            borderColor={"wynd.alpha.800"}
            borderRadius="1rem 1rem 1rem 0"
            align="center"
            flexDirection={{ base: "column", sm: "row" }}
            wrap="wrap"
            p={4}
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
                  <Text as="span" color={"wynd.cyan.600"}></Text>
                  <strong>{microamountToAmount(balance, tokenInfo.tokenDecimals)}</strong>
                </Text>
                <Button
                  onClick={() => setAmount(microamountToAmount(balance, tokenInfo.tokenDecimals))}
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
                max={balance}
                onChange={(e) => setAmount(e)}
              >
                <NumberInputField textAlign="end" pr={4} />
              </NumberInput>
            </Box>
          </Flex>
          <Divider marginTop={5} />
          <Text fontWeight="bold" fontSize={{ base: "xl" }} marginY={5}>
            Unbonding Period
          </Text>
          {bondingInfos && bondingInfos.length > 0 && (
            <VStack {...group}>
              {bondingInfos.map(({ unbonding_period, apy }: {unbonding_period: number, apy: number}) => {
                const radio = getRadioProps({ value: unbonding_period });
                return (
                  <RadioCard
                    key={unbonding_period}
                    {...radio}
                    isChecked={unbonding_period.toString() === value}
                  >
                    <Flex>
                      <Text as="p" flex="0.7">
                        {secondsToDays(unbonding_period)} Days
                      </Text>
                      <Text as="p">
                        APR: {(apy * 100).toFixed(2)} %
                      </Text>
                    </Flex>
                  </RadioCard>
                );
              })}
            </VStack>
          )}
          <Alert marginTop={5} status="warning">
            <AlertIcon />
            The unbonding period starts with the unstaking of the tokens.
          </Alert>
          <Box px={{ sm: 12 }} marginY={5}>
            <Button
              isLoading={loading}
              loadingText={"Executing"}
              onClick={() =>
                doStake(Number(amountToMicroamount(amount, tokenInfo.tokenDecimals)), Number(value))
              }
              isDisabled={
                Number(amountToMicroamount(amount, tokenInfo.tokenDecimals)) <= 0 ||
                Number(amountToMicroamount(amount, tokenInfo.tokenDecimals)) > Number(balance)
              }
              w="full"
              size="lg"
              h={{ base: 12, sm: 14 }}
            >
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
