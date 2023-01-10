import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Show,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { Cw20Hooks, useCw20UserInfos, useToast } from "../../state";
import { PairInfo, PoolResponse } from "../../state/clients/types/WyndexPair.types";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { getNativeIbcTokenDenom } from "../../utils/assets";
import { formatCurrency } from "../../utils/currency";
import { microdenomToDenom } from "../../utils/tokens";
import TokenName from "../TokenName";
import druid from "./assets/druid.png";
import ManageLiquidityModal from "./ManageLiquidityModal";
import StartEarningModal from "./StartEarningModal";

interface PoolHeaderProps {
  readonly chainData: PoolResponse;
  readonly pairData: PairInfo;
  readonly walletAddress: string;
  readonly totalInFiat: number;
  readonly apr: {
    readonly unbonding_period: number;
    readonly apr: number;
  }[];
}

interface PoolHeaderUserProps {
  chainData: PoolResponse;
  pairData: PairInfo;
  totalFiatShares: any;
  walletAddress: string;
}

function PoolHeaderUserInfo({ chainData, pairData, totalFiatShares, walletAddress }: PoolHeaderUserProps) {
  const wyndexStake = pairData.staking_addr;
  //@ts-ignore
  const { allStakes } = useUserStakeInfos(wyndexStake, walletAddress);

  const { balance: lpBalance } = useCw20UserInfos(pairData.liquidity_token);
  const currency = useRecoilValue(currencyAtom);

  //  Add currently unstaking amounts
  const { pendingUnstaking } = useStakeInfos(pairData.staking_addr, true);

  const unstakesSum = pendingUnstaking.reduce((acc, obj) => {
    return acc + Number(obj.amount);
  }, 0);

  const allStakesSum = allStakes.reduce((acc: number, obj) => {
    return acc + Number(obj.stake);
  }, 0);

  const totalTokens = unstakesSum + allStakesSum + Number(lpBalance);
  const myShare = totalTokens / Number(chainData.total_share);
  const myFiatShare = myShare * totalFiatShares;

  return <span>{formatCurrency(currency, `${myFiatShare}`)}</span>;
}

export default function PoolHeader({
  chainData,
  pairData,
  walletAddress,
  totalInFiat,
  apr,
}: PoolHeaderProps) {
  const { txToast } = useToast();
  const { onOpen: onOpenLiquidity, isOpen: isLiquidityOpen, onClose: onCloseLiquidity } = useDisclosure();
  const { onOpen: onOpenBondings, isOpen: isBondingsOpen, onClose: onCloseBondings } = useDisclosure();
  const currency = useRecoilValue(currencyAtom);
  const { balance: lpBalance, refreshBalance } = useCw20UserInfos(pairData.liquidity_token);
  const [loading, setLoading] = useState<boolean>(false);
  const wyndexStake = pairData.staking_addr;
  const { infos } = useStakeInfos(wyndexStake);
  const { refreshBondings } = useUserStakeInfos(wyndexStake, walletAddress || "");
  const stake = Cw20Hooks.useSend({
    contractAddress: pairData.liquidity_token,
    sender: walletAddress ?? "",
  });

  const doStake = async (amount: number, duration: number) => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await stake({
        amount: amount.toString(),
        contract: wyndexStake,
        msg: btoa(`{"delegate": { "unbonding_period": ${duration}}}`),
      });
      onCloseBondings();

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBondings();
      refreshBalance();
      return result;
    });
    setLoading(false);
  };

  const pairNames = pairData.asset_infos.map((assetInfo, index) => {
    if (assetInfo.hasOwnProperty("native")) {
      // @ts-ignore
      return <span key={index}>{microdenomToDenom(getNativeIbcTokenDenom(assetInfo.native))}</span>;
    } else {
      // @ts-ignore
      return <TokenName key={index} address={assetInfo.token} />;
    }
  });

  return (
    <>
      <Head>
        {/* TODO: Pool Title */}
        <title>WYND DEX | Pool</title>
      </Head>
      <Box
        bg={"wynd.base.sidebar"}
        bgImage="url('/images/Vector.png')"
        bgPosition="right"
        bgRepeat="no-repeat"
        p={4}
        position="relative"
        overflow="hidden"
      >
        <Flex align="center" wrap="wrap" mb={6}>
          <Heading as="h2" fontWeight="extrabold" fontSize="2xl" wordBreak="break-word" mr={8} py={1}>
            Pool: {pairNames[0]} / {pairNames[1]}
          </Heading>
          {walletAddress && (
            <Flex align="center" wrap="wrap">
              <Button
                onClick={onOpenLiquidity}
                m={2}
                ml={0}
                mr={{ md: 4 }}
                bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
                _hover={{
                  bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                }}
              >
                Add/Remove Liquidity
              </Button>
            </Flex>
          )}
        </Flex>

        <SimpleGrid columns={{ md: 2 }} gap={{ base: 2, md: 4 }} maxW={{ lg: "50%" }}>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Pool Liquidity
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span>{formatCurrency(currency, `${totalInFiat}`)} </span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"}>
              Swap Fee
            </Text>
            <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
              <span>0.2%</span>
            </Text>
          </GridItem>
          <GridItem>
            <Text fontWeight="bold" color={"whiteAlpha.600"} mb={1}>
              My Shares:
            </Text>

            {walletAddress ? (
              <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight="extrabold" wordBreak="break-word">
                <PoolHeaderUserInfo
                  chainData={chainData}
                  pairData={pairData}
                  totalFiatShares={totalInFiat}
                  walletAddress={walletAddress}
                />
              </Text>
            ) : (
              <Text fontSize={{ base: "xl", sm: "xl" }} fontWeight="extrabold" wordBreak="break-word">
                <span>Not connected</span>
              </Text>
            )}
          </GridItem>
        </SimpleGrid>
        <Show breakpoint="(min-width: 1077px)">
          <Image
            src={druid}
            alt="Wynd druid"
            height={600}
            style={{ position: "absolute", right: 0, bottom: -320 }}
          />
        </Show>
      </Box>
      <ManageLiquidityModal
        walletAddress={walletAddress}
        poolData={chainData}
        data={pairData}
        isOpen={isLiquidityOpen}
        onClose={onCloseLiquidity}
        onOpenBondings={onOpenBondings}
      />
      <StartEarningModal
        doStake={doStake}
        isOpen={isBondingsOpen}
        balance={Number(lpBalance)}
        tokenName={<TokenName address={pairData.liquidity_token}></TokenName>}
        onClose={onCloseBondings}
        bondingInfos={infos}
        apr={apr}
        loading={loading}
      />
    </>
  );
}
