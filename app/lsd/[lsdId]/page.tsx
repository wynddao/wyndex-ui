"use client";;
import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { LsdSingle } from "../../../components/Lsd/Single";

interface LsdPageProps {
  readonly params: {
    readonly lsdId: string;
  };
}

const Page = ({ params }: LsdPageProps) => {
  const { lsdId } = params;
  return (
    <>
      <Head>
        <title>WYND | Liquid Staking Derivatives - JUNO</title>
      </Head>
      <Box p="4">
        <LsdSingle id={lsdId} />
      </Box>
    </>
  );
};

export default Page;
