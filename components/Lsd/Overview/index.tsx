import { Grid, Heading } from "@chakra-ui/react";
import { LsdHeader } from "./Header";
import { LsdCard } from "./LsdCard";

export const LsdOverview = () => {
  return (
    <>
      <LsdHeader />
      <Grid mt={5} templateColumns={"1fr 1fr 1fr 1fr"} gap={5}>
        <LsdCard />
        <LsdCard />
        <LsdCard />
        <LsdCard />
      </Grid>
    </>
  );
};
