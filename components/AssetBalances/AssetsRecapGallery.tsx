"use client";

import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { getAssetsRecap } from "../../utils";

export interface AssetsRecap {
  readonly total: string;
  readonly locked: string;
  readonly available: string;
}

export default function AssetsRecapGallery() {
  const { address, getCosmWasmClient } = useWallet();
  const [assetsRecap, setAssetsRecap] = useState<AssetsRecap>();

  useEffect(() => {
    (async function updateAssetsRecap() {
      if (!address) return;

      const assetsRecap = await getAssetsRecap(address);
      setAssetsRecap(assetsRecap);
    })();
  }, [address, getCosmWasmClient]);

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
            {assetsRecap?.total || "—"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Locked Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {assetsRecap?.locked || "—"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Available Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {assetsRecap?.available || "—"}
          </Text>
        </Box>
      </Grid>
    </>
  );
}
