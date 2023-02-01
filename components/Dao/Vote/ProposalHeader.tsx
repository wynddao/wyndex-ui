import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useSingleProposalInfo } from "../../../state/hooks/proposal";
import { useDaoStakingInfos } from "../../../state/hooks/useDaoStakingInfos";
import { secondsToDays } from "../../../utils/time";
import { microamountToAmount } from "../../../utils/tokens";

export const ProposalHeader = ({ voteModule }: { voteModule: any }) => {
  const { config } = useSingleProposalInfo(voteModule.address);
  const { governanceTokenInfo, totalStaked } = useDaoStakingInfos();

  return (
    <>
      <Box bg="url(/mooncastle.png)" rounded="lg" bgPosition="center" bgSize="cover">
        <Flex
          bg="rgba(16, 11, 22,0.5)"
          w="full"
          px={{ base: "4", md: "8" }}
          py={{ base: "6", md: "12" }}
          flexFlow="column"
          gap="10"
          rounded="lg"
        >
          <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
            Vote
          </Heading>
          <Flex gap={6} justifyContent={"space-around"} flexFlow={{ base: "column", md: "row" }}>
            <Box py={{ md: 2 }} textAlign={{ base: "center", md: "left" }}>
              <Text fontWeight="semibold" color="wynd.gray.500">
                Total Supply
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
                {(
                  Number(
                    microamountToAmount(governanceTokenInfo.total_supply, governanceTokenInfo.decimals),
                  ) /
                  10 ** 6
                ).toFixed(1)}
                M $WYND
              </Text>
            </Box>
            <Box py={{ md: 2 }} textAlign={{ base: "center", md: "right" }}>
              <Text fontWeight="semibold" color="wynd.gray.500">
                Staked
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
                {((100 / Number(governanceTokenInfo.total_supply)) * Number(totalStaked)).toFixed(2)}%
              </Text>
            </Box>
          </Flex>
        </Flex>
        <Flex
          bg="rgba(16, 11, 22,0.9)"
          gap={6}
          px={3}
          py={2}
          justifyContent={"space-around"}
          borderBottomRadius="lg"
          flexWrap="wrap"
        >
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              Proposal deposit
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {microamountToAmount(config.deposit_info?.deposit, 6)} $WYND
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              Refund failed proposals
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {config.deposit_info?.refund_failed_proposals ? "YES" : "NO"}
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              Passing threshold
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {config.threshold.threshold_quorum.threshold.percent * 100}%
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              Quorum
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {config.threshold.threshold_quorum.quorum.percent * 100}%
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              Voting Period
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {secondsToDays(config.max_voting_period.time)} Days
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
