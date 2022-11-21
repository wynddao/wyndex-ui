"use client";

import { Box, Button, Flex, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";
import { FiCopy, FiCreditCard } from "react-icons/fi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { useRecoilValueLoadable } from "recoil";
import { coinByDenomSelector } from "../../state";

export default function ConnectWalletButton() {
  const { onCopy, hasCopied, setValue } = useClipboard("");
  const { address, openView, isWalletConnected, username, disconnect, currentChainRecord } = useWallet();

  const loadableBalance = useRecoilValueLoadable(
    coinByDenomSelector({ address, serializedChainRecord: JSON.stringify(currentChainRecord) }),
  );

  useEffect(() => {
    setValue(address || "");
  }, [address, setValue]);

  return isWalletConnected && loadableBalance ? (
    <Button as={Box} pr={0} w="full" h="auto">
      <Flex alignItems="center" justifyContent="space-between" gap={2} w="full">
        <Icon fontSize="1.25em" as={FiCreditCard} />
        <Box>
          <Text>{username}</Text>
          <Text>
            {loadableBalance.state === "hasValue"
              ? `${loadableBalance.contents.amount} ${loadableBalance.contents.denom}`
              : "0"}
          </Text>
        </Box>
        <Flex direction="column">
          <Tooltip label={hasCopied ? "Copied!" : "Copy wallet address"}>
            <Button onClick={onCopy} sx={{ padding: 0 }} size="xs">
              <Icon fontSize="1em" as={FiCopy} />
            </Button>
          </Tooltip>
          <Tooltip label="Disconnect wallet">
            <Button onClick={disconnect} sx={{ padding: 0 }} size="xs">
              <Icon fontSize="1em" as={VscDebugDisconnect} />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    </Button>
  ) : (
    <Button onClick={openView} w="full">
      <Flex alignItems="center" justifyContent="space-around" w="full">
        <Icon fontSize="1.25em" as={FiCreditCard} />
        <Text>Connect wallet</Text>
      </Flex>
    </Button>
  );
}
