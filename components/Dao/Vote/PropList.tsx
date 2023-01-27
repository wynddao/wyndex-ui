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

  return (
    <>
      {allProps.map((prop, i) => (
        <Grid
          key={i}
          templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 2fr 1fr 2fr" }}
          fontWeight="semibold"
          _hover={{
            bgColor: "wynd.base.sidebar",
            cursor: "pointer",
          }}
          onClick={() => handleRowClick(prop)}
          alignItems="center"
          backgroundImage={"url(/images/Vector2Bg.png)"}
          backgroundAttachment="fixed"
          backgroundPosition="bottom"
          borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
          py="4"
          px="2"
          gap="4"
        >
          <GridItem display="flex" alignItems="center" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">{prop.id}</Text>
          </GridItem>
          <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">{capitalizeFirstLetter(prop.status)}</Text>
          </GridItem>
          <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">{prop.title}</Text>
          </GridItem>
          <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">
              {(expirationAtTimeToSecondsFromNow(prop.expiration || "") || 0 - new Date().getTime()) < 0 ||
              prop.status === "executed"
                ? "Completed"
                : secondsToWdhms(expirationAtTimeToSecondsFromNow(prop.expiration || "") || "")}
            </Text>
          </GridItem>
          <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
            <Progress
              variant="multiSegment"
              m={4}
              height={8}
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
