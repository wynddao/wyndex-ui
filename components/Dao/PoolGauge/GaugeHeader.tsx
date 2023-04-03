import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import { useGaugeConfigs } from "../../../state";
import { GaugeResponse } from "../../../state/clients/types/WyndexGaugeOrchestrator.types";
import { secondsToDays, secondsToWdhms } from "../../../utils/time";
import { microamountToAmount } from "../../../utils/tokens";
import TokenName from "../../Dex/TokenName";
import { useTranslation } from "i18next-ssg";

export const GaugeHeader = ({ gauge }: { gauge: GaugeResponse }) => {
  const router = useRouter();
  const { config } = useGaugeConfigs(gauge.adapter);
  const { t } = useTranslation("common");
  return (
    <Box bg="url(/castle.jpeg)" position="relative" rounded="lg" bgPosition="bottom" bgSize="cover">
      <Box bg="rgba(16, 11, 22,0.8)" w="full" h="full">
        <Flex gap={6} px={8} py={4} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
          <Heading
            bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
            bgClip="text"
            display="inline"
            fontSize={{ base: "3xl", md: "6xl" }}
            pt="8"
          >
            # {gauge.id}
          </Heading>
          <Text fontSize={{ base: "2xl", md: "2xl" }} fontWeight="bold">
            {gauge.title}
          </Text>
        </Flex>
      </Box>
      <Box>
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
              {t("gauges.rewardsPerEpoch")}
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {microamountToAmount(config?.rewards_asset?.amount, 6)}{" "}
              {config.rewards_asset.info.hasOwnProperty("token") ? (
                // @ts-ignore
                <TokenName symbol={true} address={config.rewards_asset.info.token} />
              ) : (
                <span>
                  {
                    // @ts-ignore
                    convertFromMicroDenom(config.rewards_asset.info.native)
                  }
                </span>
              )}
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              {t("time.epochLength")}
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {secondsToDays(gauge.epoch_size)} {t("time.days")}
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="semibold"
              color="wynd.gray.500"
              fontSize="xs"
              textTransform="uppercase"
              textAlign="center"
            >
              {t("time.nextEpoch")}
            </Text>
            <Text fontWeight="extrabold" fontSize={"sm"} textAlign="center">
              {/* @ts-ignore */}
              {"in"} {secondsToWdhms(gauge.next_epoch - Date.now() / 1000)}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Button
        // eslint-disable-next-line i18next/no-literal-string
        onClick={() => router.push(`/gauges`)}
        position="absolute"
        width="200px"
        height="100%"
        top="0"
        bgColor={"transparent"}
        bgGradient={"linear-gradient(90deg, rgba(113,204,152,0.5) 0%, rgba(0,0,0,0) 100%)"}
        _hover={{ bgColor: "transparent" }}
      >
        <BsChevronLeft /> {t("gauges.gaugesOverview")}
      </Button>
    </Box>
  );
};
