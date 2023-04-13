import { Alert, AlertIcon, Badge, Text } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { useIndexerInfos, useListAllProposalInfos } from "../../../state";
import { useProposalCount } from "../../../state/hooks/proposal/useProposalCount";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";

export const NotVotedAlert = () => {
  const { address: walletAddress } = useChain("juno");
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
    let count: any[] = [];
    allProps.map((prop) => {
      const filter = userVotes.find((el) => el.proposal === prop.id.substring(1));
      if (!filter && prop.status === "open") {
        count.push(prop);
      }
    });

    return count.length > 0 ? (
      <Alert status="warning">
        <AlertIcon />
        {"You didn't vote for proposals: "}
        {count.map((prop, i) => (
          <Text ml={2} key={prop.id}>
            {prop.id} {count.length > 1 && i !== count.length - 1 && ","}
          </Text>
        ))}
      </Alert>
    ) : (
      <></>
    );
  }
};
