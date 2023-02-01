import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { ExecuteResult } from "cosmwasm";
import { useState } from "react";
import { useCw20UserInfos, useToast, useTokenInfo, WyndDaoBaseHooks } from "../../../../state";
import { Claim } from "../../../../state/clients/types/WyndDaoStake.types";
import { BondingPeriodInfo, StakedResponse } from "../../../../state/clients/types/WyndexStake.types";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
import { useUserStakeInfos } from "../../../../state/hooks/useUserStakeInfos";
import { DAO_STAKING_ADDRESS, WYND_TOKEN_ADDRESS } from "../../../../utils";
import { secondsToDays } from "../../../../utils/time";
import { microamountToAmount } from "../../../../utils/tokens";
import { BorderedBox } from "./BorderedBox";
import ManageStakeModal from "./Modals/ManageStakeModal";
import StakeModal from "./Modals/StakeModal";
import { RebondingTokens } from "./RebondingTokens";
import { UnstakingTokens } from "./UnstakingTokens";
import { VestedTokens } from "./VestedTokens";

export const ManageTokens = ({
  stakeContract,
  address,
  vestedBalance,
  walletStakedTokens,
  unstakedAmount,
  claims,
  claimsPending,
  claimsAvailable,
}: {
  stakeContract: string;
  address: string;
  vestedBalance: string;
  walletStakedTokens: number;
  unstakedAmount: number;
  claims?: Claim[];
  claimsPending?: Claim[];
  claimsAvailable?: Claim[];
}) => {
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
      <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={30} mt="12">
        <Box>
          <Flex mb={2} justifyContent={"space-between"}>
            <Text fontSize="2xl" fontWeight="bold">
              Manage Stakes
            </Text>
            <Button
              fontSize="xs"
              height="fit-content"
              px="4"
              py="2"
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
            Locked Tokens
          </Text>
          <BorderedBox bgImage={false}>
            <Tabs isFitted>
              <TabList>
                <Tab>Vesting</Tab>
                <Tab>Rebonding</Tab>
                <Tab>Unstaking</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <VestedTokens
                    vestedBalance={vestedBalance}
                    walletStakedTokens={walletStakedTokens}
                    unstakedAmount={unstakedAmount}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <RebondingTokens wyndexStake={DAO_STAKING_ADDRESS} walletAddress={address} />
                </TabPanel>
                <TabPanel p={0}>
                  <UnstakingTokens
                    stakeAddress={DAO_STAKING_ADDRESS}
                    claims={claims}
                    claimsAvailable={claimsAvailable}
                    claimsPending={claimsPending}
                    walletAddress={address}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
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
