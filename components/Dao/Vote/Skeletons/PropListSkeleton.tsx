import { Grid, GridItem, Skeleton, Text } from "@chakra-ui/react";

export const PropListSkeleton = ({ limit }: { limit: number }) => {
  return (
    <>
      {Array.from(Array(limit * 10).keys()).map((i) => (
        <Grid
          key={i}
          templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 1fr 2fr 1fr 2fr" }}
          fontWeight="semibold"
          _hover={{
            bgColor: "wynd.base.sidebar",
            cursor: "pointer",
          }}
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
            <Text fontSize="lg">
              <Skeleton height="20px" />
            </Text>
          </GridItem>
          <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">
              <Skeleton height="20px" />
            </Text>
          </GridItem>
          <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">
              <Skeleton height="20px" />
            </Text>
          </GridItem>
          <GridItem textAlign="start" gap={{ base: "2", lg: "4" }}>
            <Text fontSize="lg">
              <Skeleton height="20px" />
            </Text>
          </GridItem>
          <GridItem textAlign="end" gap={{ base: "2", lg: "4" }}>
            <Skeleton height="20px" />
          </GridItem>
        </Grid>
      ))}
    </>
  );
};
