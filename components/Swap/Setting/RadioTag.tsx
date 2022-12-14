import { Box, Text, useRadio } from "@chakra-ui/react";

export default function RadioTag(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        bg={"wynd.alpha.700"}
        borderRadius="full"
        _checked={{
          bgGradient: "linear(to-r, wynd.green.300, wynd.cyan.300)",
          color: "wynd.base.text",
        }}
        _disabled={{
          cursor: "not-allowed",
          opacity: 0.5,
        }}
        px={5}
        py={1}
      >
        <Text textAlign="center">{props.children}</Text>
      </Box>
    </Box>
  );
}
