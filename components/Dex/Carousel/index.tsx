import { Box, Flex } from "@chakra-ui/react";
import React, { Children, PropsWithChildren, useMemo, useRef, useState } from "react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/css/sea-green";

interface IProps {
  numOfSlides: number;
}

const Carousel: React.FC<PropsWithChildren<IProps>> = ({ children, numOfSlides }) => {
  const child = Children.toArray(children);

  if (!child.length)
    return (
      <Flex
        borderRadius="md"
        p={4}
        bg={"whiteAlpha.50"}
        mb={4}
        alignItems="center"
        justifyContent="center"
        minH="5rem"
      >
        <p color="wynd.neutral.500">You dont have any pool yet.</p>
      </Flex>
    );
  if (child.length <= numOfSlides)
    return (
      <Box mb={8} gap="1rem" display="grid" gridTemplateColumns={`repeat(${numOfSlides},1fr)`}>
        {children}
      </Box>
    );
  return (
    <Box my={8}>
      <Splide hasTrack={false} options={{ rewind: true, gap: "1rem", perPage: numOfSlides }}>
        <div className="custom-wrapper">
          <SplideTrack>
            {child.map((e, i) => {
              return <SplideSlide key={i}>{e}</SplideSlide>;
            })}
          </SplideTrack>
          <div className="splide__arrows custom" />
        </div>
      </Splide>
    </Box>
  );
};

export default Carousel;
