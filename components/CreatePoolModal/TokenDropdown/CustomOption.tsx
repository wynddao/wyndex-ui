"use client";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { chakraComponents, GroupBase, OptionProps } from "chakra-react-select";
import { dataType } from "..";

const CustomOption = ({ children, ...props }: OptionProps<dataType, true, GroupBase<dataType>>) => {
  return (
    <chakraComponents.Option {...props}>
      <Flex id={props.data.value} align="center" w="full">
        <Box
          minW={{ base: 12, sm: 16 }}
          minH={{ base: 12, sm: 16 }}
          maxW={{ base: 12, sm: 16 }}
          maxH={{ base: 12, sm: 16 }}
          w="full"
          h="full"
          mr={{ base: 3, sm: 4 }}
        >
          <Image alt={`${props.data.label} logo`} src={props.data.imgSrc} />
        </Box>
        <Text fontSize={{ base: "lg", sm: "xl" }} fontWeight="bold" textAlign="start">
          {children}
        </Text>
      </Flex>
    </chakraComponents.Option>
  );
};

export default CustomOption;
