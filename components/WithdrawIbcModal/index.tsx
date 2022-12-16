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
import { Asset } from "@wynddao/asset-list";
import { useEffect, useState } from "react";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../state";
import { withdrawIbcModalAtom } from "../../state/recoil/atoms/modal";
import { getNativeBalance } from "../../utils";
import { getAssetList } from "../../utils/getAssetList";
import { microamountToAmount } from "../../utils/tokens";

interface WithdrawIbcData {
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

export default function WithdrawIbcModal() {
  const icon = useBreakpointValue({ base: RiArrowDownFill, md: RiArrowRightFill });
  const { address } = useWallet();
  const [withdrawIbcModalOpen, setWithdrawIbcModalOpen] = useRecoilState(withdrawIbcModalAtom);
  const { ibcBalanceSelector } = useIndexerInfos({});

  const [withdrawIbcData, setWithdrawIbcData] = useState<WithdrawIbcData>();
  const [inputValue, setInputValue] = useState<string>("");

  const assets: readonly Asset[] = getAssetList().tokens;
  const asset = assets.find((asset) => asset.name === withdrawIbcModalOpen.asset);
  const ibcBalance = useRecoilValue(ibcBalanceSelector(asset?.denom ?? ""));

  useEffect(() => {
    (async function updateFromToken() {
      if (!asset || !address) return;

      const nativeBalance = await getNativeBalance(address, asset.name);

      const withdrawIbcData: WithdrawIbcData = {
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
      setWithdrawIbcData(withdrawIbcData);
    })();
  }, [address, asset, ibcBalance?.amount]);

  async function submitWithdrawIbc() {
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
      isOpen={withdrawIbcModalOpen.isOpen}
      onClose={() => setWithdrawIbcModalOpen({ isOpen: false })}
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
              title={withdrawIbcData?.ibcChain?.userAddress}
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
              {withdrawIbcData?.ibcChain?.tokenName}
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
              title={withdrawIbcData?.nativeChain?.userAddress}
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
              {withdrawIbcData?.nativeChain?.tokenName}
            </Text>
          </GridItem>
        </Grid>
        <Text fontSize="xl" fontWeight="bold" mb={3}>
          Amount To Withdraw
        </Text>
        <Box borderRadius="2xl" border="1px solid" borderColor="wynd.neutral.800" px={4} py={6} mb={12}>
          <Text fontWeight="semibold" mr={4} mb={3}>
            Available balance:&ensp;
            <Text as="span" color={"wynd.cyan.500"}>
              {withdrawIbcData?.ibcChain?.balance}&ensp;{withdrawIbcData?.ibcChain?.tokenName}
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
            max={parseFloat(withdrawIbcData?.ibcChain?.balance ?? "0")}
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
              onClick={() => setInputValue(withdrawIbcData?.ibcChain?.balance ?? "0")}
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
            parseFloat(inputValue) > (withdrawIbcData?.ibcChain?.balance ?? 0)
              ? true
              : false
          }
          onClick={submitWithdrawIbc}
        >
          Withdraw
        </Button>
      </ModalContent>
    </Modal>
  );
}
