import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

interface BorderedBoxProps extends BoxProps {
  children: React.ReactNode;
  bgImageActive?: boolean;
}

export const BorderedBox = (props: BorderedBoxProps) => {
  return (
    <Box
      borderRadius="lg"
      border="1px solid"
      borderColor={"wynd.neutral.100"}
      boxShadow="md"
      backgroundColor={"wynd.gray.alpha.10"}
      backgroundImage={props.bgImageActive ? undefined : "url(/images/Vector2Bg.png)"}
      backgroundPosition="right"
      p={4}
      {...props}
    >
      {props.children}
    </Box>
  );
};
