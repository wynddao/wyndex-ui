"use client";

import { Box } from "@chakra-ui/react";
import Head from "next/head";
import AssetBalances from "../components/Dex/AssetBalances";
import DepositIbcModal from "../components/Dex/DepositIbcModal";
import WithdrawIbcModal from "../components/Dex/WithdrawIbcModal";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND DEX</title>
      </Head>

      <Box p="4">
        <AssetBalances />
        <DepositIbcModal />
        <WithdrawIbcModal />
      </Box>
    </>
  );
}
