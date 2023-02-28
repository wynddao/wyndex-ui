import { Badge, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useIndexerInfos, useListAllProposalInfos } from "../../../state";
import { useProposalCount } from "../../../state/hooks/proposal/useProposalCount";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";

export const UnvotedPropCount = ({ dashboard = false }: { dashboard?: boolean }) => {
  const { address: walletAddress } = useWallet();
  const { userVotes } = useIndexerInfos({});
  const voteModule = {
    contractName: "CwProposalSingle",
    address: WYND_VOTE_MODULE_ADDRESS,
    prefix: "B",
  };

  const propCount = useProposalCount(voteModule);
  const allProps = useListAllProposalInfos(voteModule, propCount - 20, 20);

  if (!walletAddress) {
    return <></>;
  } else {
    let count = 0;
    allProps.map((prop) => {
      const filter = userVotes.find((el) => el.proposal === prop.id.substring(1));
      if (!filter && prop.status === "open") {
        count++;
      }
    });

    if (dashboard) {
      return (
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="extrabold"
          bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
          bgClip="text"
        >
          {count}
        </Text>
      );
    }

    return count > 0 ? (
      <Badge
        zIndex="4"
        borderRadius="50%"
        w={5}
        h={5}
        display="flex"
        justifyContent="center"
        ml="1"
        alignItems="center"
        fontSize="0.8em"
        colorScheme="green"
      >
        {count}
      </Badge>
    ) : (
      <></>
    );
  }
};
