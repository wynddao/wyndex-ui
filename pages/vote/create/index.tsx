"use client";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { CreateProposal } from "../../../components/Dao/CreateProposal";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND | DAO - Create Proposal</title>
      </Head>
      <Box p="4">
        <CreateProposal />
      </Box>
    </>
  );
}
