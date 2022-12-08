import {
  Button,
  Flex,
  Icon,
  SystemStyleObject,
  useDisclosure,
  Text,
  Box,
  Image,
  useOutsideClick,
  Skeleton,
  Editable,
  EditablePreview,
  EditableInput,
  Collapse,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  AsyncSelect,
  chakraComponents,
  ControlProps,
  GroupBase,
  OptionBase,
  OptionProps,
} from "chakra-react-select";
import { RiSearch2Fill } from "react-icons/ri";
import SkeletonOptions from "./SkeletonOptions";
import { BsHexagon, BsHexagonFill } from "react-icons/bs";
import { CgArrowsExchangeV } from "react-icons/cg";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { Asset } from "../../utils/types";

export default function FromToken({
  data,
  fromItem,
  setFromItem,
  toItem,
  setToItem,
  tokenInputValue,
  setTokenInputValue,
}: {
  data: Asset[];
  fromItem: Asset | undefined;
  setFromItem: (value: Asset) => void;
  toItem: Asset | undefined;
  setToItem: (value: Asset) => void;
  tokenInputValue: string;
  setTokenInputValue: (value: string) => void;
}) {
  const [checked, setChecked] = useState([false, false]);
  const [checkedItems, setCheckedItems] = useState([
    {
      label: "MAX",
      id: "max",
      lightBg: "blackAlpha.300",
      darkBg: "whiteAlpha.300",
    },
    {
      label: "HALF",
      id: "half",
      lightBg: "blackAlpha.300",
      darkBg: "whiteAlpha.300",
    },
  ]);
  const fromMenuRef = useRef<HTMLDivElement | null>(null);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const customStyles = {
    control: (provided: SystemStyleObject) => ({
      ...provided,
      bg: "wynd.neutral.100",
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
      scrollbarColor: "wynd.alpha.900",
      // For Chrome and other browsers except Firefox
      "&::-webkit-scrollbar": {
        width: "18px",
        background: "wynd.alpha.800",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "wynd.alpha.900",
        borderRadius: "4px",
      },
    }),
    option: (provided: SystemStyleObject, state: { isSelected: boolean }) => ({
      ...provided,
      borderRadius: "lg",
      bg: state.isSelected ? "wynd.cyan.200" : "transparent",
      color: "inherit",
      _hover: {
        bg: state.isSelected ? "wynd.cyan.300" : "wynd.alpha.700",
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
  const CustomOption = ({ children, ...props }: OptionProps<Asset, true, GroupBase<Asset>>) => {
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
              <Image src={props.data.img} />
            </Box>
            <Box>
              <Text fontSize={{ base: "lg", sm: "2xl" }} fontWeight="bold" textAlign="start">
                {children}
              </Text>
              <Text
                fontSize={{ base: "md", sm: "lg" }}
                fontWeight="bold"
                textAlign="start"
                color={"wynd.neutral.800"}
              ></Text>
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
  const CustomControl = ({ children, ...props }: ControlProps<Asset, true>) => {
    return (
      <chakraComponents.Control {...props}>
        <Flex align="center" pl={4}>
          <Icon as={RiSearch2Fill} />
        </Flex>
        {children}
      </chakraComponents.Control>
    );
  };
  const AvailableCheckbox = ({
    label,
    id,
    lightBg,
    darkBg,
    index,
  }: {
    label: string;
    id: string;
    lightBg: string;
    darkBg: string;
    index: number;
  }) => {
    return (
      <Button
        id={id}
        variant="unstyled"
        fontSize="xs"
        bg={lightBg}
        color={"wynd.neutral.800"}
        borderRadius="md"
        fontWeight="semibold"
        _focus={{
          boxShadow: "none",
        }}
        onClick={(e) => {
          if (e.currentTarget.id === id) {
            setChecked((pre) => {
              const newArr = pre.map((v, i) => {
                if (i === index) return !v;
                return false;
              });
              return newArr;
            });
          }
        }}
        h={7}
        w={12}
      >
        {label}
      </Button>
    );
  };

  useEffect(() => {
    setCheckedItems((pre) => {
      const newItems = pre.map(({ ...rest }, i) => ({
        ...rest,
        lightBg: checked[i] ? "primary.100" : "blackAlpha.300",
        darkBg: checked[i] ? "primary.800" : "whiteAlpha.300",
      }));
      return newItems;
    });
  }, [checked]);
  useOutsideClick({
    ref: fromMenuRef,
    handler: () => onClose(),
  });

  return (
    <Box
      ref={fromMenuRef}
      position="relative"
      bg={"wynd.neutral.200"}
      borderRadius="xl"
      boxShadow={isOpen ? "0 0 20px -8px rgba(0, 0, 0, 0.5)" : "none"}
      p={6}
    >
      <Flex
        position="relative"
        justify="space-between"
        flexDirection={{ base: "column", sm: "row" }}
        align={{ base: "start", sm: "center" }}
        mb={4}
      >
        <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold">
          From
        </Text>
        <Flex maxW={{ sm: "2xs" }} w="full" justify="space-between" align="center">
          <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold">
            Available
          </Text>
          <Text fontSize={{ base: "md", sm: "lg" }} fontWeight="bold" color="primary.300">
            0.2186
          </Text>
          {checkedItems.map(({ label, id, lightBg, darkBg }, index) => (
            <AvailableCheckbox
              key={index}
              label={label}
              id={id}
              lightBg={lightBg}
              darkBg={darkBg}
              index={index}
            />
          ))}
        </Flex>
      </Flex>
      <Flex align="center" maxW="full" h="fit-content">
        <Button
          flex={2}
          variant="unstyled"
          w="fit-content"
          h="fit-content"
          whiteSpace="normal"
          _focus={{ boxShadow: "none" }}
          onClick={onToggle}
          mr={2}
        >
          {fromItem ? (
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
                borderColor="orange.300"
                mr={{ base: 2, sm: 4 }}
              >
                <Image src={fromItem.img} />
              </Box>
              <Text fontSize={{ base: "xl", sm: "3xl" }} fontWeight="bold" textAlign="start">
                {fromItem.name}&nbsp;
              </Text>
              <Icon
                as={isOpen ? FiChevronUp : FiChevronDown}
                fontSize={{ base: "xl", sm: "3xl" }}
                color={"wynd.neutral.800"}
              />
            </Flex>
          ) : (
            <Flex align="center">
              <Skeleton w={{ base: 12, sm: 20 }} h={{ base: 12, sm: 20 }} mr={{ base: 2, sm: 4 }} />
              <Skeleton w={{ base: 24, sm: 48 }} h={{ base: 6, sm: 10 }} mr={{ base: 2, sm: 4 }} />
            </Flex>
          )}
        </Button>
        {fromItem ? (
          <Box flex={1}>
            <Editable
              variant="unstyled"
              fontSize={{ base: "lg", sm: "2xl" }}
              fontWeight="bold"
              textAlign="end"
              color={tokenInputValue === "0" ? "wynd.neutral.800" : "wynd.alpha.800"}
              mb={{ base: 1, sm: 2 }}
              placeholder="0"
            >
              <EditablePreview />
              <EditableInput
                type="number"
                min="0"
                defaultValue="0"
                onChange={(e) => {
                  const value = e.target.value;
                  const floatRegex = /(0{0,1}[.]\d*)(\d+([.]\d*)?(e[+-]?\d+)?|[.]\d+(e[+-]?\d+)?)/g;
                  const floatCheck = value.match(floatRegex);
                  if (floatCheck !== null) {
                    setTokenInputValue(value);
                    return value;
                  }

                  setTokenInputValue(parseFloat(value).toString());
                  return (e.target.value = parseFloat(value).toString());
                }}
                _focus={{ boxShadow: "none" }}
              />
            </Editable>
            <Text
              fontSize={{ sm: "xl" }}
              textAlign="end"
              fontWeight="bold"
              color={tokenInputValue === "0" ? "wynd.neutral.600" : "wynd.neutral.800"}
              mb={0}
            >
              ≈$0
            </Text>
          </Box>
        ) : (
          <Flex flexDirection="column" align="end">
            <Skeleton w={{ base: 20, sm: 36 }} h={{ base: 8, sm: 10 }} mb={2} />
            <Skeleton w={{ base: 12, sm: 16 }} h={{ base: 6, sm: 8 }} />
          </Flex>
        )}
      </Flex>
      <Box
        position="absolute"
        zIndex={2000}
        bg={"wynd.neutral.200"}
        boxShadow={isOpen ? "0 12px 20px -8px rgba(0, 0, 0, 0.5)" : "none"}
        borderRadius="xl"
        left={0}
        right={0}
        px={6}
      >
        <Collapse in={isOpen} animateOpacity>
          <Box py={6}>
            {fromItem ? (
              <AsyncSelect
                placeholder="Search"
                chakraStyles={customStyles}
                isClearable={false}
                // isOptionDisabled={(option) => option.label === 'Ion'} // test option disabled
                blurInputOnSelect={true}
                controlShouldRenderValue={false}
                menuIsOpen={true}
                loadingMessage={() => <SkeletonOptions />}
                defaultOptions={data}
                value={fromItem}
                loadOptions={(inputValue, callback) => {
                  setTimeout(() => {
                    const values = data.filter((option) =>
                      option.name.toLowerCase().includes(inputValue.toLowerCase()),
                    );
                    callback(values);
                  }, 1000);
                }}
                onChange={(selectedOption) => {
                  let value = {};
                  value = { ...selectedOption };
                  setFromItem(value as Asset);
                  onClose();
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
      {!isOpen && (
        <Flex justify="center" align="center" boxShadow="base">
          <Box
            as="button"
            position="absolute"
            zIndex={5}
            bottom={{ base: -8, sm: -10 }}
            color={"wynd.alpha.700"}
            onClick={() => {
              setFromItem(toItem as Asset);
              setToItem(fromItem as Asset);
            }}
          >
            <Icon
              zIndex={-10}
              as={BsHexagonFill}
              w={{ base: 12, sm: 16 }}
              h={{ base: 12, sm: 16 }}
              color={"wynd.neutral.200"}
            />
            <Icon
              position="absolute"
              top={0}
              left={0}
              right={0}
              zIndex={10}
              as={BsHexagon}
              w={{ base: 12, sm: 16 }}
              h={{ base: 12, sm: 16 }}
            />
            <Icon
              position="absolute"
              top={2}
              left={2}
              right={2}
              w={{ base: 8, sm: 12 }}
              h={{ base: 8, sm: 12 }}
              as={CgArrowsExchangeV}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
