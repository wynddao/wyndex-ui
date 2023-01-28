import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useSingleProposalInfo } from "../../../state/hooks/proposal";
import { useDaoStakingInfos } from "../../../state/hooks/useDaoStakingInfos";
import { secondsToDays } from "../../../utils/time";
import { microamountToAmount } from "../../../utils/tokens";

export const ProposalHeader = ({ voteModule }: { voteModule: any }) => {
  const { config } = useSingleProposalInfo(voteModule.address);
  const { governanceTokenInfo, totalStaked } = useDaoStakingInfos();

  return (
    <>
      <Box bg="url(/castle.jpeg)" rounded="lg" mb={4} bgPosition="bottom" bgSize="cover">
        <Box bg="rgba(16, 11, 22,0.8)" w="full" h="full">
          <Flex gap={6} px={8} py={4} justifyContent={"space-around"}>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Total Supply
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {(Number(microamountToAmount(governanceTokenInfo.total_supply, governanceTokenInfo.decimals)) / 10 ** 6).toFixed(1)}M $WYND
              </Text>
            </Box>
            <Box py={{ md: 2 }}>
              <Heading fontSize={{ base: "3xl", md: "6xl" }} fontWeight="extrabold">
                Vote
              </Heading>
            </Box>
            <Box py={{ md: 2 }}>
              <Text fontWeight="semibold" opacity={0.7}>
                Staked
              </Text>
              <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
                {(100 / Number(governanceTokenInfo.total_supply) * Number(totalStaked)).toFixed(2)}%
              </Text>
            </Box>
          </Flex>
        </Box>
        <Flex
          bg="rgba(16, 11, 22,0.95)"
          gap={6}
          px={3}
          py={1}
          borderBottomRadius="md"
          justifyContent={"space-around"}
        >
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              Proposal deposit
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"}>
              {/* @ts-ignore */}
              {microamountToAmount(config.deposit_info?.deposit, 6)} $WYND
            </Text>
          </Box>
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              Refund failed proposals
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"}>
              {config.deposit_info?.refund_failed_proposals ? "YES" : "NO"}
            </Text>
          </Box>
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              Passing threshold
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"}>
              {/* @ts-ignore */}
              {config.threshold.threshold_quorum.threshold.percent * 100}%
            </Text>
          </Box>
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              Quorum
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"}>
              {/* @ts-ignore */}
              {config.threshold.threshold_quorum.quorum.percent * 100}%
            </Text>
          </Box>
          <Box py={{ md: 2 }}>
            <Text fontWeight="semibold" opacity={0.7}>
              Voting Period
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"}>
              {/* @ts-ignore */}
              {secondsToDays(config.max_voting_period.time)} Days
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
