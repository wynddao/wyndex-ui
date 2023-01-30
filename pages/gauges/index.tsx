"use client";;
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { Gauges } from "../../components/Dao/Gauges";

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
