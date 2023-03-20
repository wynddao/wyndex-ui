import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { Suspense, useState } from "react";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";
import { NotVotedAlert } from "./NotVotedAlert";
import { PropList } from "./PropList";
import { ProposalHeader } from "./ProposalHeader";
import { PropListSkeleton } from "./Skeletons/PropListSkeleton";
import { useTranslation } from "i18next-ssg";
export const Vote = () => {
  const voteModule = {
    contractName: "CwProposalSingle",
    address: WYND_VOTE_MODULE_ADDRESS,
    prefix: "B",
  };
  const { address: walletAddress } = useWallet();
  const [limit, setLimit] = useState<number>(1);
  const { t } = useTranslation("common");
  return (
    <Flex gap="8" flexFlow="column">
      <ProposalHeader voteModule={voteModule} />
      <NotVotedAlert />
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
          {walletAddress && <GridItem>{t("vote.yourVote")}</GridItem>}
          <GridItem>{t("vote.proposalID")}</GridItem>
          <GridItem textAlign="start">{t("vote.status")}</GridItem>
          <GridItem textAlign="start" display={{ base: "none", lg: "block" }}>
            {t("vote.title")}
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            {t("vote.expiration")}
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            {t("vote.votes")}
          </GridItem>
          <GridItem textAlign="center" display={{ base: "none", lg: "block" }}>
            {t("vote.quorum")}
          </GridItem>
        </Grid>
        <Suspense fallback={<PropListSkeleton limit={limit} />}>
          <PropList limit={limit} />
        </Suspense>
        <Button onClick={() => setLimit(limit + 1)} mt={3}>
          {t("vote.learnMore")}
        </Button>
      </Box>
    </Flex>
  );
};
