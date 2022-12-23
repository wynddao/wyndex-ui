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
import { AssetCw20WithBalance } from ".";
import { microamountToAmount } from "../../../utils/tokens";

interface AssetCw20ItemProps {
  readonly assetDetails: AssetCw20WithBalance;
}

export default function AssetCw20Item({
  assetDetails: { name, logoURI, balance, decimals, token_address },
}: AssetCw20ItemProps) {
  const { onCopy, hasCopied, setValue } = useClipboard("");

  useEffect(() => {
    setValue(token_address || "");
  }, [token_address, setValue]);

  return (
    <Grid
      templateColumns={{
        base: "1fr 1fr",
        xl: "repeat(2, minmax(12rem, 1fr))",
      }}
      columnGap={{ base: 4 }}
      fontWeight="semibold"
      alignItems="center"
      _odd={{
        bg: {
          lg: "wynd.base.subBg",
        },
      }}
      _notLast={{
        borderBottom: "1px solid",
        borderBottomColor: "wynd.gray.100",
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
            <Image alt={`${name} logo`} src={logoURI} width="100%" />
          </Box>
          <Box>
            <Text fontSize="lg" mr={4}>
              {name}
            </Text>
            {token_address ? (
              <Tooltip label={hasCopied ? "Copied!" : "Copy token address"}>
                <Tag
                  size="md"
                  variant="outline"
                  minW="fit-content"
                  sx={{ cursor: "pointer" }}
                  onClick={onCopy}
                >
                  <TagLabel sx={{ overflow: "hidden", whiteSpace: "nowrap", direction: "rtl" }}>
                    {token_address.slice(-5) + "…"}
                  </TagLabel>
                  <TagRightIcon as={FiCopy} />
                </Tag>
              </Tooltip>
            ) : null}
          </Box>
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
            {microamountToAmount(balance, decimals)}
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
}
