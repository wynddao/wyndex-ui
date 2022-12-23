import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import { getAssetByDenom, getDenom } from "../../../utils/assets";

interface IProps {
  route: { from: string | undefined; to: string | undefined }[];
}

const SwapRoute: React.FC<IProps> = ({ route }) => {
  return (
    <Flex gap="0.2rem" alignItems="center" justifyContent="center">
      {route.map(({ from, to }, i) => {
        if (i === route.length - 1) {
          return (
            <React.Fragment key={`routeEl-${i}`}>
              <Text textTransform="uppercase" color="wynd.gray.600" fontSize="xs">
                {getAssetByDenom(from as string).name}
              </Text>
              <Icon as={BsArrowRightShort} fontSize="lg" />
              <Text textTransform="uppercase" color="wynd.gray.600" fontSize="xs">
                {getAssetByDenom(to as string).name}
              </Text>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={`routeEl-${i}`}>
            <Text textTransform="uppercase" color="wynd.gray.600" fontSize="xs">
              {getDenom(getAssetByDenom(from as string))}
            </Text>
            <Icon as={BsArrowRightShort} fontSize="lg" />
          </React.Fragment>
        );
      })}
    </Flex>
  );
};

export default SwapRoute;
