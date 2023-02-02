import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Suspense, useState } from "react";
import { useListAllProposalInfos } from "../../../state/hooks/proposal";
import { BorderedBox } from "../Stake/MyTokens/BorderedBox";
import { PropList } from "./PropList";
import { ProposalHeader } from "./ProposalHeader";
import { PropListSkeleton } from "./Skeletons/PropListSkeleton";

export const Vote = () => {
  const voteModule = {
    contractName: "CwProposalSingle",
    address: "juno105jclaywm4lxt74z8a3jgtpfr6jzlx5edg6h0sp024gm292ah2usdln48t",
    prefix: "B",
  };
  const { address: walletAddress } = useWallet();
  const [limit, setLimit] = useState<number>(1);
  return (
    <Flex gap="8" flexFlow="column">
      <ProposalHeader voteModule={voteModule} />
      <Box rounded="lg">
        <Grid
          display="grid"
          templateColumns={{
            base: "repeat(2, 1fr)",
            lg: walletAddress ? "50px 70px 100px 3fr 120px 2fr" : "70px 100px 3fr 120px 2fr",
          }}
          fontSize="xs"
          fontWeight="semibold"
          color={"wynd.neutral.900"}
          p="2"
          gap="4"
          bg="wynd.gray.alpha.20"
          borderTopRadius="lg"
        >
          <GridItem>Voted?</GridItem>
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
