import { Text, Flex, Heading, Box, Grid, GridItem, Button, Input } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Coin, ExecuteResult } from "cosmwasm";
import { useState } from "react";
import { useLsdInfos } from "../../../state/hooks/lsd/useLsdInfos";
import { BorderedBox } from "../../Dao/Stake/MyTokens/BorderedBox";
import { LsdSingleHeader } from "./LSDHeader";
import {
  useCw20UserInfos,
  useTokenInfo,
  LsdHooks,
  useToast,
  getBalanceByAsset,
  useIndexerInfos,
  Cw20Hooks,
} from "../../../state";
import { amountToMicroamount, microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import { FEE_DENOM } from "../../../utils";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { getAssetList } from "../../../utils/getAssetList";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { formatCurrency } from "../../../utils/currency";
import { APYCalc } from "./APYCalc";
import { UnstakingModal } from "./UnstakingModal";
import { lsdEntries } from "../Overview";
import ConnectWalletButton from "../../General/Sidebar/ConnectWalletButton";

export const LsdSingle = ({ id }: { id: string }) => {
  const lsdEntry = lsdEntries.find((el) => el.id === Number(id))!;
  const lsdContract = lsdEntry.contractAddr;

  // Wallet & LSD Infos
  const { address: walletAddress } = useWallet();
  const { config, exchange_rate, supply, validatorSet, claims, refreshClaims } = useLsdInfos(lsdContract);
  const { balance: _balance, refreshBalance } = useCw20UserInfos(config.token_contract);

  // Fetch AssetPrices to calculate TVL
  const { assetPrices } = useIndexerInfos({});
  const lsdAssetPrice = assetPrices.find((el) => el.asset === "ujuno")!;

  // Get assetlist to find decimals
  const assets = getAssetList().tokens;
  const lsdAsset = assets.find((el) => el.denom === lsdEntry.tokenDenom)!;

  // Get token symbol of wyLSD
  const { tokenSymbol, tokenName } = useTokenInfo(config.token_contract);
  const fromBalanceSelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: lsdAsset,
  });

  // fromBalance = Wallet Balance //? Possible todo, write one function for both swap & lsd balances
  const fromBalance = useRecoilValue(fromBalanceSelector);
  const refreshFromBalance = useRecoilRefresher_UNSTABLE(fromBalanceSelector);
  const balance = microamountToAmount(_balance, 6);
  const currency = useRecoilValue(currencyAtom);

  // Toast hook for errors and success
  const { txToast } = useToast();

  // Loading state hooks
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  // Bond, Claim & Withdraw hooks
  const doBond = LsdHooks.useBond({
    contractAddress: lsdContract,
    sender: walletAddress || "",
  });
  const doWithdraw = Cw20Hooks.useSend({
    contractAddress: config.token_contract,
    sender: walletAddress || "",
  });
  const doClaim = LsdHooks.useClaim({
    contractAddress: lsdContract,
    sender: walletAddress || "",
  });

  /**
   * Bonding
   */
  const bond = async () => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult> => {
      const coin: Coin = {
        denom: "ujunox",
        amount: amountToMicroamount(Number(amount), lsdAsset.decimals),
      };
      const result = await doBond(undefined, undefined, [coin]);

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBalance();
      refreshFromBalance();
      return result;
    });
    setLoading(false);
  };

  // Render!
  return (
    <>
      <LsdSingleHeader supply={supply} />
      <Grid mt={4} templateColumns={{ base: "repeat(1fr)", md: "1fr 1fr 1fr 1fr 1fr" }} gap={8}>
        <GridItem colStart={{ base: 1, md: 2 }}>
          <BorderedBox p={0}>
            <Box py={4} display="flex" justifyContent="center" alignItems="center">
              <Flex justifyContent={"space-between"} flexDir="column" alignItems="center">
                <Text fontSize="md" fontWeight="semibold" display="inline-block">
                  Your staked amount
                </Text>
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="wynd.cyan.500" display="inline-block">
                    {balance} ${tokenSymbol}
                  </Text>
                </Box>
              </Flex>
            </Box>
            {walletAddress && Number(balance) > 0 && (
              <>
                <Box w="100%">
                  <Button
                    borderBottomRadius={0}
                    onClick={() => setModalOpen(true)}
                    variant="solid"
                    width="100%"
                  >
                    Unstake
                  </Button>
                </Box>
                <Box w="100%">
                  <Button
                    borderTopRadius={0}
                    bgGradient="linear(to-l, wynd.green.300, wynd.cyan.300)"
                    _hover={{
                      bgGradient: "linear(to-l, wynd.green.200, wynd.cyan.200)",
                    }}
                    onClick={() => setModalOpen(true)}
                    variant="solid"
                    width="100%"
                  >
                    Quick Burn
                  </Button>
                </Box>
              </>
            )}
          </BorderedBox>
        </GridItem>
        <BorderedBox py={4} display="flex" justifyContent="center" alignItems="center">
          <Flex justifyContent={"space-between"} flexDir="column" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" display="inline-block">
              Available to stake
            </Text>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
                {microamountToAmount(fromBalance.amount, lsdAsset.decimals)}{" "}
                {microdenomToDenom(fromBalance.denom)}
              </Text>
            </Box>
          </Flex>
        </BorderedBox>
        <BorderedBox py={4} display="flex" justifyContent="center" alignItems="center">
          <Flex justifyContent={"space-between"} flexDir="column" alignItems="center">
            <Text fontSize="md" fontWeight="semibold" display="inline-block">
              Current APY
            </Text>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="wynd.purple.400" display="inline-block">
                <APYCalc validatorSet={validatorSet} lsdCommission={Number(config.commission)} />
              </Text>
            </Box>
          </Flex>
        </BorderedBox>
      </Grid>
      <Grid templateColumns={{ base: "repeat(1fr)", md: "1fr 1fr 1fr" }} mt={8} gap={8}>
        <GridItem colStart={{ base: 1, md: 2 }}>
          <BorderedBox bgImageActive={true} mb={8}>
            <Grid templateColumns={{ base: "repeat(1fr)", md: "1fr 2fr" }}>
              <Flex alignItems="center" justifyContent="center">
                <Text fontSize="xl" fontWeight="bold" color="wynd.green.500" display="inline-block">
                  Stake now
                </Text>
              </Flex>
              <GridItem my={3}>
                <Flex justifyContent="end">
                  <Flex gap="0.5rem" alignSelf="end" alignItems="center" justifyContent="center">
                    <Text color="wynd.neutral.500" textTransform="uppercase" fontSize="xs">
                      Available {microamountToAmount(fromBalance.amount, lsdAsset.decimals)}{" "}
                      {microdenomToDenom(fromBalance.denom)}
                    </Text>
                    <Button
                      variant="ghost"
                      fontSize="xs"
                      textTransform="uppercase"
                      size="xs"
                      onClick={() => setAmount(microamountToAmount(fromBalance.amount, lsdAsset.decimals))}
                    >
                      Max
                    </Button>
                    <Button
                      variant="ghost"
                      fontSize="xs"
                      textTransform="uppercase"
                      size="xs"
                      onClick={() =>
                        setAmount(microamountToAmount(Number(fromBalance.amount) / 2, lsdAsset.decimals))
                      }
                    >
                      Half
                    </Button>
                  </Flex>
                </Flex>
                <Flex justifyContent="end">
                  <Flex alignItems="center" gap="0.5rem">
                    <Flex position="relative">
                      <Input
                        textAlign="right"
                        border="none"
                        _focus={{ bg: "whiteAlpha.200" }}
                        _focus-visible={{ borderColor: "none", boxShadow: "none" }}
                        _hover={{ bg: "whiteAlpha.200" }}
                        p="0.2rem"
                        bg="whiteAlpha.100"
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <Text
                        position="absolute"
                        right="0"
                        bottom="-4"
                        fontSize="10px"
                        color="wynd.neutral.500"
                      >
                        ≈ {}
                        {formatCurrency(
                          currency,
                          (
                            Number(amount) *
                              (currency === "EUR" ? lsdAssetPrice.priceInEur : lsdAssetPrice.priceInUsd) || 0
                          ).toString(),
                        )}
                      </Text>
                    </Flex>
                    <Text textTransform="uppercase" minW="55px">
                      $JUNO
                    </Text>
                  </Flex>
                </Flex>
              </GridItem>
            </Grid>
          </BorderedBox>
          <Flex
            bg="whiteAlpha.100"
            backdropFilter="blur(5px)"
            borderRadius="xl"
            p={6}
            maxW={{ lg: "600px" }}
            minW={{ lg: "600px" }}
            margin={{ lg: "0 auto" }}
            border="0"
            flexFlow="column"
            gap="1rem"
            alignItems="center"
          >
            <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
              <Text color={"wynd.neutral.500"}>You will recieve</Text>
              <Text>
                <Text as="span" textTransform="uppercase" fontSize="sm" color="wynd.gray.600">
                  {Number(amount) / Number(exchange_rate) || 0} {tokenSymbol}
                </Text>
              </Text>
            </Flex>
            <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
              <Text color={"wynd.neutral.500"}>Exchange rate</Text>
              <Text>
                {1 * Number(exchange_rate)} {microdenomToDenom(lsdAsset.denom)} = 1 {tokenSymbol}
              </Text>
            </Flex>
            <Flex w="full" justify="space-between" fontWeight="bold" fontSize={{ lg: "lg" }}>
              <Text color={"wynd.neutral.500"}>Commission</Text>
              <Text>{Number(config.commission) * 100}%</Text>
            </Flex>
          </Flex>
          <Box mt={3}>
            {walletAddress ? (
              <Button
                w="100%"
                p={4}
                fontSize="xl"
                bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
                _hover={{
                  bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                }}
                onClick={() => bond()}
                isLoading={loading}
              >
                Stake
              </Button>
            ) : (
              <ConnectWalletButton />
            )}
          </Box>
        </GridItem>
      </Grid>
      <UnstakingModal
        exchangeRate={Number(exchange_rate)}
        tokenName={tokenName}
        removeableTokens={Number(balance)}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        doWithdraw={doWithdraw}
        refreshBalance={refreshBalance}
        refreshFromBalance={refreshFromBalance}
        claims={claims}
        refreshClaims={refreshClaims}
        doClaim={doClaim}
      />
    </>
  );
};
