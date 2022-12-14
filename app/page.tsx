"use client";
import { Box } from "@chakra-ui/react";
import AssetBalances from "../components/AssetBalances";
import DepositIbcModal from "../components/DepositIbcModal";
import WithdrawIbcModal from "../components/WithdrawIbcModal";

export default function Page() {
  return (
    <Box p="4">
      <AssetBalances />
      <DepositIbcModal />
      <WithdrawIbcModal />
    </Box>
  );
}
