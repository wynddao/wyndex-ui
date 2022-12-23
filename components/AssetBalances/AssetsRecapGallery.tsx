"use client";

import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../state";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { formatCurrency } from "../../utils/currency";

export interface AssetsRecap {
  readonly total: string;
  readonly locked: string;
  readonly available: string;
}

export default function AssetsRecapGallery() {
  const { address: walletAddress } = useWallet();
  const { userFiat } = useIndexerInfos({ fetchCw20Balances: true });
  const currency = useRecoilValue(currencyAtom);

  return (
    <>
      <Heading p={8} pb={0}>
        My Assets
      </Heading>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
        maxW="4xl"
        gap={6}
        px={8}
        py={4}
      >
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Total Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {walletAddress
              ? formatCurrency(currency, `${userFiat.availableBalanceInUsd + userFiat.lockedBalanceInUsd}`)
              : "-"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Locked Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {walletAddress ? formatCurrency(currency, `${userFiat.lockedBalanceInUsd}`) : "-"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Available Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {walletAddress ? formatCurrency(currency, `${userFiat.availableBalanceInUsd}`) : "-"}
          </Text>
        </Box>
      </Grid>
    </>
  );
}
