import { Flex, Text } from "@chakra-ui/react";
import { useSingleProposalInfo } from "../../../state/hooks/proposal/useSingleProposalInfo";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";

export const Quorum = ({ propId }: { propId: string }) => {
  const votingModuleAddress = WYND_VOTE_MODULE_ADDRESS;
  const { proposalResponse, walletVote, refreshData, walletStakedPowerAtHeight } = useSingleProposalInfo(
    Number(propId.substring(1)),
    votingModuleAddress,
  );
  // @ts-ignore
  const threshold = Number(proposalResponse.threshold.threshold_quorum.quorum.percent) * 100;
  const totalVotes =
    Number(proposalResponse.votes.yes) +
    Number(proposalResponse.votes.no) +
    Number(proposalResponse.votes.abstain);
  const currentQuorum = (100 / Number(proposalResponse.total_power)) * totalVotes;
  const color = currentQuorum > threshold ? "wynd.green.500" : "wynd.alert.error.500";

  return (
    <Flex alignItems="center">
      <Text fontSize="sm" color={color}>{currentQuorum.toFixed(2)}%</Text>
      <Text fontSize="xs" ml={1}>/ {threshold}%</Text>
    </Flex>
  );
};
