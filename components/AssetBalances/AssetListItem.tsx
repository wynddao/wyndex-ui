"use client";

import {
  Badge,
  Box,
  Button,
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
  useColorMode,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import { AssetWithBalance } from ".";
import { depositIbcModalAtom, withdrawIbcModalAtom } from "../../state/recoil/atoms/modal";
import { handleChangeColorModeValue } from "../../utils/theme";

interface AssetListItemProps {
  readonly assetDetails: AssetWithBalance;
}

export default function AssetListItem({
  assetDetails: { name, img, tokenType, balance, ibcBalance, denom, contractAddress },
}: AssetListItemProps) {
  const { colorMode } = useColorMode();
  const { onCopy, hasCopied, setValue } = useClipboard("");

  const setDepositIbcModalOpen = useSetRecoilState(depositIbcModalAtom);
  const setWithdrawIbcModalOpen = useSetRecoilState(withdrawIbcModalAtom);

  useEffect(() => {
    setValue(contractAddress || "");
  }, [contractAddress, setValue]);

  return (
    <Grid
      templateColumns={{
        base: "1fr 1fr",
        xl: "repeat(4, minmax(12rem, 1fr))",
      }}
      columnGap={{ base: 4 }}
      fontWeight="semibold"
      alignItems="center"
      bg={{
        base: handleChangeColorModeValue(colorMode, "whiteAlpha.600", "blackAlpha.300"),
        lg: handleChangeColorModeValue(colorMode, "whiteAlpha.300", "blackAlpha.500"),
      }}
      border={{ base: "1px solid", lg: "none" }}
      borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.200", "whiteAlpha.200")}
      borderRadius={{ base: "lg", lg: "none" }}
      _odd={{
        bg: {
          lg: handleChangeColorModeValue(colorMode, "whiteAlpha.600", "blackAlpha.300"),
        },
      }}
      _notLast={{
        borderBottom: "1px solid",
        borderBottomColor: handleChangeColorModeValue(colorMode, "blackAlpha.200", "whiteAlpha.200"),
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
            bg={handleChangeColorModeValue(colorMode, "whiteAlpha.500", "whiteAlpha.50")}
            border="1px solid"
            borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.100", "whiteAlpha.100")}
            borderRadius="full"
            mr={4}
          >
            <Image alt={`${name} logo`} src={img} />
          </Box>
          <Text fontSize="lg" mr={4}>
            {name}
          </Text>
          <Badge
            bg={handleChangeColorModeValue(colorMode, "primary.600", "primary.400")}
            color={tokenType === "native" ? "orange.500" : "purple.500"}
            borderRadius="full"
            px={2}
          >
            {tokenType === "native" ? "Native" : "CW20"}
          </Badge>
          {contractAddress ? (
            <Tooltip label={hasCopied ? "Copied!" : "Copy token address"}>
              <Tag
                size="md"
                variant="outline"
                colorScheme={handleChangeColorModeValue(colorMode, "blackAlpha", "whiteAlpha")}
                sx={{ cursor: "pointer" }}
                onClick={onCopy}
              >
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
      <GridItem
        colSpan={{ base: 2, md: 1 }}
        display="flex"
        alignItems={{ base: "center", md: "end" }}
        py={{ base: 2, md: 0 }}
        pr={{ base: 4, lg: 0 }}
        pl={{ base: 4, lg: 0 }}
      >
        <Text display={{ base: "block", md: "none" }}>IBC Balance</Text>
        <Box w="full" textAlign="end">
          <Text fontSize="lg" mb={0.5}>
            {ibcBalance}
          </Text>
          <Text fontSize="lg" opacity={0.7}>
            {denom}
          </Text>
        </Box>
      </GridItem>
      <GridItem
        colSpan={{ base: 2, md: 1 }}
        display="flex"
        alignItems={{ base: "center", md: "end" }}
        justifyContent="flex-end"
        py={{ base: 2, md: 0 }}
        pr={{ base: 4, lg: 0 }}
        pl={{ base: 4, lg: 0 }}
      >
        {tokenType === "native" ? (
          <Flex flexDirection="row" justifyContent="flex-end" gap={2} flexWrap="wrap">
            <Button fontSize="sm" onClick={() => setDepositIbcModalOpen({ isOpen: true, asset: name })}>
              IBC Deposit
            </Button>
            <Button fontSize="sm" onClick={() => setWithdrawIbcModalOpen({ isOpen: true, asset: name })}>
              IBC Withdraw
            </Button>
          </Flex>
        ) : (
          <Text fontSize="lg">—</Text>
        )}
      </GridItem>
    </Grid>
  );
}
