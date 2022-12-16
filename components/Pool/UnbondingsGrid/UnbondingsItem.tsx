import { Box, GridItem, ScaleFade, Text } from "@chakra-ui/react";
import { useState } from "react";
import { secondsToDays } from "../../../utils/time";

export default function UnbondingsItem({ unbonding_period }: { unbonding_period: number }) {
  const [visibleHover, setVisibleHover] = useState<boolean>(false);

  const handleMouseEnter = () => setVisibleHover(true);
  const handleMouseLeave = () => setVisibleHover(false);

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
        onMouseEnter={handleMouseEnter}
      >
        <Text fontWeight="bold" fontSize="2xl">
          {secondsToDays(unbonding_period)} Days
        </Text>
        <Text
          fontWeight="bold"
          fontSize="xl"
        >
          20% APR @TODO
        </Text>
      </Box>
      {visibleHover && (
        <ScaleFade
          style={{ position: "absolute", top: 0, width: "100%" }}
          initialScale={0.9}
          in={visibleHover}
        >
          <Box
            bgImage={"/images/Vector3.png"}
            bgPos="right"
            bgRepeat="no-repeat"
            bgColor={"wynd.base.subBg"}
            borderRadius="xl"
            borderColor={"wynd.base.sideBar"}
            borderWidth={2}
            py={6}
            px={8}
            pos="absolute"
            top={0}
            width={"100%"}
            onMouseLeave={handleMouseLeave}
          >
            <Text fontWeight="bold" fontSize="2xl">
              Incetives
            </Text>
            <Text
              fontWeight="bold"
              fontSize="xl"
              display="inline"
            >
              +1% @TODO
            </Text>
          </Box>
        </ScaleFade>
      )}
    </GridItem>
  );
}
