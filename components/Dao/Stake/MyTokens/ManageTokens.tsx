import { Box, Button, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Cw20Hooks, useCw20UserInfos, useToast, useTokenInfo, WyndDaoBaseHooks } from "../../../../state";
import { BondingPeriodInfo, StakedResponse } from "../../../../state/clients/types/WyndexStake.types";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
import { useStakeInfos } from "../../../../state/hooks/useStakeInfos";
import { useUserStakeInfos } from "../../../../state/hooks/useUserStakeInfos";
import { WYND_TOKEN_ADDRESS } from "../../../../utils";
import { secondsToDays } from "../../../../utils/time";
import { microamountToAmount, microdenomToDenom } from "../../../../utils/tokens";
import { BorderedBox } from "./BorderedBox";
import ManageStakeModal from "./Modals/ManageStakeModal";
import StakeModal from "./Modals/StakeModal";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const ManageTokens = ({ stakeContract, address }: { stakeContract: string; address: string }) => {
  const { allStakes } = useUserStakeInfos(stakeContract, address);
  const { balance, refreshBalance } = useCw20UserInfos(WYND_TOKEN_ADDRESS);
  const { unbondingPeriods } = useDaoStakingInfos();
  const { txToast } = useToast();
  const tokenInfo = useTokenInfo(WYND_TOKEN_ADDRESS);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [stakeModalOpen, setStakeModalOpen] = useState<boolean>(false);
  const [activeStake, setActiveStake] = useState<StakedResponse | undefined>(undefined);
  const [nextDuration, setNextDuration] = useState<BondingPeriodInfo | undefined>(undefined);
  const [prevDuration, setPrevDuration] = useState<BondingPeriodInfo | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const stake = WyndDaoBaseHooks.useDelegate({
    contractAddress: WYND_TOKEN_ADDRESS,
    sender: address ?? "",
  });

  const doStake = async (amount: number, duration: number) => {
    setLoading(true);
    await txToast(async (): Promise<ExecuteResult> => {
      const result = await stake({
        amount: amount.toString(),
        msg: btoa(`{"delegate": { "unbonding_period": ${duration}}}`),
      });

      // New balances will not appear until the next block.
      await new Promise((resolve) => setTimeout(resolve, 6500));
      refreshBalance();
      return result;
    });
    setLoading(false);
  };

  const getNextOrPrevDurationTime = (
    stake: StakedResponse,
    higher: boolean,
  ): BondingPeriodInfo | undefined => {
    const selectedIndex = unbondingPeriods
      .map((e: any) => {
        return e.unbonding_period;
      })
      .indexOf(stake.unbonding_period);

    if (higher) {
      return selectedIndex + 1 in unbondingPeriods ? unbondingPeriods[selectedIndex + 1] : undefined;
    } else {
      return selectedIndex - 1 in unbondingPeriods ? unbondingPeriods[selectedIndex - 1] : undefined;
    }
  };

  return (
    <>
      <Grid templateColumns="repeat(2, 2fr)" gap={30} mt="4">
        <Box>
          <Flex mb={2} justifyContent={"space-between"}>
            <Text fontSize="2xl" fontWeight="bold">
              Manage Stakes
            </Text>
            <Button
              fontSize="sm"
              bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
              _hover={{
                bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
              }}
              onClick={() => setStakeModalOpen(true)}
            >
              Stake!
            </Button>
          </Flex>
          <BorderedBox bgImage={false}>
            <Grid
              display="grid"
              templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 1fr" }}
              columnGap={{ base: 2, lg: 4 }}
              fontSize="xs"
              fontWeight="semibold"
              color={"wynd.neutral.900"}
              py={2}
              px={4}
              bg="whiteAlpha.100"
            >
              <GridItem>Duration</GridItem>
              <GridItem textAlign="end">Stakes</GridItem>
              <GridItem textAlign="end" display={{ base: "none", lg: "block" }}>
                Actions
              </GridItem>
            </Grid>
            {allStakes.map((stake, i) => {
              return (
                <Grid
                  key={i}
                  templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 1fr" }}
                  fontWeight="semibold"
                  alignItems="center"
                  backgroundImage={"url(/images/Vector2Bg.png)"}
                  backgroundAttachment="fixed"
                  backgroundPosition="bottom"
                  borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
                  py="4"
                  px="2"
                  gap="4"
                >
                  <GridItem display="flex" alignItems="center" gap={{ base: "2", lg: "4" }}>
                    <Text fontSize="lg">{secondsToDays(stake.unbonding_period)} days</Text>
                  </GridItem>
                  <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
                    <Text fontSize="lg">{microamountToAmount(stake.stake, 6)} $WYND</Text>
                  </GridItem>
                  <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
                    <Button
                      onClick={() => {
                        setModalOpen(true);
                        setActiveStake(allStakes[i]);
                        setPrevDuration(getNextOrPrevDurationTime(allStakes[i], false));
                        setNextDuration(getNextOrPrevDurationTime(allStakes[i], true));
                      }}
                    >
                      Manage
                    </Button>
                  </GridItem>
                </Grid>
              );
            })}
          </BorderedBox>
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Vested Tokens
          </Text>
          <BorderedBox bgImage={false}>
            {/* <ReactApexChart
              options={{
                chart: {
                  width: 380,
                  height: 400,
                  type: "pie",
                },
                labels: ["Locked", "Unlocked"],
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              }}
              series={[23, 77]}
              type="pie"
              width={380}
            /> */}
          </BorderedBox>
        </Box>
      </Grid>
      {activeStake && (
        <ManageStakeModal
          wyndexStakeAddress={stakeContract}
          higherDuration={nextDuration}
          lowerDuration={prevDuration}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tokenInfo={tokenInfo}
          stake={activeStake}
        />
      )}
      <StakeModal
        isOpen={stakeModalOpen}
        onClose={() => setStakeModalOpen(false)}
        balance={Number(balance)}
        bondingInfos={unbondingPeriods}
        doStake={doStake}
        loading={false}
        tokenInfo={tokenInfo}
      />
    </>
  );
};
