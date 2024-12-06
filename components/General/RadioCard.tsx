import { Box, useRadio } from "@chakra-ui/react";

export default function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box display="block" w={"100%"} as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        display="block"
        w={"100%"}
        _checked={{
          bg: "orange.500",
          color: "white",
          bgGradient: "linear(to-l, wynd.green.400, wynd.cyan.400)",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        _hover={{
          bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}
