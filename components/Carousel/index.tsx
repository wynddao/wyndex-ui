import { Box } from "@chakra-ui/react";
import React, { Children, PropsWithChildren, useMemo, useRef, useState } from "react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/splide/css/sea-green";

interface IProps {
  numOfSlides: number;
  initialSlide?: number;
  withDots?: boolean;
}

const Carousel: React.FC<PropsWithChildren<IProps>> = ({ children, numOfSlides, initialSlide, withDots }) => {
  const child = Children.toArray(children);

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
