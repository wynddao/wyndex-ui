import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { BsHexagon, BsHexagonFill } from "react-icons/bs";
import { CgArrowsExchangeV } from "react-icons/cg";

interface IProps {
  swapTokens: () => void;
}

const SwapIcon: React.FC<IProps> = ({ swapTokens }) => {
  return (
    <Flex
      className="swap-toggle-icon"
      justify="center"
      align="center"
      boxShadow="base"
      margin={{ base: "-1.5rem 0 -3.5rem 0", lg: "2rem -2rem 0 -2rem" }}
      transform={{ lg: "rotate(90deg)" }}
      transition="all ease-in 0.5s"
    >
      <Flex
        position="relative"
        as="button"
        zIndex={2}
        color={"wynd.alpha.700"}
        onClick={swapTokens}
        justify="center"
        align="center"
      >
        <Icon
          as={BsHexagonFill}
          w={{ base: 12, sm: 16 }}
          h={{ base: 12, sm: 16 }}
          color={"wynd.neutral.600"}
        />
        <Icon
          position="absolute"
          top={0}
          left={0}
          right={0}
          zIndex={1}
          as={BsHexagon}
          w={{ base: 12, sm: 16 }}
          h={{ base: 12, sm: 16 }}
          color={"wynd.alpha.200"}
        />
        <Icon
          position="absolute"
          top={2}
          left={2}
          right={2}
          w={{ base: 8, sm: 12 }}
          h={{ base: 8, sm: 12 }}
          as={CgArrowsExchangeV}
          color={"wynd.alpha.200"}
        />
      </Flex>
    </Flex>
  );
};

export default SwapIcon;
