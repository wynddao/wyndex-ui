import { Box, NumberInput, NumberInputField, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";

interface IProps {
  selected: string;
  value: string;
  setSlippage: (num: number) => void;
}

const RadioTag: React.FC<IProps> = ({ selected, value, setSlippage }) => {
  const [customVal, setCustomVal] = useState<string>("2.5");
  const onClick = () => {
    if (value.includes("custom")) {
      setSlippage(Number(customVal));
    } else {
      setSlippage(Number(value));
    }
  };

  const handlerCustomVal = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const value = Number(target.value);
    setSlippage(value);
    setCustomVal(target.value);
    if (value > 50) {
      setSlippage(50);
      setCustomVal("50");
    }
  };

  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      bg={value.includes("custom") ? "whiteAlpha.100" : "wynd.alpha.700"}
      bgGradient={
        value === selected && !value.includes("custom") ? "linear(to-r, wynd.green.300, wynd.cyan.300)" : ""
      }
      _focus={value.includes("custom") ? { bg: "whiteAlpha.200" } : {}}
      _hover={value.includes("custom") ? { bg: "whiteAlpha.200" } : {}}
      borderRadius={value.includes("custom") ? "md" : "full"}
      outline="1px solid transparent"
      outlineColor={value.includes("custom") && value === selected ? "wynd.cyan.500" : "transparent"}
      px={{ base: 3, md: 5 }}
      py={1}
      transition="all linear 0.5s"
      maxW="fit-content"
    >
      {value === "custom" ? (
        <NumberInput
          defaultValue={Number(customVal)}
          min={0}
          max={50}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NumberInputField
            placeholder="Custom slippage"
            onChange={handlerCustomVal}
            value={customVal}
            maxW="fit-content"
            minW="2rem"
            padding={0}
            border={0}
            height="initial"
            outline="none"
            _focus={{ outline: "none" }}
            _focusVisible={{ outline: "none" }}
            fontSize={{ base: "sm", md: "md" }}
          />
          <span>%</span>
        </NumberInput>
      ) : (
        <Text textAlign="center">{value}%</Text>
      )}
    </Box>
  );
};

export default RadioTag;
