import { Box, GridItem, Text } from "@chakra-ui/react";
import { secondsToDays } from "../../../../utils/time";
import { getApr } from "../util/apr";
import { useTranslation } from "i18next-ssg";

export default function UnbondingsItem({
  unbonding_period,
  apr,
}: {
  unbonding_period: number;
  apr: {
    unbonding_period: number;
    apr: number;
  }[];
}) {
  const { t } = useTranslation("common");
  return (
    <GridItem pos="relative">
      <Box
        bgImage={"/images/Vector3.png"}
        bgPos="right"
        bgRepeat="no-repeat"
        bgColor={"wynd.base.sidebar"}
        borderRadius="xl"
        py={6}
        px={8}
      >
        <Text fontWeight="bold" fontSize="2xl">
          {secondsToDays(unbonding_period)} {t("time.days")}
        </Text>
        <Text fontWeight="bold" fontSize="xl">
          {getApr(apr, unbonding_period)}
        </Text>
      </Box>
    </GridItem>
  );
}
