"use client";

import { Box, Button, Divider, Flex, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Suspense, useEffect } from "react";
import { FiCopy, FiCreditCard } from "react-icons/fi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { useRecoilValueLoadable } from "recoil";
import { coinByDenomSelector, useIndexerInfos } from "../../../state";
import { WYND_TOKEN_ADDRESS } from "../../../utils";
import { truncate } from "../../../utils/text";
import { microamountToAmount } from "../../../utils/tokens";

export default function ConnectWalletButton() {
  const { onCopy, hasCopied, setValue } = useClipboard("");
  const { address, openView, isWalletConnected, username, disconnect, currentChainRecord } = useWallet();

  const loadableBalance = useRecoilValueLoadable(
    coinByDenomSelector({ address, serializedChainRecord: JSON.stringify(currentChainRecord) }),
  );

  const { cw20Balances } = useIndexerInfos({ fetchCw20Balances: true });

  const wyndBalance = cw20Balances.find((asset) => asset.address === WYND_TOKEN_ADDRESS)?.balance;

  useEffect(() => {
    setValue(address || "");
  }, [address, setValue]);

  return isWalletConnected && loadableBalance ? (
    <Button
      bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
      _hover={{
        bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
      }}
      as={Box}
      display={"block"}
      pr={0}
      w="full"
      h="auto"
      p={1}
    >
      <Suspense fallback={<Text>Loading...</Text>}>
        <Box>
          <Flex alignItems="center" justifyContent="space-between" gap={2} w="full">
            <Flex alignItems="center" justifyContent="center" gap={4} pl="4">
              <Box fontSize="sm">
                <Text fontSize="lg">{truncate(username || "", 8)}</Text>
                <Divider borderBottomWidth="3px" />
                <Text fontSize="sm">
                  {loadableBalance.state === "hasValue"
                    ? `${Number(loadableBalance.contents.amount).toFixed(2)} ${
                        loadableBalance.contents.denom
                      }`
                    : "0"}{" "}
                </Text>
                <Text fontSize="sm">{microamountToAmount(wyndBalance || 0, 6)} WYND</Text>
              </Box>
              <Flex direction="column">
                <Tooltip label={hasCopied ? "Copied!" : "Copy wallet address"}>
                  <Button
                    bgColor={"wynd.gray.100"}
                    onClick={onCopy}
                    sx={{ padding: 0, margin: 1 }}
                    size="xs"
                    m={0}
                  >
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
          </Flex>
        </Box>
      </Suspense>
      <Box></Box>
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
