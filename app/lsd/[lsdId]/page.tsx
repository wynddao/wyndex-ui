"use client";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import { Box } from "@chakra-ui/react";
import { LsdSingle } from "../../../components/Lsd/Single";

const Page = () => {
  const router = useRouter();
  const { lsdId } = router.query;

  return (
    <>
      <Head>
        <title>WYND | Liquid Staking Derivatives - JUNO</title>
      </Head>
      <Box p="4">
        <LsdSingle id={lsdId?.toString() || ""} />
      </Box>
    </>
  );
};

export default Page;
