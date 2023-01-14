"use client";
import { Box } from "@chakra-ui/react";
import Head from "next/head";
import AssetBalances from "../components/AssetBalances";
import DepositIbcModal from "../components/DepositIbcModal";
import WithdrawIbcModal from "../components/WithdrawIbcModal";

export default function Page() {
  return (
    <>
      <Head>
        <title>WYND DEX</title>
      </Head>
      <Box p="4" bgImage={"/images/Vector2Bg.png"} minH={"100vh"} bgRepeat={"repeat"} bgSize={600}>
        <AssetBalances />
        <DepositIbcModal />
        <WithdrawIbcModal />
      </Box>
    </>
  );
}
