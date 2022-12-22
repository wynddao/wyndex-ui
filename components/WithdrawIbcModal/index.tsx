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
import { KeplrClient, KeplrExtensionWallet } from "@cosmos-kit/keplr";
import { useWallet } from "@cosmos-kit/react";
import { Asset, IBCAsset } from "@wynddao/asset-list";
import { CosmWasmClient } from "cosmwasm";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { useEffect, useState } from "react";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIndexerInfos, useToast } from "../../state";
import { withdrawIbcModalAtom } from "../../state/recoil/atoms/modal";
import { getNativeBalance } from "../../utils";
import { ChainInfo, chainInfos } from "../../utils/chaindata/keplr/chainInfos";
import { getAssetList } from "../../utils/getAssetList";
import { amountToMicroamount, microamountToAmount } from "../../utils/tokens";

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
  const { txToast } = useToast();
  const { address, getSigningStargateClient } = useWallet();
  const [withdrawIbcModalOpen, setWithdrawIbcModalOpen] = useRecoilState(withdrawIbcModalAtom);
  const { ibcBalanceSelector, refreshIbcBalances } = useIndexerInfos({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawIbcData, setWithdrawIbcData] = useState<WithdrawIbcData>();
  const [inputValue, setInputValue] = useState<string>("");
  const [keplrClient, setKeplrClient] = useState<KeplrClient>();
  const [nativeAddress, setNativeAddress] = useState<string>("");

  const assets: readonly Asset[] = getAssetList().tokens;
  const ibcAssets: readonly IBCAsset[] = assets.filter((asset): asset is IBCAsset => asset.tags !== "cw20");
  const asset = ibcAssets.find((asset) => asset.chain_id === withdrawIbcModalOpen.asset);

  const chainInfo: ChainInfo | undefined = chainInfos[asset?.chain_id || ""];
  const ibcBalance = useRecoilValue(ibcBalanceSelector(asset?.juno_denom ?? ""));

  useEffect(() => {
    (async function updateKeplrClientAndAddress() {
      if (!chainInfo) return;

      try {
        const keplrWallet = new KeplrExtensionWallet(
          { name: "keplr-extension", prettyName: "Keplr", mode: "extension", mobileDisabled: true },
          { [chainInfo.chainName]: { rpc: [chainInfo.rpc] } },
        );
        const keplrClient = await keplrWallet.fetchClient();
        setKeplrClient(keplrClient);

        await keplrClient.client.experimentalSuggestChain(chainInfo);

        const { address: nativeAddress } = await keplrClient.getAccount(chainInfo.chainId);
        setNativeAddress(nativeAddress);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [chainInfo]);

  useEffect(() => {
    (async function updateFromToken() {
      if (!chainInfo || !asset || !address || !nativeAddress) return;

      try {
        const cwClient = await CosmWasmClient.connect(chainInfo.rpc);
        const nativeBalance = await cwClient.getBalance(nativeAddress, asset.denom);

        const withdrawIbcData: WithdrawIbcData = {
          nativeChain: {
            tokenName: asset.name,
            userAddress: nativeAddress,
            balance: microamountToAmount(nativeBalance?.amount ?? 0, asset.decimals),
          },
          ibcChain: {
            tokenName: "IBC/" + asset.name,
            userAddress: address,
            balance: microamountToAmount(ibcBalance?.amount ?? 0, asset.decimals),
          },
        };
        setWithdrawIbcData(withdrawIbcData);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [address, asset, chainInfo, ibcBalance?.amount, nativeAddress]);

  async function submitWithdrawIbc() {
    if (!keplrClient || !chainInfo || !asset || !address || !nativeAddress || !inputValue) return;

    setIsSubmitting(true);

    try {
      const client = await getSigningStargateClient();
      if (!client) return;

      const coinToSend = { denom: asset.juno_denom, amount: amountToMicroamount(inputValue, asset.decimals) };
      const OneDayFromNowInSeconds = Math.floor(Date.now() / 1000) + 86400;

      await txToast(() =>
        client.sendIbcTokens(
          address,
          nativeAddress,
          coinToSend,
          "transfer",
          asset.juno_channel,
          undefined,
          OneDayFromNowInSeconds,
          "auto", // Error auto gas, but no auto is used
        ),
      );

      refreshIbcBalances();
      setWithdrawIbcModalOpen({ isOpen: false });
    } catch (error) {
      console.error({ error });
    } finally {
      setIsSubmitting(false);
    }
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
          isLoading={isSubmitting}
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
