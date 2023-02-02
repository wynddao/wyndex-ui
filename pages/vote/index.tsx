"use client";;
import { Box, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { Vote } from "../../components/Dao/Vote";

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
