import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRecoilValue } from "recoil";
import { useIndexerInfos } from "../../state";
import { currencyAtom } from "../../state/recoil/atoms/settings";
import { FEE_DENOM, WYND_TOKEN_ADDRESS } from "../../utils";
import { formatCurrency } from "../../utils/currency";

export interface AssetsRecap {
  readonly total: string;
  readonly locked: string;
  readonly available: string;
}

export default function AssetsRecapGallery() {
  const { address: walletAddress } = useWallet();
  const { userFiat, assetPrices } = useIndexerInfos({ fetchCw20Balances: true });
  const currency = useRecoilValue(currencyAtom);

  const junoAssetPrice = assetPrices.find((el) => el.asset === FEE_DENOM);
  const junoPrice = currency === "USD" ? junoAssetPrice?.priceInUsd : junoAssetPrice?.priceInEur;
  const junoPriceFormatted = formatCurrency(currency, String(junoPrice ?? "0"));
  const wyndexAssetPrice = assetPrices.find((el) => el.asset === WYND_TOKEN_ADDRESS);
  const wyndexPrice = currency === "USD" ? wyndexAssetPrice?.priceInUsd : wyndexAssetPrice?.priceInEur;
  const wyndexPriceFormatted = formatCurrency(currency, String(wyndexPrice ?? "0"));

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
              ? formatCurrency(
                  currency,
                  `${
                    (currency === "USD" ? userFiat.availableBalance.usd : userFiat.availableBalance.eur) +
                    (currency === "USD" ? userFiat.lockedBalance.usd : userFiat.lockedBalance.eur)
                  }`,
                )
              : "-"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Bonded Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {walletAddress
              ? formatCurrency(
                  currency,
                  `${currency === "USD" ? userFiat.lockedBalance.usd : userFiat.lockedBalance.eur}`,
                )
              : "-"}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            Available Assets
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold">
            {walletAddress
              ? formatCurrency(
                  currency,
                  `${currency === "USD" ? userFiat.availableBalance.usd : userFiat.availableBalance.eur}`,
                )
              : "-"}
          </Text>
        </Box>
      </Grid>
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
            JUNO Price
          </Text>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="extrabold"
            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
            bgClip="text"
          >
            {junoPriceFormatted}
          </Text>
        </Box>
        <Box py={{ md: 2 }}>
          <Text fontWeight="semibold" opacity={0.7}>
            WYND Price
          </Text>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="extrabold"
            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
            bgClip="text"
          >
            {wyndexPriceFormatted}
          </Text>
        </Box>
      </Grid>
    </>
  );
}
