"use client";

import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";
import { Cw20Hooks } from "../../state";
import { PairInfo } from "../../state/clients/types/WyndexPair.types";
import { useCw20UserInfos } from "../../state/hooks/useCw20UserInfos";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import TokenName from "../TokenName";
import BoundingsTable from "./BoundingsTable";
import PendingBoundingsTable from "./PendingBoundingsTable";
import StartEarningModal from "./StartEarningModal";
import UnboundingsGrid from "./UnbondingsGrid";
import { ExecuteResult } from "cosmwasm";
import { useToast } from "../../state/hooks";
import PendingUnbondingsTable from "./PendingUnbondingsTable";
import { microamountToAmount } from "../../utils/tokens";

interface LiquidityMiningOptions {
  apr: {
    unbonding_period: number;
    apr: number;
  }[];
  pairData: PairInfo;
}

export default function LiquidityMining({ pairData, apr }: LiquidityMiningOptions) {
  const wyndexStake = pairData.staking_addr;
  const { txToast } = useToast();
  const { balance: lpBalance, refreshBalance } = useCw20UserInfos(pairData.liquidity_token);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { address: walletAddress } = useWallet();
  const { infos } = useStakeInfos(wyndexStake);
  const { refreshBondings } = useUserStakeInfos(wyndexStake, walletAddress || "");
  const stake = Cw20Hooks.useSend({
    contractAddress: pairData.liquidity_token,
    sender: walletAddress ?? "",
  });

  const doStake = async (amount: number, duration: number) => {
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await stake({
        amount: amount.toString(),
        contract: wyndexStake,
        msg: btoa(`{"delegate": { "unbonding_period": ${duration}}}`),
      });
      setIsModalOpen(false);

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBondings();
      refreshBalance();
      return result;
    });
  };

  return (
    <>
      <Box>
        <Box p={4} pt={8}>
          <Flex justify={{ md: "space-between" }} flexDirection={{ base: "column", md: "row" }}>
            <Box maxW={{ md: "md", lg: "2xl" }}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                mb={2}
                bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                bgClip="text"
                display="inline"
              >
                Start WYNNING!
              </Text>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
                mb={{ base: 4, md: 2 }}
              >
                Bond liquidity to various minimum unbonding period to earn liquidity reward and swap fees
              </Text>
            </Box>
            <Flex flexDirection="column" align={{ md: "end" }}>
              <Text
                fontSize="lg"
                fontWeight="semibold"
                color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
                mb={2}
              >
                Available LP tokens (<TokenName address={pairData.liquidity_token}></TokenName>)
              </Text>
              <Text fontSize="2xl" fontWeight="bold" align={{ md: "end" }} mb={2}>
                {microamountToAmount(lpBalance, 6)}{" "}
                <TokenName symbol={true} address={pairData.liquidity_token}></TokenName>
              </Text>
              <Button
                onClick={() => setIsModalOpen(true)}
                bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
                _hover={{
                  bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                }}
              >
                Start WYNNING!
              </Button>
            </Flex>
          </Flex>
        </Box>
        <UnboundingsGrid stakeAddress={wyndexStake} apr={apr} />
        <BoundingsTable
          tokenName={<TokenName address={pairData.liquidity_token}></TokenName>}
          tokenSymbol={<TokenName symbol={true} address={pairData.liquidity_token}></TokenName>}
          stakeContract={wyndexStake}
          apr={apr}
        />
        <PendingBoundingsTable
          wyndexStake={wyndexStake}
          tokenName={<TokenName symbol={true} address={pairData.liquidity_token}></TokenName>}
        />
        <PendingUnbondingsTable
          stakeAddress={wyndexStake}
          tokenName={<TokenName symbol={true} address={pairData.liquidity_token}></TokenName>}
        />
        <StartEarningModal
          doStake={doStake}
          isOpen={isModalOpen}
          balance={Number(lpBalance)}
          tokenName={<TokenName address={pairData.liquidity_token}></TokenName>}
          onClose={() => setIsModalOpen(false)}
          bondingInfos={infos}
          apr={apr}
        />
      </Box>
    </>
  );
}
