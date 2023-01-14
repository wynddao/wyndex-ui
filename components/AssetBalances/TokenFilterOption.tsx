import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";

interface TokenFilterOptionProps extends UseRadioProps {
  readonly children: React.ReactNode;
}

export default function TokenFilterOption({ children, ...radioProps }: TokenFilterOptionProps) {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps);

  return (
    <Box as="label">
      <input {...getInputProps()} />
      <Box
        {...getCheckboxProps()}
        cursor="pointer"
        minWidth="70px"
        textAlign="center"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          bgGradient: "linear(to-l, wynd.green.400, wynd.cyan.400)",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={2}
        py={2}
      >
        {children}
      </Box>
    </Box>
  );
}
