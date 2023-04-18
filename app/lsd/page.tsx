"use client";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { LsdOverview } from "../../components/Lsd/Overview";

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
