import { Button, Grid, GridItem, Progress, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useListAllProposalInfos } from "../../../state/hooks/proposal";
import { useProposalCount } from "../../../state/hooks/proposal/useProposalCount";
import { capitalizeFirstLetter } from "../../../utils/text";
import { expirationAtTimeToSecondsFromNow, secondsToWdhms } from "../../../utils/time";

export const PropList = ({ limit }: { limit: number }) => {
  const voteModule = {
    contractName: "CwProposalSingle",
    address: "juno105jclaywm4lxt74z8a3jgtpfr6jzlx5edg6h0sp024gm292ah2usdln48t",
    prefix: "B",
  };

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
          templateColumns={{ base: "repeat(2, 1fr)", lg: "70px 100px 3fr 120px 2fr" }}
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
            <Progress
              variant="multiSegment"
              height={4}
              rounded="sm"
              min={0}
              max={Number(prop.votes.yes) + Number(prop.votes.no) + Number(prop.votes.abstain)}
              //@ts-ignore
              values={{
                red: Number(prop.votes.no),
                blue: Number(prop.votes.abstain),
                green: Number(prop.votes.yes),
              }}
            />
          </GridItem>
        </Grid>
      ))}
    </>
  );
};
