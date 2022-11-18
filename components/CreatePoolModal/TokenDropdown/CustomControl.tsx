"use client";

import { Flex, Icon } from "@chakra-ui/react";
import { chakraComponents, ControlProps } from "chakra-react-select";
import { RiSearch2Fill } from "react-icons/ri";
import { dataType } from "..";

const CustomControl = ({ children, ...props }: ControlProps<dataType, true>) => {
  return (
    <chakraComponents.Control {...props}>
      <Flex align="center" pl={4}>
        <Icon as={RiSearch2Fill} />
      </Flex>
      {children}
    </chakraComponents.Control>
  );
};

export default CustomControl;
