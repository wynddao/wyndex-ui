import { Box } from "@chakra-ui/react";
import React from "react";

export const BorderedBox = ({
  children,
  bgImage = true,
}: {
  children: React.ReactNode;
  bgImage?: boolean;
}) => {
  return (
    <Box
      borderRadius="lg"
      border="1px solid"
      borderColor={"wynd.neutral.100"}
      boxShadow="md"
      backgroundColor={"wynd.gray.alpha.10"}
      backgroundImage={bgImage ? "url(/images/Vector2Bg.png)" : undefined}
      backgroundPosition="right"
      p={4}
    >
      {children}
    </Box>
  );
};
