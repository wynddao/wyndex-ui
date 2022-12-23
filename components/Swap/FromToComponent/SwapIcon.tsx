import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { BsHexagon, BsHexagonFill } from "react-icons/bs";
import { CgArrowsExchangeV } from "react-icons/cg";
import { motion, useAnimation } from "framer-motion";
import GradientIcon from "./GradientIcon";
interface IProps {
  swapTokens: () => void;
}

const SwapIcon: React.FC<IProps> = ({ swapTokens }) => {
  const controls = useAnimation();

  const handlerClick = () => {
    controls.start({ rotate: 360, transition: { duration: 0.5 }, transitionEnd: { rotate: 0 } });
    swapTokens();
  };

  return (
    <Flex
      className="swap-toggle-icon"
      justify="center"
      align="center"
      margin={{ base: "-1.5rem 0 -3.5rem 0", lg: "2rem -2rem 0 -2rem" }}
      transform={{ lg: "rotate(90deg)" }}
      transition="all ease-in 0.5s"
    >
      <Flex
        as={motion.button}
        animate={controls}
        position="relative"
        zIndex={2}
        onClick={handlerClick}
        justify="center"
        align="center"
        whileTap={{ scale: 0.95 }}
      >
        <GradientIcon id="swap-icon-gradient" gradient1="#389270" gradient2="#0E67AA" />
        <Icon
          as={BsHexagonFill}
          w={{ base: 12, sm: 16 }}
          h={{ base: 12, sm: 16 }}
          fill="url(#swap-icon-gradient)"
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
          color={"wynd.gray.900"}
          opacity="50%"
        />
        <Icon
          position="absolute"
          top={2}
          left={2}
          right={2}
          w={{ base: 8, sm: 12 }}
          h={{ base: 8, sm: 12 }}
          as={CgArrowsExchangeV}
          opacity="50%"
          color={"wynd.gray.900"}
        />
      </Flex>
    </Flex>
  );
};

export default SwapIcon;
