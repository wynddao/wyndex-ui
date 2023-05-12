"use client";
import { Box, Button, Divider, Flex, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useChain, useModalTheme, useWallet } from "@cosmos-kit/react";
import { Suspense, useEffect } from "react";
import { FiCopy, FiCreditCard } from "react-icons/fi";
import { VscDebugDisconnect } from "react-icons/vsc";
import { useRecoilValueLoadable } from "recoil";
import { coinByDenomSelector } from "../../../state";
import { cw20BalancesSelector } from "../../../state/recoil/selectors/clients/indexer";
import { INDEXER_API_ENDPOINT, WYND_TOKEN_ADDRESS } from "../../../utils";
import { microamountToAmount } from "../../../utils/tokens";

export default function ConnectWalletButton() {
  const { onCopy, hasCopied, setValue } = useClipboard("");
  const { address, openView, isWalletConnected, username, disconnect } = useChain("juno");
  const { setModalTheme } = useModalTheme();
  setModalTheme("dark");

  const loadableCw20Balance = useRecoilValueLoadable(
    cw20BalancesSelector({ apiUrl: INDEXER_API_ENDPOINT, params: [address] }),
  );

  useEffect(() => {
    setValue(address || "");
  }, [address, setValue]);

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      {isWalletConnected && loadableCw20Balance ? (
        <Button
          bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
          _hover={{
            bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
          }}
          as={Box}
          display={"block"}
          w="full"
          h="auto"
          px={2}
          py={1}
        >
          <Box>
            <Flex alignItems="center" justifyContent="space-between" gap={2} w="full">
              <Flex alignItems="center" justifyContent="flex-end" gap={2} w="full">
                <Box
                  w="full"
                  fontSize="sm"
                  textAlign="right"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  sx={{ wordWrap: "break-word" }}
                >
                  <Text fontSize="lg" textAlign="left">
                    {username}
                  </Text>
                  <Divider borderBottomWidth="1px" />
                  <Text fontSize="sm"></Text>
                  <Text fontSize="sm">
                    {" "}
                    {loadableCw20Balance.state === "hasValue"
                      ? `${Number(
                          microamountToAmount(
                            Number(
                              loadableCw20Balance.contents.find(
                                (asset) => asset.address === WYND_TOKEN_ADDRESS,
                              )?.balance,
                            ),
                            6,
                          ),
                        ).toFixed(2)} $WYND`
                      : "0"}{" "}
                  </Text>
                </Box>
                <Flex direction="column" gap={2}>
                  <Tooltip label={hasCopied ? "Copied!" : "Copy wallet address"}>
                    <Button bgColor={"wynd.gray.100"} onClick={onCopy} size="xs" p={0}>
                      <Icon fontSize="xs" as={FiCopy} />
                    </Button>
                  </Tooltip>
                  <Tooltip label="Disconnect wallet">
                    <Button bgColor={"wynd.gray.100"} onClick={disconnect} size="xs" p={0}>
                      <Icon fontSize="xs" as={VscDebugDisconnect} />
                    </Button>
                  </Tooltip>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Button>
      ) : (
        <Button
          onClick={openView}
          w="full"
          alignItems="center"
          justifyContent="center"
          gap="0.5rem"
          display="flex"
          bgGradient="linear(45deg, wynd.green.400, wynd.cyan.400)"
          _hover={{
            bgGradient: "linear-gradient(45deg, #4c8e48, #7ca66e)",
          }}
        >
          <Icon fontSize="lg" as={FiCreditCard} />
          <Text fontSize="lg">Connect wallet</Text>
        </Button>
      )}
    </Suspense>
  );
}
