"use client";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Image,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoMdInformationCircle } from "react-icons/io";
import { Cw20AllowanceHooks, Cw20Hooks, WyndexPairHooks } from "../../state";
import { handleChangeColorModeValue } from "../../utils/theme";
import { Asset, Pair } from "../../utils/types";
import { Asset as WyndAsset } from "../../state/clients/types/WyndexPair.types";
import { getAssetInfo } from "../../utils/assets";
import { Coin } from "cosmwasm";

interface inputType {
  id: string;
  value: string;
  contract?: string;
}

interface singleType {
  selectedIndex: number;
  isSingle: boolean;
}

interface popType {
  optionsIndex: Asset[];
  isOpen: boolean;
}

interface DataType extends Asset {
  show?: boolean;
}

export default function AddLiquidity({ poolData }: { poolData: Pair }) {
  const { colorMode } = useColorMode();

  const [data, setData] = useState<DataType[]>(poolData.tokens);
  const defaultInput = poolData.tokens.map(({ denom: label, contractAddress }) => ({
    id: label,
    value: "0",
    contract: contractAddress,
  }));
  const [tokenInputValue, setTokenInputValue] = useState<inputType[]>(defaultInput);
  const [single, setSingle] = useState<singleType>({ selectedIndex: 0, isSingle: false });
  const [openPop, setOpenPop] = useState<popType>({ optionsIndex: [], isOpen: false });
  const [tokenAddress, setTokenAddress] = useState<string>("");

  const { address: walletAddress } = useWallet();

  const doAllowance = Cw20AllowanceHooks.useAllowance({
    sender: walletAddress || "",
  });

  const doProvideLiquidity = WyndexPairHooks.useProvideLiquidity({
    contractAddress: poolData.contractAddress,
    sender: walletAddress || "",
  });

  const prodiveLiquidity = async () => {
    const assets = tokenInputValue.map((token): WyndAsset => {
      /*doAllowance({
        amount: token.value,
        spender: poolData.contractAddress,
        contractAddress: token.contract || "",
      }); */
      return {
        amount: token.value,
        info: token.contract ? { token: token.contract } : { native_token: token.id },
      };
    });

    const funds: Coin[] | undefined = tokenInputValue.find((element) => !element.contract)
      ? [
          {
            amount: tokenInputValue.find((element) => !element.contract)?.value || "1",
            denom: tokenInputValue.find((element) => !element.contract)?.id || "ujunox",
          },
        ]
      : undefined;
    doProvideLiquidity(
      {
        assets,
      },
      "auto",
      undefined,
      funds,
    );
  };

  useEffect(() => {
    if (single.isSingle) {
      setData((pre) => {
        const getNewArr = pre.map((v, i) => {
          if (single.selectedIndex !== i) return { ...v, show: false };
          return { ...v, show: true };
        });
        return getNewArr;
      });
    }

    if (!single.isSingle) setData((pre) => pre.map((v) => ({ ...v, show: true })));
  }, [single.isSingle, single.selectedIndex]);

  return (
    <>
      <Text fontSize="sm" fontWeight="semibold" pt={2}>
        LP token balance:&nbsp;
        <Text as="span" color={handleChangeColorModeValue(colorMode, "primary.500", "primary.300")}>
          0 GAMM-600
        </Text>
      </Text>
      <Stack spacing={2} mb={6}>
        {data.map(({ name, denom, img, show, contractAddress }, i) => {
          return (
            show && (
              <Box position="relative">
                <Popover returnFocusOnClose={false} isOpen={openPop.isOpen}>
                  <PopoverTrigger>
                    <Button w={0} h={0} minW={0} p={0} />
                  </PopoverTrigger>
                  <PopoverContent
                    position="absolute"
                    top={{ base: 24, sm: "6.7rem" }}
                    left={0}
                    borderTopStyle="dashed"
                    borderRadius={openPop.isOpen ? "0 0 0.375rem 0.375rem" : "md"}
                    bg={handleChangeColorModeValue(colorMode, "#f5f5f5", "whiteAlpha.50")}
                    w="full"
                    maxW={{ base: 60, sm: "sm" }}
                    minW={{ base: 60, sm: "sm" }}
                    _focus={{ outline: "none" }}
                  >
                    <PopoverBody>
                      {openPop.optionsIndex.map(({ denom: optionLabel, img }, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          w="full"
                          h="fit-content"
                          justifyContent="flex-start"
                          flexWrap="wrap"
                          fontSize="xl"
                          fontWeight="bold"
                          wordBreak="break-word"
                          px={{ base: 2, sm: 4 }}
                          py={4}
                          onClick={() => {
                            data.map(({ denom }, i) => {
                              if (optionLabel === denom) {
                                setSingle({
                                  selectedIndex: i,
                                  isSingle: true,
                                });
                                setOpenPop({
                                  optionsIndex: openPop.optionsIndex,
                                  isOpen: false,
                                });
                              }
                            });
                          }}
                        >
                          <Image alt={`${denom} logo`} src={img} w={12} mr={{ base: 3, sm: 4 }} />
                          {optionLabel}
                        </Button>
                      ))}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <Flex
                  key={1}
                  border="1px solid"
                  borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.100", "whiteAlpha.100")}
                  borderRadius={openPop.isOpen ? "1rem 1rem 1rem 0" : "2xl"}
                  align="center"
                  flexDirection={{ base: "column", sm: "row" }}
                  wrap="wrap"
                  p={4}
                  gap={4}
                >
                  <Flex flex={1} align="center" mb={{ base: 4, sm: 0 }} mr={{ base: 0, sm: 4 }} py={2}>
                    <Image alt={`${denom} logo`} src={img} w={12} mr={{ base: 3, sm: 4 }} />
                    <Flex
                      position="relative"
                      align="center"
                      _hover={{ cursor: single.isSingle && "pointer" }}
                      onClick={() =>
                        setOpenPop({
                          optionsIndex: data.filter((_, index) => index !== i),
                          isOpen: !openPop.isOpen,
                        })
                      }
                    >
                      <Text fontWeight="bold" fontSize={{ base: "xl" }}>
                        {denom}
                      </Text>
                      {single.isSingle && (
                        <IconButton
                          variant="unstyled"
                          icon={<IoIosArrowDown />}
                          aria-label="singleButton"
                          _focus={{ outline: "none" }}
                          padding={4}
                        />
                      )}
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
                        {denom}
                      </Text>
                      <Button
                        alignSelf="end"
                        size="xs"
                        _focus={{ outline: "none" }}
                        onClick={() => {
                          const getVal = tokenInputValue.map(({ id, value: defaultVal }) => {
                            if (id === denom) {
                              return {
                                id: id,
                                value: "1",
                              };
                            }
                            return { id: id, value: defaultVal };
                          });
                          setTokenInputValue(getVal);
                        }}
                      >
                        MAX
                      </Button>
                    </Stack>
                    <NumberInput
                      alignItems="center"
                      value={tokenInputValue[i].value}
                      bg={handleChangeColorModeValue(colorMode, "whiteAlpha.500", "whiteAlpha.50")}
                      min={0}
                      max={1001}
                      onChange={(val) => {
                        const getVal = tokenInputValue.map(
                          ({ id, value: defaultVal, contract: contractDefault }) => {
                            if (id === denom) {
                              return {
                                id: id,
                                value: val,
                                contract: contractAddress || undefined,
                              };
                            }
                            return { id: id, value: defaultVal, contract: contractDefault };
                          },
                        );
                        console.log(getVal);
                        setTokenInputValue(getVal);
                      }}
                    >
                      <NumberInputField textAlign="end" pr={4} />
                    </NumberInput>
                  </Box>
                </Flex>
              </Box>
            )
          );
        })}
      </Stack>
      <Flex position="relative" justify="end" align="center" fontSize="xl" mb={6}>
        <Checkbox
          isChecked={single.isSingle}
          onChange={(e) => {
            setSingle({
              selectedIndex: single.selectedIndex,
              isSingle: e.target.checked,
            });
            setOpenPop({ optionsIndex: openPop.optionsIndex, isOpen: false });
          }}
          size="lg"
        >
          Single Asset LP&nbsp;
        </Checkbox>
        <Tooltip
          label="Single Asset LP allows you to provide liquidity using one asset. However, this will impact the pool price of the asset you’re providing liquidity with."
          placement="top-end"
          bg={handleChangeColorModeValue(colorMode, "blackAlpha.900", "whiteAlpha.900")}
          borderRadius="lg"
          border="1px solid"
          borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.100", "whiteAlpha.100")}
        >
          <Box position="relative">
            <IoMdInformationCircle />
          </Box>
        </Tooltip>
      </Flex>
      <Flex
        flexDirection={{ base: "column", sm: "row" }}
        justify="space-between"
        textAlign={{ base: "end", sm: "start" }}
        bg={handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50")}
        borderRadius="lg"
        border="1px solid"
        borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.100", "whiteAlpha.100")}
        p={4}
        mb={6}
      >
        <Text fontWeight="semibold">Price impact</Text>
        <Text>-</Text>
      </Flex>
      <Flex justify="center" mb={6}>
        <Alert status="error" borderRadius="md" w="fit-content">
          <AlertIcon />
          <AlertTitle>Amount is zero</AlertTitle>
        </Alert>
      </Flex>
      <Box px={{ sm: 12 }}>
        <Button
          onClick={() => prodiveLiquidity()}
          isDisabled={tokenInputValue.filter(({ value }) => value !== "0").length > 0 ? false : true}
          w="full"
          size="lg"
          h={{ base: 12, sm: 14 }}
        >
          Add Liquidity
        </Button>
      </Box>
    </>
  );
}
