"use client";

import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { assets } from "chain-registry";
import { useEffect, useState } from "react";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { withdrawIbcModalOpenAtom } from "../../state/recoil/atoms/modal";

interface fromTokenType {
  name: string;
  address: string;
  availableBalance: string;
}

interface toTokenType {
  name: string;
  address: string;
}

export default function WithdrawIbcModal() {
  const [withdrawIbcModalOpen, setWithdrawIbcModalOpen] = useRecoilState(withdrawIbcModalOpenAtom);

  const [fromToken, setFromToken] = useState<fromTokenType>({
    name: "",
    address: "",
    availableBalance: "",
  });
  const [toToken, setToToken] = useState<toTokenType>({
    name: "",
    address: "",
  });
  const [inputValue, setInputValue] = useState<string>("");
  const [changeToToken, setChangeToToken] = useState(false);

  const icon = useBreakpointValue({
    base: RiArrowDownFill,
    md: RiArrowRightFill,
  });

  const defaultArray = [
    ..."abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""),
    ..."abcdefghijklmnopqrstuvwxyz".split(""),
    ..."0123456789".split(""),
  ];
  const getShuffledArr = (arr: any[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr;
  };
  const getRandomLetter = (name: string) => {
    let randomLetter = getShuffledArr(defaultArray).toString().replace(",", "").slice(0, 32);
    return name.replace(/[\-[\s[\.]/g, "") + randomLetter;
  };
  const assetList = assets
    .map(({ assets }) => assets.values())
    .map((iterator) => {
      for (const value of iterator) {
        return {
          name: value.name,
          address: getRandomLetter(value.name).replace(/,/gm, ""),
        };
      }
    });

  useEffect(() => {
    const getFromToken = getShuffledArr([...assetList])[0];
    const getToToken = getShuffledArr([...assetList]).filter(({ name }) => !(getFromToken.name === name))[0];
    const getRandomBalance =
      parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replace(/,/gm, "")) / 100000000;

    setFromToken({
      name: getFromToken.name,
      address: getRandomLetter(getFromToken.name).replace(/,/gm, ""),
      availableBalance: getRandomBalance.toFixed(4),
    });
    setToToken({
      name: getToToken.name,
      address: getRandomLetter(getToToken.name).replace(/,/gm, ""),
    });
  }, []);

  useEffect(() => {
    if (changeToToken) {
      const getNewToToken = getShuffledArr([...assetList]).filter(
        ({ name }) => !(fromToken.name === name) && !(toToken.name === name),
      )[0];
      const formatToName = getNewToToken.name.replace(/[\-[\s[\.]/g, "");
      setToToken({
        name: getNewToToken.name,
        address: getRandomLetter(formatToName).replace(/,/gm, ""),
      });
      setChangeToToken(false);
    }
  }, [changeToToken]);

  return (
    <Box bg={useColorModeValue("gray.100", "gray.700")}>
      <Modal
        isOpen={withdrawIbcModalOpen}
        onClose={() => setWithdrawIbcModalOpen(false)}
        blockScrollOnMount={false}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "xs", md: "2xl" }} borderRadius="2xl" p={6}>
          <ModalHeader fontSize="2xl" fontWeight="bold" p={0} mb={6}>
            Withdraw IBC Asset
          </ModalHeader>
          <ModalCloseButton top={6} right={6} />
          <Text fontSize="xl" fontWeight="bold" mb={3}>
            IBC Transfer
          </Text>
          <Grid
            templateColumns={{ base: "1fr", md: "1fr auto 1fr" }}
            justifyContent="center"
            alignItems="center"
            mb={6}
          >
            <GridItem
              border="1px solid"
              borderColor={useColorModeValue("blackAlpha.200", "whiteAlpha.300")}
              borderRadius="2xl"
              p={4}
            >
              <Text fontWeight="semibold" mr={4}>
                From
              </Text>
              <Text
                maxW={{ base: 60, md: 64 }}
                height="1.5em"
                fontWeight="semibold"
                color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
                whiteSpace="break-spaces"
                overflow="hidden"
                title={fromToken.address}
                _before={{
                  content: "attr(title)",
                  width: "50%",
                  float: "right",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  direction: "rtl",
                }}
              >
                {fromToken.address}
              </Text>
            </GridItem>
            <GridItem display="flex" justifyContent="center" alignItems="center" p={2}>
              <Icon as={icon} color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")} />
            </GridItem>
            <GridItem
              border="1px solid"
              borderColor={useColorModeValue("blackAlpha.200", "whiteAlpha.300")}
              borderRadius="2xl"
              p={4}
            >
              <Text fontWeight="semibold" mr={4}>
                To
              </Text>
              <Stack isInline={true} justify="space-between">
                <Text
                  flex={1}
                  maxW={{ base: 48, md: 52 }}
                  height="1.5em"
                  fontWeight="semibold"
                  color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
                  whiteSpace="break-spaces"
                  overflow="hidden"
                  title={toToken.address}
                  _before={{
                    content: "attr(title)",
                    width: "50%",
                    float: "right",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    direction: "rtl",
                  }}
                >
                  {toToken.address}
                </Text>
                <Button
                  size="xs"
                  colorScheme="primary"
                  _focus={{ outline: "none" }}
                  onClick={() => setChangeToToken(true)}
                >
                  Edit
                </Button>
              </Stack>
            </GridItem>
          </Grid>
          <Text fontSize="xl" fontWeight="bold" mb={3}>
            Amount To Deposit
          </Text>
          <Box borderRadius="2xl" border="1px solid" borderColor="orange.300" px={4} py={6} mb={12}>
            <Text fontWeight="semibold" mr={4} mb={3}>
              Available balance:&ensp;
              <Text as="span" color={useColorModeValue("primary.500", "primary.300")}>
                {fromToken.availableBalance}&ensp;{fromToken.name}
              </Text>
            </Text>
            <NumberInput
              size="lg"
              display="flex"
              alignItems="center"
              defaultValue={15}
              value={inputValue}
              bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.50")}
              min={0}
              max={parseFloat(fromToken.availableBalance)}
              onChange={(value) => setInputValue(value)}
            >
              <NumberInputField fontWeight="semibold" letterSpacing="wide" />
              <Button
                position="absolute"
                zIndex={5}
                right={4}
                colorScheme="primary"
                size="xs"
                ml={2}
                _focus={{ outline: "none" }}
                onClick={() => setInputValue(fromToken.availableBalance)}
              >
                MAX
              </Button>
            </NumberInput>
          </Box>
          <Button
            h={14}
            colorScheme="primary"
            w="full"
            isDisabled={inputValue === "0" || inputValue === "" ? true : false}
            onClick={() => () => setWithdrawIbcModalOpen(false)}
          >
            Withdraw
          </Button>
        </ModalContent>
      </Modal>
    </Box>
  );
}
