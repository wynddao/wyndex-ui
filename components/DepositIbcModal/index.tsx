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
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { depositIbcModalAtom } from "../../state/recoil/atoms/modal";
import { getAsset, getIbcBalance, getNativeBalance } from "../../utils";
import { microamountToAmount } from "../../utils/tokens";

interface DepositIbcData {
  readonly nativeChain?: {
    readonly tokenName?: string;
    readonly userAddress?: string;
    readonly balance?: string;
  };
  readonly ibcChain?: {
    readonly tokenName?: string;
    readonly userAddress?: string;
    readonly balance?: string;
  };
}

export default function DepositIbcModal() {
  const icon = useBreakpointValue({ base: RiArrowDownFill, md: RiArrowRightFill });
  const { address } = useWallet();
  const [depositIbcModalOpen, setDepositIbcModalOpen] = useRecoilState(depositIbcModalAtom);

  const [depositIbcData, setDepositIbcData] = useState<DepositIbcData>();
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    (async function updateFromToken() {
      if (!depositIbcModalOpen.asset || !address) return;

      const asset = await getAsset(depositIbcModalOpen.asset);
      const nativeBalance = await getNativeBalance(address, asset.name);
      const ibcBalance = await getIbcBalance(address, asset.name);

      const depositIbcData: DepositIbcData = {
        nativeChain: {
          tokenName: asset.name,
          userAddress: address, // TODO load address from native chain using keplr/cosmostation
          balance: microamountToAmount(nativeBalance?.amount ?? 0, asset.decimals),
        },
        ibcChain: {
          tokenName: "IBC/" + asset.name,
          userAddress: address,
          balance: microamountToAmount(ibcBalance?.amount ?? 0, asset.decimals),
        },
      };
      setDepositIbcData(depositIbcData);
    })();
  }, [address, depositIbcModalOpen.asset]);

  async function submitDepositIbc() {
    // TODO get data from rest api and use keplr or cosmostation as needed
    /* if (!address) return;

      try {
        const chosenDenom = "uosmo";
        const chainName = "Osmosis Testnet";
        const chainEndpoint = "https://rpc-test.osmosis.zone:443";
        const keplrWallet = new KeplrExtensionWallet(
          { name: "keplr-extension", prettyName: "Keplr", mode: "extension", mobileDisabled: true },
          { [chainName]: { rpc: [chainEndpoint] } },
        );

        const keplrClient = await keplrWallet.fetchClient();
        const { address: chosenAddress } = await keplrClient.getAccount("osmo-test-4");

        const signer = keplrClient.client.getOfflineSigner("osmo-test-4");
        const client = await SigningStargateClient.connectWithSigner(chainEndpoint, signer, {
          gasPrice: GasPrice.fromString("0.05uosmo"),
        });
        const res = await client.sendIbcTokens(
          chosenAddress,
          address,
          { denom: chosenDenom, amount: "15" },
          "transfer",
          "channel-1111",
          undefined,
          1670938601,
          "auto",
        );
        console.log({ res });
      } catch (error) {
        console.error({ error });
      } */
  }

  return (
    <Modal
      isOpen={depositIbcModalOpen.isOpen}
      onClose={() => setDepositIbcModalOpen({ isOpen: false })}
      blockScrollOnMount={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent
        maxW={{ md: "2xl" }}
        borderRadius="2xl"
        p={6}
        mx={2}
        bgColor="var(--chakra-colors-chakra-body-bg)"
      >
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
          <GridItem border="1px solid" borderColor={"wynd.neutral.800"} borderRadius="2xl" p={4}>
            <Text fontWeight="semibold" mr={4}>
              From
            </Text>
            <Text
              maxW={64}
              height="1.5em"
              fontWeight="semibold"
              color={"wynd.neutral.800"}
              whiteSpace="break-spaces"
              overflow="hidden"
              title={depositIbcData?.nativeChain?.userAddress}
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
              {depositIbcData?.nativeChain?.tokenName}
            </Text>
          </GridItem>
          <GridItem display="flex" justifyContent="center" alignItems="center" p={2}>
            <Icon as={icon} color={"wynd.neutral.800"} />
          </GridItem>
          <GridItem border="1px solid" borderColor={"wynd.neutral.800"} borderRadius="2xl" p={4}>
            <Text fontWeight="semibold" mr={4}>
              To
            </Text>
            <Text
              maxW={64}
              height="1.5em"
              fontWeight="semibold"
              color={"wynd.neutral.800"}
              whiteSpace="break-spaces"
              overflow="hidden"
              title={depositIbcData?.ibcChain?.userAddress}
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
              {depositIbcData?.ibcChain?.tokenName}
            </Text>
          </GridItem>
        </Grid>
        <Text fontSize="xl" fontWeight="bold" mb={3}>
          Amount To Deposit
        </Text>
        <Box borderRadius="2xl" border="1px solid" borderColor="wynd.neutral.800" px={4} py={6} mb={12}>
          <Text fontWeight="semibold" mr={4} mb={3}>
            Available balance:&ensp;
            <Text as="span" color={"wynd.cyan.500"}>
              {depositIbcData?.nativeChain?.balance}&ensp;{depositIbcData?.nativeChain?.tokenName}
            </Text>
          </Text>
          <NumberInput
            size="lg"
            display="flex"
            alignItems="center"
            defaultValue={15}
            value={inputValue}
            bg={"wynd"}
            min={0}
            max={parseFloat(depositIbcData?.nativeChain?.balance ?? "0")}
            onChange={(value) => setInputValue(value)}
          >
            <NumberInputField fontWeight="semibold" letterSpacing="wide" />
            <Button
              position="absolute"
              zIndex={5}
              right={4}
              colorScheme="gray"
              size="xs"
              ml={2}
              _focus={{ outline: "none" }}
              onClick={() => setInputValue(depositIbcData?.nativeChain?.balance ?? "0")}
            >
              MAX
            </Button>
          </NumberInput>
        </Box>
        <Button
          h={14}
          colorScheme="gray"
          isDisabled={
            inputValue === "0" ||
            inputValue === "" ||
            parseFloat(inputValue) > (depositIbcData?.nativeChain?.balance ?? 0)
              ? true
              : false
          }
          onClick={submitDepositIbc}
        >
          Deposit
        </Button>
      </ModalContent>
    </Modal>
  );
}
