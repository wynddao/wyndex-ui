import { Button, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import { useListAllProposalInfos } from "../../../state/hooks/proposal";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { PropList } from "./PropList";
import { ProposalHeader } from "./ProposalHeader";

export const Vote = () => {
  const voteModule = {
    contractName: "CwProposalSingle",
    address: "juno105jclaywm4lxt74z8a3jgtpfr6jzlx5edg6h0sp024gm292ah2usdln48t",
    prefix: "B",
  };

  const [limit, setLimit] = useState<number>(1);
  return (
    <>
      <ProposalHeader voteModule={voteModule} />
      <BorderedBox bgImage={false}>
        <Grid
          display="grid"
          templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 2fr 1fr 2fr" }}
          columnGap={{ base: 2, lg: 4 }}
          fontSize="xs"
          fontWeight="semibold"
          color={"wynd.neutral.900"}
          py={2}
          px={4}
          bg="whiteAlpha.100"
        >
          <GridItem>Proposal ID</GridItem>
          <GridItem textAlign="start">Status</GridItem>
          <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
            Title
          </GridItem>
          <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
            Expiration
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            Votes
          </GridItem>
        </Grid>
        <PropList limit={limit} voteModule={voteModule} />
        <Button onClick={() => setLimit(limit + 1)} mt={3}>
          Load More
        </Button>
      </BorderedBox>
    </>
  );
};
