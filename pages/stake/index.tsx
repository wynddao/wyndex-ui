"use client";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { StakeHeader } from "../../components/Dao/Stake/StakeHeader";
import { MyTokens } from "../../components/Dao/Stake/MyTokens";
import { Rewards } from "../../components/Dao/Stake/Rewards";
import { useWallet } from "@cosmos-kit/react";
import { useDaoStakingInfos } from "../../state/hooks/useDaoStakingInfos";
import { BorderedBox } from "../../components/Dao/Stake/MyTokens/BorderedBox";
import ConnectWalletButton from "../../components/General/Sidebar/ConnectWalletButton";

export default function Page() {
  const { address: walletAddress } = useWallet();
  const {
    walletStakedPower,
    walletStakedTokens,
    totalStakedValue,
    totalStaked,
    treasuryBalance,
    rewards,
    vestedBalance,
    claims,
    claimsAvailable,
    claimsPending,
  } = useDaoStakingInfos({
    fetchWalletStakedValue: true,
    fetchTotalStakedValue: true,
    fetchClaims: true,
  });
  return (
    <>
      <Head>
        <title>WYND DEX | Stake Tokens</title>
      </Head>
      <Box p="4">
        <StakeHeader totalStaked={totalStaked} treasuryBalance={treasuryBalance} />
        {walletAddress ? (
          <>
            <MyTokens
              walletAddress={walletAddress}
              walletStakedPower={walletStakedPower}
              walletStakedTokens={walletStakedTokens}
              totalStakedValue={totalStakedValue || 0}
              vestedBalance={vestedBalance}
              claims={claims}
              claimsAvailable={claimsAvailable}
              claimsPending={claimsPending}
            />
            <Rewards rewards={rewards} address={walletAddress} />
          </>
        ) : (
          <Box mt="4">
            <BorderedBox bgImage={false}>
              <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                <Box>
                  <ConnectWalletButton />
                </Box>
              </Flex>
            </BorderedBox>
          </Box>
        )}
      </Box>
    </>
  );
}
