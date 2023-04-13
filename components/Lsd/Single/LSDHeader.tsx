import { Box, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import { IoIosHelp } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { useIndexerInfos, useTokenInfo } from "../../../state";
import { Supply } from "../../../state/clients/types/WyndLsdHub.types";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { getAssetList } from "../../../utils/getAssetList";
import { getAssetPriceByCurrency } from "../../../utils/assets";
import { formatCurrency } from "../../../utils/currency";

export const LsdSingleHeader = ({
  supply,
  token,
  exchangeRate,
}: {
  supply: Supply;
  token: string;
  exchangeRate: string;
}) => {
  const assetList = getAssetList().tokens;
  const decimals = assetList.find((el) => el.denom === supply.bond_denom)?.decimals ?? 6;
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);
  const { totalSupply } = useTokenInfo(token);
  const assetPrice = getAssetPriceByCurrency(currency, { native: supply.bond_denom }, assetPrices);
  return (
    <Box bg="url(/trippy2.png)" pt={36} rounded="lg" bgPosition="center" bgSize="cover">
      <Flex
        mb={12}
        py={3}
        bg="rgba(16, 11, 22,0.8)"
        w="full"
        h="full"
        flexFlow="column"
        gap="10"
        roundedTop="lg"
      >
        <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
          LSD $JUNO
        </Heading>
      </Flex>
      <Flex
        bg="rgba(16, 11, 22,0.9)"
        gap={6}
        px={3}
        py={2}
        justifyContent={"space-around"}
        borderBottomRadius="lg"
        flexWrap="wrap"
      >
        <Box>
          <Text
            fontWeight="semibold"
            color="wynd.gray.500"
            fontSize="xs"
            textTransform="uppercase"
            textAlign="center"
          >
            Tokens staked
          </Text>
          <Flex justifyContent="center" alignItems="center">
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {(Number(supply.total_bonded) / 10 ** decimals).toFixed(2)}
            </Text>
            <Tooltip label="This value is updated once per day.">
              <span>
                <IoIosHelp color="yellow" style={{ cursor: "pointer" }} size="30" />
              </span>
            </Tooltip>
          </Flex>
        </Box>
        <Box>
          <Text
            fontWeight="semibold"
            color="wynd.gray.500"
            fontSize="xs"
            textTransform="uppercase"
            textAlign="center"
          >
            Total TVL
          </Text>
          <Flex mt={"4px"} justifyContent="center" alignItems="center">
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {formatCurrency(
                currency,
                ((assetPrice * Number(exchangeRate) * Number(totalSupply)) / 10 ** decimals).toFixed(2),
              )}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
