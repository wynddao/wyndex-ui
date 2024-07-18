import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { Suspense, useState } from "react";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";
import { NotVotedAlert } from "./NotVotedAlert";
import { PropList } from "./PropList";
import { ProposalHeader } from "./ProposalHeader";
import { PropListSkeleton } from "./Skeletons/PropListSkeleton";

export const Vote = () => {
  const voteModule = {
    contractName: "CwProposalSingle",
    address: WYND_VOTE_MODULE_ADDRESS,
    prefix: "B",
  };
  const { address: walletAddress } = useChain("juno");
  const [limit, setLimit] = useState<number>(1);
  return (
    <Flex gap="8" flexFlow="column">
      <ProposalHeader voteModule={voteModule} />
      <Box rounded="lg">
        <Grid
          display="grid"
          templateColumns={{
            base: "repeat(2, 1fr)",
            lg: walletAddress ? "50px 70px 100px 5fr 120px 4fr 1fr" : "70px 100px 5fr 120px 4fr 1fr",
          }}
          fontSize="xs"
          fontWeight="semibold"
          color={"wynd.neutral.900"}
          p="2"
          gap="4"
          bg="wynd.gray.alpha.20"
          borderTopRadius="lg"
        >
          {walletAddress && <GridItem>Your vote</GridItem>}
          <GridItem>Proposal ID</GridItem>
          <GridItem textAlign="start">Status</GridItem>
          <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
            Title
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            Expiration
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            Votes
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            Quorum
          </GridItem>
        </Grid>
        <Suspense fallback={<PropListSkeleton limit={limit} />}>
          <PropList limit={limit} />
        </Suspense>
        <Button onClick={() => setLimit(limit + 1)} mt={3}>
          Load More
        </Button>
      </Box>
    </Flex>
  );
};
