import { Box, Flex, Grid, GridItem, Progress, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/navigation";
import { BsCheck2Circle, BsQuestionCircle, BsXCircle } from "react-icons/bs";
import { useIndexerInfos } from "../../../state";
import { useListAllProposalInfos } from "../../../state/hooks/proposal";
import { useProposalCount } from "../../../state/hooks/proposal/useProposalCount";
import { WYND_VOTE_MODULE_ADDRESS } from "../../../utils";
import { capitalizeFirstLetter } from "../../../utils/text";
import { expirationAtTimeToSecondsFromNow, secondsToWdhms } from "../../../utils/time";

const VoteStatus = ({ id }: { id: string }) => {
  const { userVotes } = useIndexerInfos({});

  let includes: string | undefined;
  // Find id in uservotes
  userVotes.map((vote) => {
    if (vote.proposal === id.substring(1)) {
      includes = vote.vote;
    }
  });

  switch (includes) {
    case "yes":
      return (
        <Flex justifyContent="center">
          <BsCheck2Circle color="green" />
        </Flex>
      );
    case "no":
      return (
        <Flex justifyContent="center">
          <BsXCircle color="red" />
        </Flex>
      );
    case "abstain":
      return (
        <Flex justifyContent="center">
          <BsQuestionCircle color="yellow" />
        </Flex>
      );
    case undefined:
    default:
      return <Text color="wynd.cyan.300">-</Text>;
  }
};

export const PropList = ({ limit }: { limit: number }) => {
  const voteModule = {
    contractName: "CwProposalSingle",
    address: WYND_VOTE_MODULE_ADDRESS,
    prefix: "B",
  };

  const { address: walletAddress } = useWallet();

  const propCount = useProposalCount(voteModule);
  const allProps = useListAllProposalInfos(voteModule, propCount - limit * 10, limit * 10).reverse();

  const router = useRouter();
  const handleRowClick = (prop: any) => {
    router.push(`/vote/${prop.proposalNumber}`);
  };

  /*  "open" | "rejected" | "passed" | "executed" | "closed" */

  const colorStatus = {
    open: "wynd.cyan.600",
    rejected: "orange.300",
    passed: "wynd.green.600",
    executed: "purple.400",
    closed: "wynd.gray.600",
  };

  return (
    <>
      {allProps.map((prop, i) => (
        <Grid
          key={i}
          templateColumns={{
            base: "repeat(2, 1fr)",
            lg: walletAddress ? "50px 70px 100px 3fr 120px 2fr" : "70px 100px 3fr 120px 2fr",
          }}
          fontWeight="semibold"
          _hover={{
            bgColor: "wynd.gray.alpha.10",
            cursor: "pointer",
          }}
          onClick={() => handleRowClick(prop)}
          alignItems="center"
          backgroundImage={"url(/images/Vector2Bg.png)"}
          backgroundSize="300px"
          borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
          px="2"
          py="4"
          gap="4"
        >
          {walletAddress && (
            <GridItem textAlign={"center"}>
              <VoteStatus id={prop.id} />
            </GridItem>
          )}
          <GridItem>
            <Text fontSize={{ base: "xs", md: "sm" }} color="wynd.gray.600">
              {prop.id}
            </Text>
          </GridItem>
          <GridItem textAlign="start" color={colorStatus[prop.status]}>
            <Text fontSize={{ base: "xs", md: "sm" }}>{capitalizeFirstLetter(prop.status)}</Text>
          </GridItem>
          <GridItem textAlign="start">
            <Text fontSize={{ base: "sm", md: "md" }}>{prop.title}</Text>
          </GridItem>
          <GridItem textAlign="center">
            <Text fontSize={{ base: "xs", md: "sm" }} color="wynd.gray.600">
              {(expirationAtTimeToSecondsFromNow(prop.expiration || "") || 0 - new Date().getTime()) < 0 ||
              prop.status === "executed"
                ? "Completed"
                : secondsToWdhms(expirationAtTimeToSecondsFromNow(prop.expiration || "") || "")}
            </Text>
          </GridItem>
          <GridItem textAlign="end" colSpan={{ base: 2, lg: "auto" }} py="2">
            <Grid templateColumns={"1fr 1fr 1fr"} bgColor="wynd.gray.alpha.10" borderTopRadius="lg">
              <Flex justifyContent="center" alignItems="center">
                <Text color="wynd.gray.600" fontWeight="light" fontSize="xs" align="center" mr={1}>
                  Yes:
                </Text>
                <Text color="wynd.green.500" fontWeight="light" fontSize="sm" align="center">
                  {(
                    (Number(prop.votes.yes) /
                      (Number(prop.votes.yes) + Number(prop.votes.no) + Number(prop.votes.abstain))) *
                    100
                  ).toFixed(2)}
                  {"%"}
                </Text>
              </Flex>
              <Flex justifyContent="center" alignItems="center">
                <Text color="wynd.gray.600" fontWeight="light" fontSize="xs" align="center" mr={1}>
                  Abstain:
                </Text>
                <Text color="wynd.cyan.500" fontWeight="light" fontSize="sm" align="center">
                  {(
                    (Number(prop.votes.abstain) /
                      (Number(prop.votes.yes) + Number(prop.votes.no) + Number(prop.votes.abstain))) *
                    100
                  ).toFixed(2)}
                  {"%"}
                </Text>
              </Flex>
              <Flex justifyContent="center" alignItems="center">
                <Text color="wynd.gray.600" fontWeight="light" fontSize="xs" align="center" mr={1}>
                  No:
                </Text>
                <Text color="wynd.alert.error.500" fontWeight="light" fontSize="sm" align="center">
                  {(
                    (Number(prop.votes.no) /
                      (Number(prop.votes.yes) + Number(prop.votes.no) + Number(prop.votes.abstain))) *
                    100
                  ).toFixed(2)}
                  {"%"}
                </Text>
              </Flex>
            </Grid>
            <Progress
              variant="multiSegment"
              height={4}
              rounded="sm"
              min={0}
              borderBottomRadius="lg"
              max={Number(prop.votes.yes) + Number(prop.votes.no) + Number(prop.votes.abstain)}
              //@ts-ignore
              values={{
                green: Number(prop.votes.yes),
                blue: Number(prop.votes.abstain),
                red: Number(prop.votes.no),
              }}
            />
          </GridItem>
        </Grid>
      ))}
    </>
  );
};
