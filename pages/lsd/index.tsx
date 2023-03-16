import { Box } from "@chakra-ui/react";
import Head from "next/head";
import MysteryBoxContainer from "../../components/Dex/MysteryBox";

const Page = () => (
  <>
    <Head>
      <title>WYND | Liquid Staking Derivatives</title>
    </Head>
    <Box p="4">
      <MysteryBoxContainer />
    </Box>
  </>
);

export default Page;
