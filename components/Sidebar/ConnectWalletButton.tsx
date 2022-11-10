"use client";

import { Box, Button, Flex, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Coin } from "cosmwasm";
import { useEffect } from "react";
import { FiCopy, FiCreditCard } from "react-icons/fi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { useRecoilValue } from "recoil";
import { coinByDenomSelector } from "../../state";
import { microamountToAmount, microdenomToDenom } from "../../utils/tokens";

export default function ConnectWalletButton() {
  const walletManager = useWallet();
  const { onCopy, hasCopied, setValue } = useClipboard("");

  const { address, openView, isWalletConnected, username, disconnect, currentChainRecord } = walletManager;

  const microdenom = currentChainRecord?.assetList?.assets[0]?.base || "";
  const denom = microdenomToDenom(microdenom);
  const chainUnits = currentChainRecord?.assetList?.assets[0].denom_units;
  const denomUnit = chainUnits?.find((unit) => unit.denom.toLowerCase() === denom.toLowerCase());
  const decimals = denomUnit?.exponent || 0;
  const microBalance = useRecoilValue(coinByDenomSelector({ address, denom: microdenom }));
  const balance: Coin = { denom, amount: microamountToAmount(microBalance.amount, decimals) };

  useEffect(() => {
    setValue(address || "");
  }, [address]);

  return isWalletConnected && balance ? (
    <Button as={Box} pr={0} w="full" h="auto">
      <Flex alignItems="center" justifyContent="space-between" gap={2} w="full">
        <Icon fontSize="1.25em" as={FiCreditCard} />
        <Box>
          <Text>{username}</Text>
          <Text>
            {balance.amount} {balance.denom}
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
