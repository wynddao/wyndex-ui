import React, { ChangeEvent, useState } from "react";
import { Box, NumberInput, NumberInputField, Text } from "@chakra-ui/react";

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
      bg={"wynd.alpha.700"}
      borderRadius="full"
      bgGradient={value === selected ? "linear(to-r, wynd.green.300, wynd.cyan.300)" : ""}
      px={5}
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
