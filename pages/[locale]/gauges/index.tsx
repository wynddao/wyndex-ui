"use client";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { Gauges } from "../../../components/Dao/Gauges";
import { makeStaticProps, getStaticPaths } from "i18next-ssg/server";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DAO - Gauges</title>
      </Head>
      <Box p="4">
        <Gauges />
      </Box>
    </>
  );
}

const getStaticProps = makeStaticProps(["common"]);
export { getStaticPaths, getStaticProps };
