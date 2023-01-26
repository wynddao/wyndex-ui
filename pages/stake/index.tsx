"use client";
import { Box, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { StakeHeader } from "../../components/Dao/Stake/StakeHeader";
import { MyTokens } from "../../components/Dao/Stake/MyTokens";
import { Rewards } from "../../components/Dao/Stake/Rewards";
import { useWallet } from "@cosmos-kit/react";
import { useDaoStakingInfos } from "../../state/hooks/useDaoStakingInfos";

export default function Page() {
  const { address: walletAddress } = useWallet();
  const { walletStakedPower, walletStakedTokens, totalStakedValue, totalStaked, treasuryBalance, rewards } =
    useDaoStakingInfos({
      fetchWalletStakedValue: true,
      fetchTotalStakedValue: true,
    });
  return (
    <>
      <Head>
        <title>WYND DEX | Stake Tokens</title>
      </Head>
      <Box p="4">
        <Heading pt="8" mb="8">
          Stake Tokens
        </Heading>
        <StakeHeader totalStaked={totalStaked} treasuryBalance={treasuryBalance}/>
        {walletAddress && (
          <MyTokens
            walletAddress={walletAddress}
            walletStakedPower={walletStakedPower}
            walletStakedTokens={walletStakedTokens}
            totalStakedValue={totalStakedValue || 0}
          />
        )}
        <Rewards rewards={rewards} address={walletAddress} />
      </Box>
    </>
  );
}
