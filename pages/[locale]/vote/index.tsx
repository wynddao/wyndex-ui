"use client";
import { Box, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { Vote } from "../../../components/Dao/Vote";
import { makeStaticProps, getStaticPaths } from "i18next-ssg/server";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DAO - Vote</title>
      </Head>
      <Box p="4">
        <Vote />
      </Box>
    </>
  );
}

const getStaticProps = makeStaticProps(["common"]);
export { getStaticPaths, getStaticProps };
