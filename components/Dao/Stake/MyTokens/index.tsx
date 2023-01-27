import { Box, Grid, Text } from "@chakra-ui/react";
import { useCw20UserInfos } from "../../../../state";
import { Claim } from "../../../../state/clients/types/WyndDaoStake.types";
import { useDaoStakingInfos } from "../../../../state/hooks/useDaoStakingInfos";
import { DAO_STAKING_ADDRESS, WYND_TOKEN_ADDRESS } from "../../../../utils";
import { ManageTokens } from "./ManageTokens";
import { Unstaked } from "./Unstaked";
import { VotingPower } from "./VotingPower";

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
          My Tokens
        </Text>
      </Box>
      <Grid templateColumns="repeat(2, 2fr)" gap={30}>
        <VotingPower
          walletStakedPower={walletStakedPower}
          walletStakedTokens={walletStakedTokens}
          totalStakedValue={totalStakedValue}
        />
        <Unstaked unstakedAmount={Number(balance)} />
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
