import { Box, Flex, Heading, Text, Tooltip } from "@chakra-ui/react";
import { IoIosHelp, IoIosHelpCircleOutline } from "react-icons/io";
import { Supply } from "../../../state/clients/types/WyndLsdHub.types";
import { getAssetList } from "../../../utils/getAssetList";

export const LsdSingleHeader = ({ supply }: { supply: Supply }) => {
  const assetList = getAssetList().tokens;
  const decimals = assetList.find((el) => el.denom === supply.bond_denom)?.decimals ?? 6;
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
          <Flex justifyContent="center" alignItems="center">
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {((Number(supply.total_bonded) + Number(supply.total_unbonding)) / 10 ** decimals).toFixed(2)}
            </Text>
            <Tooltip label="This value is updated once per day.">
              <span>
                <IoIosHelp color="yellow" style={{ cursor: "pointer" }} size="30" />
              </span>
            </Tooltip>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
