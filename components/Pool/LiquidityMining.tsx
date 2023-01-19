import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { ExecuteResult } from "cosmwasm";
import { useState } from "react";
import { Cw20Hooks } from "../../state";
import { PairInfo } from "../../state/clients/types/WyndexPair.types";
import { useToast, useTokenInfo } from "../../state/hooks";
import { useCw20UserInfos } from "../../state/hooks/useCw20UserInfos";
import { useStakeInfos } from "../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../state/hooks/useUserStakeInfos";
import { microamountToAmount } from "../../utils/tokens";
import TokenName from "../TokenName";
import BoundingsTable from "./BoundingsTable";
import PendingBoundingsTable from "./PendingBoundingsTable";
import PendingUnbondingsTable from "./PendingUnbondingsTable";
import StartEarningModal from "./StartEarningModal";
import UnboundingsGrid from "./UnbondingsGrid";

interface LiquidityMiningOptions {
  apr: {
    unbonding_period: number;
    apr: number;
  }[];
  pairData: PairInfo;
  pairNames: JSX.Element[];
}

export default function LiquidityMining({ pairData, apr, pairNames }: LiquidityMiningOptions) {
  const wyndexStake = pairData.staking_addr;
  const { txToast } = useToast();
  const { balance: lpBalance, refreshBalance } = useCw20UserInfos(pairData.liquidity_token);
  const ltokenInfo = useTokenInfo(pairData.liquidity_token);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { address: walletAddress } = useWallet();
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
      setIsModalOpen(false);

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 500));
      refreshBondings();
      refreshBalance();
      return result;
    });
    setLoading(false);
  };

  return (
    <>
      <Box>
        {Number(lpBalance) > 0 && (
          <Box p={4} pt={8}>
            <Flex justify={{ md: "space-between" }} flexDirection={{ base: "column", md: "row" }} gap="4">
              <Box maxW={{ md: "md" }}>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  mb={2}
                  bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                  bgClip="text"
                  display="inline"
                >
                  Start WYNNING!
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color="whiteAlpha.600" mb={{ base: 4, md: 2 }}>
                  Bond liquidity to various minimum unbonding period to earn liquidity reward and swap fees
                </Text>
              </Box>
              <Flex flexDirection="column" align={{ md: "end" }}>
                <Text fontSize="sm" fontWeight="semibold" color="whiteAlpha.600">
                  Available LP tokens ({pairNames[0]} / {pairNames[1]})
                </Text>
                <Text fontSize="xl" fontWeight="bold" align={{ md: "end" }} mb={2}>
                  {microamountToAmount(lpBalance, ltokenInfo.tokenDecimals)}{" "}
                  <TokenName symbol={true} address={pairData.liquidity_token}></TokenName>
                </Text>
                <Button
                  fontSize="sm"
                  disabled={lpBalance === "0"}
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
        )}
        <UnboundingsGrid stakeAddress={wyndexStake} apr={apr} />
        <BoundingsTable
          liquidityTokenInfo={ltokenInfo}
          stakeContract={wyndexStake}
          apr={apr}
          pairData={pairData}
        />
        <PendingBoundingsTable wyndexStake={wyndexStake} tokenInfo={ltokenInfo} />
        <PendingUnbondingsTable stakeAddress={wyndexStake} tokenInfo={ltokenInfo} pairData={pairData} />
        <StartEarningModal
          doStake={doStake}
          isOpen={isModalOpen}
          tokenInfo={ltokenInfo}
          balance={Number(lpBalance)}
          pairNames={pairNames}
          onClose={() => setIsModalOpen(false)}
          bondingInfos={infos}
          apr={apr}
          loading={loading}
        />
      </Box>
    </>
  );
}
