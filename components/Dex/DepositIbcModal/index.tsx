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
import { useState } from "react";
import { RiArrowDownFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { useIndexerInfos, useToast } from "../../../state";
import { depositIbcModalAtom } from "../../../state/recoil/atoms/modal";
import { getTransferIbcData } from "../../../state/recoil/selectors/ibc";
import { getIbcSigningDataSelector } from "../../../state/recoil/selectors/ibcSigningData";
import { amountToMicroamount } from "../../../utils/tokens";

export default function DepositIbcModal() {
  const icon = useBreakpointValue({ base: RiArrowDownFill, md: RiArrowRightFill });
  const { txToast } = useToast();
  const { address, currentWalletName } = useWallet();
  const [depositIbcModalOpen, setDepositIbcModalOpen] = useRecoilState(depositIbcModalAtom);
  const { refreshIbcBalances } = useIndexerInfos({ fetchIbcBalances: true });

  const loadableIbcSigningData = useRecoilValueLoadable(
    getIbcSigningDataSelector(depositIbcModalOpen.chainId ?? "", currentWalletName),
  );
  const loadableTransferIbcData = useRecoilValueLoadable(
    getTransferIbcData({
      chainId: depositIbcModalOpen.chainId,
      address,
      nativeAddress:
        loadableIbcSigningData.state === "hasValue" ? loadableIbcSigningData.contents.nativeAddress : null,
    }),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  async function submitDepositIbc() {
    if (loadableIbcSigningData.state !== "hasValue") return;
    const { feeAsset, ibcSigningClient, nativeAddress } = loadableIbcSigningData.contents;
    if (!feeAsset || !ibcSigningClient || !nativeAddress || !address || !inputValue) return;

    try {
      setIsSubmitting(true);

      const coinToSend = {
        denom: feeAsset.denom,
        amount: amountToMicroamount(inputValue, feeAsset.decimals),
      };
      const OneDayFromNowInSeconds = Math.floor(Date.now() / 1000) + 86400;

      await txToast(() =>
        ibcSigningClient.sendIbcTokens(
          nativeAddress,
          address,
          coinToSend,
          "transfer",
          feeAsset.channel,
          undefined,
          OneDayFromNowInSeconds,
          "auto",
        ),
      );

      setDepositIbcModalOpen({ isOpen: false });
      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshIbcBalances();
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
              title={
                loadableTransferIbcData.state === "hasValue"
                  ? loadableTransferIbcData.contents.nativeChain?.userAddress
                  : "loading address..."
              }
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
              {loadableTransferIbcData.state === "hasValue"
                ? loadableTransferIbcData.contents.nativeChain?.tokenName
                : "loading token..."}
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
              title={
                loadableTransferIbcData.state === "hasValue"
                  ? loadableTransferIbcData.contents.ibcChain?.userAddress
                  : "loading address..."
              }
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
              {loadableTransferIbcData.state === "hasValue"
                ? loadableTransferIbcData.contents.ibcChain?.tokenName
                : "loading token..."}
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
              {loadableTransferIbcData.state === "hasValue"
                ? loadableTransferIbcData.contents.nativeChain?.balance
                : "loading balance..."}
              &ensp;
              {loadableTransferIbcData.state === "hasValue"
                ? loadableTransferIbcData.contents.nativeChain?.tokenName
                : "loading token..."}
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
            max={parseFloat(
              loadableTransferIbcData.state === "hasValue"
                ? loadableTransferIbcData.contents.nativeChain?.balance ?? "0"
                : "0",
            )}
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
              onClick={() =>
                loadableTransferIbcData.state === "hasValue"
                  ? setInputValue(loadableTransferIbcData.contents.nativeChain?.balance ?? "0")
                  : () => {}
              }
            >
              MAX
            </Button>
          </NumberInput>
        </Box>
        <Button
          h={14}
          colorScheme="gray"
          bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
          _hover={{
            bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
            ":disabled": {
              bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
              cursor: "initial",
            },
          }}
          _disabled={{
            bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
            cursor: "initial",
          }}
          isLoading={isSubmitting}
          isDisabled={
            inputValue === "0" ||
            inputValue === "" ||
            (loadableTransferIbcData.state === "hasValue" &&
              parseFloat(inputValue) > (loadableTransferIbcData.contents.nativeChain?.balance ?? 0))
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
