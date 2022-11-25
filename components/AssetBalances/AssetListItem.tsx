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
import { ShowBalanceAssetsDetailsType } from ".";
import { depositIbcModalOpenAtom, withdrawIbcModalOpenAtom } from "../../state/recoil/atoms/modal";
import { TokenType } from "../../utils/experimentalTokenList";
import { handleChangeColorModeValue } from "../../utils/theme";

interface AssetListItemProps {
  readonly assetDetails: ShowBalanceAssetsDetailsType;
}

export default function AssetListItem({
  assetDetails: { name, imgSrc, type, amount, denom, contractAddress },
}: AssetListItemProps) {
  const { colorMode } = useColorMode();
  const { onCopy, hasCopied, setValue } = useClipboard("");

  const setDepositIbcModalOpen = useSetRecoilState(depositIbcModalOpenAtom);
  const setWithdrawIbcModalOpen = useSetRecoilState(withdrawIbcModalOpenAtom);

  useEffect(() => {
    setValue(contractAddress || "");
  }, [contractAddress, setValue]);

  return (
    <Grid
      templateColumns={{
        base: "1fr 1fr",
        lg: "repeat(2, minmax(12rem, 1fr)) minmax(6rem, 12rem)",
      }}
      columnGap={{ lg: 16 }}
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
            <Image alt={`${name} logo`} src={imgSrc} />
          </Box>
          <Text fontSize="lg" mr={4}>
            {name}
          </Text>
          <Badge
            bg={handleChangeColorModeValue(colorMode, "primary.600", "primary.400")}
            color={type === TokenType.Native ? "orange.500" : "purple.500"}
            borderRadius="full"
            px={2}
          >
            {type === TokenType.Native ? "Native" : "CW20"}
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
            {amount}
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
        <Flex flexDirection="column" gap={2}>
          <Flex flexDirection="row" gap={2}>
            <Button fontSize="sm" onClick={() => setDepositIbcModalOpen(true)}>
              IBC Deposit
            </Button>
            <Button fontSize="sm" onClick={() => setWithdrawIbcModalOpen(true)}>
              IBC Withdraw
            </Button>
          </Flex>
          <Button fontSize="sm" disabled>
            Derivative Staking
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
}
