import { Box, Text, useColorMode, useColorModeValue, useRadio } from "@chakra-ui/react";
import { useSimulateOperationInfos } from "../../state/hooks/useSimulateOperationInfos";
import { handleChangeColorModeValue } from "../../utils/theme";

// eslint-disable-next-line
export default function RadioTag(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();
  const { colorMode } = useColorMode();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        bg={handleChangeColorModeValue(colorMode, "blackAlpha.300", "whiteAlpha.300")}
        borderRadius="full"
        _checked={{
          bg: "primary.500",
          color: "white",
        }}
        _focus={{
          boxShadow: "outline",
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
