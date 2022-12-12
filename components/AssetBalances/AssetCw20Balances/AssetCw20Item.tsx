"use client";

import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { AssetWithBalance } from "..";

interface AssetCw20ItemProps {
  readonly assetDetails: AssetWithBalance;
}

export default function AssetCw20Item({
  assetDetails: { name, img, balance, denom, contractAddress },
}: AssetCw20ItemProps) {
  const { onCopy, hasCopied, setValue } = useClipboard("");

  useEffect(() => {
    setValue(contractAddress || "");
  }, [contractAddress, setValue]);

  return (
    <Grid
      templateColumns={{
        base: "1fr 1fr",
        xl: "repeat(2, minmax(12rem, 1fr))",
      }}
      columnGap={{ base: 4 }}
      fontWeight="semibold"
      alignItems="center"
      bg={{
        base: "wynd.neutral.300",
        lg: "wynd.neutral.300",
      }}
      border={{ base: "1px solid", lg: "none" }}
      borderColor={"wynd.neutral.200"}
      borderRadius={{ base: "lg", lg: "none" }}
      _odd={{
        bg: {
          lg: "wynd.neutral.200",
        },
      }}
      _notLast={{
        borderBottom: "1px solid",
        borderBottomColor: "wynd.neutral.200",
      }}
      p={4}
    >
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Flex justify={{ base: "center", md: "start" }} align="center">
          <Box
            w={{ base: 14, lg: 16 }}
            h={{ base: 14, lg: 16 }}
            minW={{ base: 14, lg: 16 }}
            minH={{ base: 14, lg: 16 }}
            maxW={{ base: 14, lg: 16 }}
            maxH={{ base: 14, lg: 16 }}
            bg={"whiteAlpha.500"}
            border="1px solid"
            borderColor={"wynd.neutral.900"}
            borderRadius="full"
            mr={4}
            overflow="hidden"
          >
            <Image alt={`${name} logo`} src={img} width="100%" />
          </Box>
          <Text fontSize="lg" mr={4}>
            {name}
          </Text>
          {contractAddress ? (
            <Tooltip label={hasCopied ? "Copied!" : "Copy token address"}>
              <Tag size="md" variant="outline" minW="fit-content" sx={{ cursor: "pointer" }} onClick={onCopy}>
                <TagLabel sx={{ overflow: "hidden", whiteSpace: "nowrap", direction: "rtl" }}>
                  {contractAddress.slice(-5) + "…"}
                </TagLabel>
                <TagRightIcon as={FiCopy} />
              </Tag>
            </Tooltip>
          ) : null}
        </Flex>
      </GridItem>
      <GridItem
        colSpan={{ base: 2, md: 1 }}
        display="flex"
        alignItems={{ base: "center", md: "end" }}
        py={{ base: 2, md: 0 }}
        pr={{ base: 4, lg: 0 }}
        pl={{ base: 4, lg: 0 }}
      >
        <Text display={{ base: "block", md: "none" }}>Balance</Text>
        <Box w="full" textAlign="end">
          <Text fontSize="lg" mb={0.5}>
            {balance}
          </Text>
          <Text fontSize="lg" opacity={0.7}>
            {denom}
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}
