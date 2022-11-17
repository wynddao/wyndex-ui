import {
  Button,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
  useDisclosure,
  useRadioGroup,
  Grid,
  useColorMode,
} from "@chakra-ui/react";
import { useRef } from "react";
import { BsHexagon, BsHexagonFill, BsExclamationCircleFill } from "react-icons/bs";
import { RiSettings4Fill } from "react-icons/ri";
import { handleChangeColorModeValue } from "../../utils/theme";
import RadioTag from "./RadioTag";

export default function Setting() {
  const { onToggle, onClose, isOpen } = useDisclosure();
  const initialFocusRef = useRef(null);
  const options = ["1%", "3%", "5%", "2.5%"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "setting",
    defaultValue: "1%",
    onChange: console.log, // eslint-disable-line
  });
  const group = getRootProps();
  const { colorMode } = useColorMode();
  return (
    <Popover isOpen={isOpen} onClose={onClose} initialFocusRef={initialFocusRef}>
      <PopoverTrigger>
        <Button
          position="relative"
          variant="unstyled"
          w="min"
          h="min"
          color={
            isOpen ? "orange.300" : handleChangeColorModeValue(colorMode, "blackAlpha.400", "whiteAlpha.500")
          }
          transition="all .5s"
          _hover={{
            color: isOpen
              ? "orange.200"
              : handleChangeColorModeValue(colorMode, "blackAlpha.500", "whiteAlpha.600"),
          }}
          _focus={{ boxShadow: "none" }}
          onClick={onToggle}
        >
          <Icon
            zIndex={-10}
            as={BsHexagonFill}
            w={8}
            h={8}
            color={handleChangeColorModeValue(colorMode, "gray.100", "whiteAlpha.300")}
          />
          <Icon position="absolute" top={0} left={1} right={0} zIndex={10} as={BsHexagon} w={8} h={8} />
          <Icon position="absolute" top={2} left={3} right={2} w={4} h={4} as={RiSettings4Fill} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bg={handleChangeColorModeValue(colorMode, "white", "black")}
        borderColor={handleChangeColorModeValue(colorMode, "blackAlpha.200", "whiteAlpha.400")}
        boxShadow="md"
        w="fit-content"
        right={4}
      >
        <PopoverBody p={{ base: 6, sm: 8 }}>
          <Text fontWeight="semibold" mb={1.5}>
            Transaction Setting
          </Text>
          <Text
            fontWeight="semibold"
            color={handleChangeColorModeValue(colorMode, "blackAlpha.500", "whiteAlpha.600")}
            verticalAlign="middle"
            mb={4}
          >
            Slippage tolerance&ensp;
            <Icon as={BsExclamationCircleFill} color="orange.200" />
          </Text>
          <Grid templateColumns={{ base: "1fr 1fr", sm: "repeat(4, 1fr)" }} gap={4} {...group}>
            {options.map((value) => {
              const radio = getRadioProps({ value });
              return (
                <RadioTag key={value} value={value} isDisabled={value === "2.5%" ? true : false} {...radio}>
                  {value}
                </RadioTag>
              );
            })}
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
