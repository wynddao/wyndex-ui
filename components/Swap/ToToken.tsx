import {
  Button,
  Flex,
  Icon,
  SystemStyleObject,
  useColorMode,
  useDisclosure,
  Text,
  Box,
  Image,
  useOutsideClick,
  Skeleton,
  Collapse,
} from "@chakra-ui/react";
import { useRef } from "react";
import { AsyncSelect, chakraComponents, ControlProps, GroupBase, OptionProps } from "chakra-react-select";
import { RiSearch2Fill } from "react-icons/ri";
import SkeletonOptions from "./SkeletonOptions";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { handleChangeColorModeValue } from "../../utils/theme";
import { TokenInfo } from "../../utils/experimentalTokenList";

export default function ToToken({
  data,
  toItem,
  setToItem,
}: {
  data: TokenInfo[];
  toItem: TokenInfo | undefined;
  setToItem: (value: TokenInfo) => void;
}) {
  const toMenuRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const customStyles = {
    control: (provided: SystemStyleObject) => ({
      ...provided,
      bg: handleChangeColorModeValue(colorMode, "blackAlpha.50", "whiteAlpha.50"),
    }),
    menu: (provided: SystemStyleObject) => ({
      ...provided,
      maxH: { base: "sm", sm: "2xl" },
      position: "relative",
      mt: 6,
      mb: 0,
    }),
    menuList: (provided: SystemStyleObject) => ({
      ...provided,
      bg: "transparent",
      border: "none",
      borderRadius: "none",
      py: 0,
      pr: { base: 2, sm: 4 },
      // For Firefox
      scrollbarWidth: "auto",
      scrollbarColor: handleChangeColorModeValue(
        colorMode,
        "rgba(0,0,0,0.3) rgba(0,0,0,0.2)",
        "rgba(255,255,255,0.2) rgba(255,255,255,0.1)",
      ),
      // For Chrome and other browsers except Firefox
      "&::-webkit-scrollbar": {
        width: "18px",
        background: handleChangeColorModeValue(colorMode, "rgba(160,160,160,0.1)", "rgba(255,255,255,0.1)"),
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: handleChangeColorModeValue(colorMode, "rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"),
        borderRadius: "4px",
      },
    }),
    option: (provided: SystemStyleObject, state: { isSelected: boolean }) => ({
      ...provided,
      borderRadius: "lg",
      bg: state.isSelected
        ? handleChangeColorModeValue(colorMode, "primary.100", "primary.500")
        : "transparent",
      color: "inherit",
      _hover: {
        bg: state.isSelected
          ? handleChangeColorModeValue(colorMode, "primary.100", "primary.500")
          : handleChangeColorModeValue(colorMode, "blackAlpha.200", "whiteAlpha.200"),
      },
      _disabled: {
        _hover: { bg: "transparent" },
      },
    }),
  };
  const IndicatorSeparator = () => {
    return null;
  };
  const DropdownIndicator = () => {
    return null;
  };
  const CustomOption = ({ children, ...props }: OptionProps<TokenInfo, true, GroupBase<TokenInfo>>) => {
    return (
      <chakraComponents.Option {...props}>
        <Flex id={props.data.name} align="center" w="full">
          <Flex align="center" flex={1} mr={2}>
            <Box
              minW={{ base: 12, sm: 16 }}
              minH={{ base: 12, sm: 16 }}
              maxW={{ base: 12, sm: 16 }}
              maxH={{ base: 12, sm: 16 }}
              w="full"
              h="full"
              mr={{ base: 3, sm: 4 }}
            >
              <Image src={props.data.imgSrc} />
            </Box>
            <Box>
              <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="bold" textAlign="start">
                {children}
              </Text>
              <Text
                fontSize={{ base: "md", sm: "lg" }}
                fontWeight="bold"
                textAlign="start"
                color={handleChangeColorModeValue(colorMode, "blackAlpha.700", "whiteAlpha.700")}
              >
              </Text>
            </Box>
          </Flex>
          <Text
            fontSize={{ base: "md", sm: "xl" }}
            fontWeight="semibold"
            textAlign="end"
            wordBreak="break-word"
          >
            3.141595
          </Text>
        </Flex>
      </chakraComponents.Option>
    );
  };
  const CustomControl = ({ children, ...props }: ControlProps<TokenInfo, true>) => {
    return (
      <chakraComponents.Control {...props}>
        <Flex align="center" pl={4}>
          <Icon as={RiSearch2Fill} />
        </Flex>
        {children}
      </chakraComponents.Control>
    );
  };

  useOutsideClick({
    ref: toMenuRef,
    handler: () => onClose(),
  });

  return (
    <Box
      ref={toMenuRef}
      position="relative"
      bg={handleChangeColorModeValue(colorMode, "gray.100", "gray.700")}
      boxShadow={isOpen ? "0 0 20px -8px rgba(105, 88, 164, 0.5)" : "none"}
      borderRadius="xl"
      p={6}
    >
      <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold" mb={4}>
        To
      </Text>
      <Flex align="center" maxW="full" h="fit-content">
        <Button
          flex={1}
          variant="unstyled"
          w="fit-content"
          h="fit-content"
          whiteSpace="normal"
          _focus={{ boxShadow: "none" }}
          onClick={onToggle}
          mr={2}
        >
          {toItem ? (
            <Flex align="center">
              <Box
                minW={{ base: 12, sm: 20 }}
                minH={{ base: 12, sm: 20 }}
                maxW={{ base: 12, sm: 20 }}
                maxH={{ base: 12, sm: 20 }}
                w="full"
                h="full"
                borderRadius="full"
                border="2px solid"
                borderColor="orange.200"
                mr={{ base: 2, sm: 4 }}
              >
                <Image src={toItem.imgSrc} />
              </Box>
              <Text fontSize={{ base: "xl", sm: "3xl" }} fontWeight="bold" textAlign="start">
                {toItem.name}&nbsp;
              </Text>
              <Icon
                as={isOpen ? FiChevronUp : FiChevronDown}
                fontSize={{ base: "xl", sm: "3xl" }}
                color={handleChangeColorModeValue(colorMode, "blackAlpha.700", "whiteAlpha.700")}
              />
            </Flex>
          ) : (
            <Flex align="center">
              <Skeleton w={{ base: 12, sm: 20 }} h={{ base: 12, sm: 20 }} mr={{ base: 2, sm: 4 }} />
              <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 10 }} mr={{ base: 2, sm: 4 }} />
            </Flex>
          )}
        </Button>
        {toItem ? (
          <Flex maxW={{ base: 28, sm: 48, md: "initial" }} wrap="wrap" justify="end">
            <Text
              fontSize={{ base: "lg", sm: "2xl", md: "3xl" }}
              fontWeight="bold"
              color={handleChangeColorModeValue(colorMode, "blackAlpha.800", "whiteAlpha.800")}
              textAlign="end"
              wordBreak="break-word"
              mb={{ base: 1, sm: 2 }}
              mr={{ base: 0, md: 2 }}
            >
              ≈&nbsp;3.265358
            </Text>
            <Text
              fontSize={{ base: "lg", sm: "2xl", md: "3xl" }}
              fontWeight="bold"
              textAlign="end"
              color={handleChangeColorModeValue(colorMode, "blackAlpha.800", "whiteAlpha.800")}
            >
              {toItem.name}
            </Text>
          </Flex>
        ) : (
          <Skeleton w={{ base: 20, sm: 36 }} h={{ base: 8, sm: 10 }} />
        )}
      </Flex>
      <Box
        position="absolute"
        zIndex="dropdown"
        bg={handleChangeColorModeValue(colorMode, "gray.100", "gray.700")}
        boxShadow={isOpen ? "0 12px 20px -8px rgba(105, 88, 164, 0.5)" : "none"}
        borderRadius="xl"
        left={0}
        right={0}
        px={6}
      >
        <Collapse in={isOpen} animateOpacity>
          <Box py={6}>
            {toItem ? (
              <AsyncSelect
                placeholder="Search"
                chakraStyles={customStyles}
                isClearable={false}
                blurInputOnSelect={true}
                controlShouldRenderValue={false}
                menuIsOpen={true}
                loadingMessage={() => <SkeletonOptions />}
                defaultOptions={data}
                value={toItem}
                onChange={(selectedOption) => {
                  let value = {};
                  value = { ...selectedOption };
                  setToItem(value as TokenInfo);
                  onClose();
                }}
                loadOptions={(inputValue, callback) => {
                  setTimeout(() => {
                    const values = data.filter((option) =>
                      option.name.toLowerCase().includes(inputValue.toLowerCase()),
                    );
                    callback(values);
                  }, 1000);
                }}
                components={{
                  DropdownIndicator,
                  IndicatorSeparator,
                  Control: CustomControl,
                  Option: CustomOption,
                }}
              />
            ) : (
              <SkeletonOptions />
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}
