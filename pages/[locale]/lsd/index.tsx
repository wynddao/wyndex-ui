import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { LsdOverview } from "../../../components/Lsd/Overview";
import { makeStaticProps, getStaticPaths } from "i18next-ssg/server";

const Page = () => (
  <>
    <Head>
      <title>WYND | Liquid Staking Derivatives</title>
    </Head>
    <Box p="4">
      <LsdOverview />
    </Box>
  </>
);

export default Page;

const getStaticProps = makeStaticProps(["common"]);
export { getStaticPaths, getStaticProps };
