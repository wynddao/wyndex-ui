import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSingleProposalInfo } from "../../../state/hooks/proposal";
import { useDaoStakingInfos } from "../../../state/hooks/useDaoStakingInfos";
import { secondsToDays } from "../../../utils/time";
import { microamountToAmount } from "../../../utils/tokens";
import { useTranslation } from "i18next-ssg";

export const ProposalHeader = ({ voteModule }: { voteModule: any }) => {
  const { config } = useSingleProposalInfo(voteModule.address);
  const { governanceTokenInfo, totalStaked } = useDaoStakingInfos();
  const router = useRouter();
  const { t } = useTranslation("common");
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
            {t("proposal.vote")}
          </Heading>
          <Flex gap={6} justifyContent={"space-around"} flexFlow={{ base: "column", md: "row" }}>
            <Box py={{ md: 2 }} textAlign={{ base: "center", md: "left" }}>
              <Text fontWeight="semibold" color="wynd.gray.500">
                {t("proposal.totalSupply")}
              </Text>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold">
                {(
                  Number(
                    microamountToAmount(governanceTokenInfo.total_supply, governanceTokenInfo.decimals),
                  ) /
                  10 ** 6
                ).toFixed(1)}
                {"M $WYND"}
              </Text>
            </Box>
            <Box py={{ md: 2 }} textAlign={{ base: "center", md: "right" }}>
              <Text fontWeight="semibold" color="wynd.gray.500">
                {t("stake.staked")}
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
              {t("proposal.proposalDeposit")}
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {microamountToAmount(config.deposit_info?.deposit, 6)} {"$WYND"}
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
              {t("proposal.refundFailedProposals")}
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
              {t("proposal.passingThreshold")}
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
              {t("proposal.quorum")}
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
              {t("proposal.votingPeriod")}
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {secondsToDays(config.max_voting_period.time)} {t("time.days")}
            </Text>
          </Box>
          <Flex alignItems="center">
            <Button
              bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
              bgClip="text"
              display="inline-block"
              variant="ghost"
              onClick={() => router.push("/vote/create")}
              _hover={{ bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)" }}
            >
              {t("proposal.actions.createProposal")}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};
