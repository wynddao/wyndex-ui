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
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { assets } from "chain-registry";
import { useEffect, useState } from "react";
import { IoWallet } from "react-icons/io5";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { depositIbcModalAtom } from "../../state/recoil/atoms/modal";
import { getAsset, getBalances } from "../../utils";

interface fromTokenType {
  name: string;
  address: string;
  availableBalance: string;
}

interface toTokenType {
  name: string;
  address: string;
}

export default function DepositIbcModal() {
  const { address } = useWallet();
  const [depositIbcModalOpen, setDepositIbcModalOpen] = useRecoilState(depositIbcModalAtom);

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

  const icon = useBreakpointValue({
    base: RiArrowDownFill,
    md: RiArrowRightFill,
  });

  useEffect(() => {
    (async function updateFromToken() {
      if (!depositIbcModalOpen.asset || !address) return;

      const asset = await getAsset(depositIbcModalOpen.asset);
      const balances = await getBalances(address);
      const balance = balances.find((coin) => coin.denom === asset.denom)?.amount || "0";

      const fromToken: fromTokenType = {
        name: asset.name,
        address: asset.contractAddress || "",
        availableBalance: balance,
      };
      setFromToken(fromToken);
    })();
  }, [address, depositIbcModalOpen.asset]);

  useEffect(() => {
    const getShuffledArr = (arr: any[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
      }
      return arr;
    };
    const defaultArray = [
      ..."abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""),
      ..."abcdefghijklmnopqrstuvwxyz".split(""),
      ..."0123456789".split(""),
    ];
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
    const getToToken = getShuffledArr([...assetList])[0];

    setToToken({
      name: getToToken.name,
      address: getToToken.address,
    });
  }, []);

  return (
    <Modal
      isOpen={depositIbcModalOpen.isOpen}
      onClose={() => setDepositIbcModalOpen({ isOpen: false })}
      blockScrollOnMount={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent maxW={{ md: "2xl" }} borderRadius="2xl" p={6} mx={2}>
        <ModalHeader fontSize="2xl" fontWeight="bold" p={0} mb={6}>
          Deposit IBC Asset
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
              maxW={64}
              height="1.5em"
              fontWeight="semibold"
              color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
              whiteSpace="break-spaces"
              overflow="hidden"
              title={fromToken.address || "(native)"}
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
              {fromToken.name}
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
            <Text
              maxW={64}
              height="1.5em"
              fontWeight="semibold"
              color={useColorModeValue("blackAlpha.500", "whiteAlpha.500")}
              whiteSpace="break-spaces"
              overflow="hidden"
              title={toToken.address || "(native)"}
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
              {toToken.name}
            </Text>
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
          leftIcon={<IoWallet />}
          w="full"
          isDisabled={inputValue === "0" || inputValue === "" ? true : false}
        >
          Connect Wallet
        </Button>
      </ModalContent>
    </Modal>
  );
}
