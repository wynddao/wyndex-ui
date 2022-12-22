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
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { KeplrClient, KeplrExtensionWallet } from "@cosmos-kit/keplr";
import { useWallet } from "@cosmos-kit/react";
import { Asset, IBCAsset } from "@wynddao/asset-list";
import { CosmWasmClient } from "cosmwasm";
import { useEffect, useState } from "react";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIndexerInfos, useToast } from "../../state";
import { depositIbcModalAtom } from "../../state/recoil/atoms/modal";
import { ChainInfo, chainInfos } from "../../utils/chaindata/keplr/chainInfos";
import { getAssetList } from "../../utils/getAssetList";
import { amountToMicroamount, microamountToAmount } from "../../utils/tokens";

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
  const { txToast } = useToast();
  const { address } = useWallet();
  const [depositIbcModalOpen, setDepositIbcModalOpen] = useRecoilState(depositIbcModalAtom);
  const { ibcBalanceSelector, refreshIbcBalances } = useIndexerInfos({ fetchIbcBalances: true });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositIbcData, setDepositIbcData] = useState<DepositIbcData>();
  const [inputValue, setInputValue] = useState<string>("");
  const [keplrClient, setKeplrClient] = useState<KeplrClient>();
  const [nativeAddress, setNativeAddress] = useState<string>("");

  const assets: readonly Asset[] = getAssetList().tokens;
  const ibcAssets: readonly IBCAsset[] = assets.filter((asset): asset is IBCAsset => asset.tags !== "cw20");
  const asset = ibcAssets.find((asset) => asset.chain_id === depositIbcModalOpen.asset);

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

        const depositIbcData: DepositIbcData = {
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
        setDepositIbcData(depositIbcData);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [address, asset, chainInfo, ibcBalance?.amount, nativeAddress]);

  async function submitDepositIbc() {
    if (!keplrClient || !chainInfo || !asset || !address || !nativeAddress || !inputValue) return;

    setIsSubmitting(true);

    try {
      const signer = keplrClient.getOfflineSigner(chainInfo.chainId);
      const gasPrice = GasPrice.fromString(
        String(
          chainInfo.feeCurrencies.find((currency) => currency.coinMinimalDenom === asset.denom)?.gasPriceStep
            ?.average,
        ) + asset.denom,
      );
      const client = await SigningStargateClient.connectWithSigner(chainInfo.rpc, signer, { gasPrice });

      const coinToSend = { denom: asset.denom, amount: amountToMicroamount(inputValue, asset.decimals) };
      const OneDayFromNowInSeconds = Math.floor(Date.now() / 1000) + 86400;

      await txToast(() =>
        client.sendIbcTokens(
          nativeAddress,
          address,
          coinToSend,
          "transfer",
          asset.channel,
          undefined,
          OneDayFromNowInSeconds,
          "auto",
        ),
      );

      refreshIbcBalances();
      setDepositIbcModalOpen({ isOpen: false });
    } catch (error) {
      console.error({ error });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={depositIbcModalOpen.isOpen}
      onClose={() => setDepositIbcModalOpen({ isOpen: false })}
      blockScrollOnMount={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent maxW={{ md: "2xl" }} borderRadius="2xl" p={6} mx={2} bgColor="wynd.base.subBg">
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
          isLoading={isSubmitting}
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
