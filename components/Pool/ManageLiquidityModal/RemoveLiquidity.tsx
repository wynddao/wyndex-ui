"use client";

import {
  Box,
  Button,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const gaps = [25, 50, 75, 100];

export default function RemoveLiquidity() {
  const [removeValue, setRemoveValue] = useState(35);

  return (
    <Box>
      <Text fontSize={{ base: "5xl", sm: "7xl" }} fontWeight="bold" textAlign="center" py={10}>
        {removeValue}%
      </Text>
      <Slider
        min={0}
        max={100}
        step={0.1}
        size="lg"
        colorScheme="primary"
        defaultValue={removeValue}
        value={removeValue}
        onChange={(val) => setRemoveValue(val)}
        mb={16}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb w={{ base: 5, sm: 7 }} h={{ base: 5, sm: 7 }} />
      </Slider>
      <SimpleGrid columns={{ sm: 4 }} spacing={4} mb={20}>
        {gaps.map((v, i) => (
          <Button key={i} variant="outline" onClick={() => setRemoveValue(v)}>
            {v}%
          </Button>
        ))}
      </SimpleGrid>
      <Box px={{ sm: 12 }}>
        <Button isDisabled={removeValue > 0 ? false : true} w="full" size="lg" h={{ base: 12, sm: 14 }}>
          Remove Liquidity
        </Button>
      </Box>
    </Box>
  );
}
