"use client";
import { Box, Flex, keyframes, Text } from "@chakra-ui/react";
import { usePrefersReducedMotion } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

const floating = keyframes`
  from { transform: translateY(-0.5rem); }
  to { transform: translateY(0.5rem); }
`;

export default function MysteryBoxContainer() {
  const animation = usePrefersReducedMotion() ? undefined : `${floating} 1.5s ease-in-out infinite alternate`;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box h="100vh" display="flex" alignItems="center" justifyContent="center" className="mistery-box">
      <Box
        as="button"
        pos="relative"
        _hover={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
        outline="none"
      >
        <Box
          zIndex={1}
          pos="relative"
          width="160px"
          height="92.38px"
          background="wynd.green.500"
          margin="46.19px 0"
          className="hexagon-back"
          filter="blur(20px)"
          padding="0"
          transition="all ease-in 1s"
        />
        <Box
          className="box"
          animation={open ? "" : animation}
          width="100%"
          height="100%"
          position="absolute"
          top="0"
          zIndex={4}
        >
          <Box
            zIndex={4}
            bgImage="url('/mistery-box-back.png')"
            backgroundSize="cover"
            backgroundPosition="center"
            width="100%"
            height="100%"
            position="absolute"
            top="0"
            left="0"
            transition="all ease-in 1s"
          />
          <Box
            zIndex={6}
            bgImage="url('/mistery-box-top.png')"
            backgroundSize="cover"
            backgroundPosition="center"
            width="100%"
            height="100%"
            position="absolute"
            top="0"
            left="0"
            transition="all ease-in 1s"
            className={`box-top ${open ? "box-top-open" : ""}`}
          />
          <Box
            zIndex={6}
            bgImage="url('/mistery-box-left.png')"
            backgroundSize="cover"
            backgroundPosition="center"
            width="100%"
            height="100%"
            position="absolute"
            top="0"
            left="0"
            transition="all ease-in 1s"
            className={`box-left ${open ? "box-left-open" : ""}`}
          />
          <Box
            zIndex={6}
            bgImage="url('/mistery-box-right.png')"
            backgroundSize="cover"
            backgroundPosition="center"
            width="100%"
            height="100%"
            position="absolute"
            top="0"
            left="0"
            transition="all ease-in 1s"
            className={`box-right ${open ? "box-right-open" : ""}`}
          />
        </Box>
        <Box
          zIndex={open ? 9 : 2}
          backgroundSize="cover"
          backgroundPosition="center"
          width="7rem"
          height="6rem"
          borderRadius="50%"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          margin="auto"
          transition="all ease-in 1s"
          transform="scale(0)"
          className={`druid ${open ? "druid-open" : ""}`}
        >
          <Link target="_blank" href="https://medium.com/wynddao/lsd-on-wynd-dao-6afb16751889">
            <Flex flexDir="column" alignItems="center" justifyContent="center">
              <Text
                bgGradient="linear(to-l, wynd.green.500, wynd.cyan.500)"
                bgClip="text"
                display="inline"
                fontSize="xl"
              >
                Liquid Staking
              </Text>
              <Text fontSize="xs">soon!</Text>
            </Flex>
          </Link>
        </Box>
        <Box
          zIndex={open ? 8 : 1}
          width="7rem"
          height="7rem"
          position="absolute"
          borderRadius="50%"
          background="black"
          top="0"
          left="0"
          right="0"
          bottom="0"
          margin="auto"
          transition="all ease-in 1s"
          transform="scale(0)"
          className={`druid ${open ? "druid-open" : ""}`}
        />
      </Box>
    </Box>
  );
}
