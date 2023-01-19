import { Box, Button, Flex, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";
import { FiCopy, FiCreditCard } from "react-icons/fi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../state";
import { getAssetByDenom } from "../../utils/assets";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";

export default function ConnectWalletButton() {
  const { onCopy, hasCopied, setValue } = useClipboard("");
  const {
    address: walletAddress,
    openView,
    isWalletConnected,
    username,
    disconnect,
    currentChainRecord,
  } = useWallet();
  const { ibcBalanceSelector, cw20BalanceSelector } = useIndexerInfos({});

  const feeAsset = getAssetByDenom(currentChainRecord?.assetList?.assets[0].base || "");
  const feeBalance = useRecoilValue(
    "token_address" in feeAsset
      ? cw20BalanceSelector(feeAsset.token_address)
      : ibcBalanceSelector(feeAsset.denom),
  );

  useEffect(() => {
    setValue(walletAddress || "");
  }, [setValue, walletAddress]);

  return isWalletConnected ? (
    <Button
      bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
      _hover={{
        bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
      }}
      as={Box}
      pr={0}
      w="full"
      h="auto"
      p={1}
    >
      <Flex alignItems="center" justifyContent="space-between" gap={2} w="full">
        <Flex alignItems="center" justifyContent="center" gap={4} pl="4">
          <Icon fontSize="1.25em" as={FiCreditCard} />
          <Box fontSize="sm">
            <Text>{username}</Text>
            <Text>
              {microamountToAmount(feeBalance, feeAsset.decimals, 2)} {microdenomToDenom(feeAsset.denom)}
            </Text>
          </Box>
        </Flex>
        <Flex direction="column">
          <Tooltip label={hasCopied ? "Copied!" : "Copy wallet address"}>
            <Button bgColor={"wynd.gray.100"} onClick={onCopy} sx={{ padding: 0, margin: 1 }} size="xs" m={0}>
              <Icon fontSize="xs" as={FiCopy} />
            </Button>
          </Tooltip>
          <Tooltip label="Disconnect wallet">
            <Button
              bgColor={"wynd.gray.100"}
              onClick={disconnect}
              sx={{ padding: 0, margin: 1 }}
              size="xs"
              m={0}
            >
              <Icon fontSize="xs" as={VscDebugDisconnect} />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Button>
  ) : (
    <Button
      onClick={openView}
      w="full"
      alignItems="center"
      justifyContent="center"
      gap="0.5rem"
      display="flex"
      bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
      _hover={{
        bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
      }}
    >
      <Icon fontSize="lg" as={FiCreditCard} />
      <Text fontSize="lg">Connect wallet</Text>
    </Button>
  );
}
