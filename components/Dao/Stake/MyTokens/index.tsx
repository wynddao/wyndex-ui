import { Box, Grid, Text } from "@chakra-ui/react";
import { useCw20UserInfos } from "../../../../state";
import { Claim } from "../../../../state/clients/types/WyndDaoStake.types";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
import { DAO_STAKING_ADDRESS, WYND_TOKEN_ADDRESS } from "../../../../utils";
import { ManageTokens } from "./ManageTokens";
import { Unstaked } from "./Unstaked";
import { VotingPower } from "./VotingPower";
import { useTranslation } from "i18next-ssg";

export const MyTokens = ({
  walletAddress,
  walletStakedPower,
  walletStakedTokens,
  totalStakedValue,
  vestedBalance,
  claims,
  claimsPending,
  claimsAvailable,
}: {
  walletAddress: string;
  walletStakedTokens: number | undefined;
  walletStakedPower: number | undefined;
  totalStakedValue: number;
  vestedBalance: string;
  claims?: Claim[];
  claimsPending?: Claim[];
  claimsAvailable?: Claim[];
}) => {
  const { balance } = useCw20UserInfos(WYND_TOKEN_ADDRESS);
  const { t } = useTranslation("common");
  return (
    <>
      <Box my={4}>
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
          bgClip="text"
          display="inline"
        >
          {t("stake.myTokens")}
        </Text>
        <Text color="wynd.gray.600"> {t("stake.stakeMoreToGetMorePower")}</Text>
      </Box>
      <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={30}>
        <VotingPower
          walletStakedPower={walletStakedPower}
          walletStakedTokens={walletStakedTokens}
          totalStakedValue={totalStakedValue}
        />
        <Unstaked
          walletStakedTokens={Number(walletStakedTokens)}
          vestedBalance={vestedBalance}
          unstakedAmount={Number(balance)}
          claims={claims}
        />
      </Grid>
      <ManageTokens
        stakeContract={DAO_STAKING_ADDRESS}
        address={walletAddress}
        vestedBalance={vestedBalance}
        walletStakedTokens={Number(walletStakedTokens)}
        unstakedAmount={Number(balance)}
        claims={claims}
        claimsAvailable={claimsAvailable}
        claimsPending={claimsPending}
      />
    </>
  );
};
