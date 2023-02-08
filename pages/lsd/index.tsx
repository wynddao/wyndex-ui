import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { LsdOverview } from "../../components/Lsd/Overview";

const Page = () => (
  <>
    <Head>
      <title>WYND DEX - Liquid Staking</title>
    </Head>
    <Box p="4">
      <LsdOverview />
    </Box>
  </>
);

export default Page;
