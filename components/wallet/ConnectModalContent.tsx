import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDimensions,
} from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import React, { useRef } from "react";
import { FiChevronRight } from "react-icons/fi";

import { handleChangeColorModeValue } from "../../default-component";
import { AnimateBox, LoadingVariants, ModalContentVariants } from "../../motion-component";
import {
  ConnectModalContentType,
  DisplayWalletListType,
  DownloadWalletButtonType,
  IconTypeProps,
} from "../../types";

const SIZES = {
  lg: {
    h: 12,
    iconSize: 9,
    fontSize: "lg",
    contentFontSize: "md",
    logoSize: 32,
  },
  md: {
    h: 10,
    iconSize: 7,
    fontSize: "md",
    contentFontSize: "sm",
    logoSize: 28,
  },
  sm: {
    h: 8,
    iconSize: 6,
    fontSize: "md",
    contentFontSize: "sm",
    logoSize: 24,
  },
};

const DisplayModalLogo = ({ logo }: { logo: IconTypeProps }) => {
  return (
    <>
      {typeof logo === "string" ? (
        <Image src={logo} />
      ) : (
        <Center w="full" h="full">
          <Icon as={logo} w="full" h="full" />
        </Center>
      )}
    </>
  );
};

export const DisplayContent = ({
  size = "md",
  status,
  logo,
  contentHeader,
  contentDesc,
  addressButton,
  bottomButton,
}: ConnectModalContentType) => {
  const { colorMode } = useColorMode();
  const Style = {
    warning: {
      color: handleChangeColorModeValue(colorMode, "orange.300", "orange.400"),
    },
    error: {
      color: handleChangeColorModeValue(colorMode, "red.400", "red.500"),
    },
  };
  return (
    <AnimateBox initial="hidden" animate="enter" exit="exit" variants={ModalContentVariants}>
      <Flex flex={1} flexDirection="column" alignItems="center" justifyContent="center" p={8}>
        {logo && (
          <Center position="relative" mb={typeof logo === "string" ? 4 : 0}>
            {status === "loading" && (
              <AnimateBox
                position="absolute"
                top={-2}
                right={-2}
                bottom={-2}
                left={-2}
                border="2px solid"
                borderTopColor="transparent"
                borderBottomColor="transparent"
                borderLeftColor="purple.300"
                borderRightColor="purple.300"
                borderRadius="full"
                initial="hidden"
                animate="animate"
                variants={LoadingVariants}
              ></AnimateBox>
            )}
            {(status === "warning" || status === "error") && (
              <Box
                position="absolute"
                top={-2}
                right={-2}
                bottom={-2}
                left={-2}
                border="2px solid"
                borderColor={Style[status].color}
                borderRadius="full"
              ></Box>
            )}
            <Box
              borderRadius="full"
              overflow="hidden"
              minW={SIZES[size].logoSize}
              minH={SIZES[size].logoSize}
              w={SIZES[size].logoSize}
              h={SIZES[size].logoSize}
              maxW={SIZES[size].logoSize}
              maxH={SIZES[size].logoSize}
            >
              <DisplayModalLogo logo={logo} />
            </Box>
          </Center>
        )}
        {contentHeader && (
          <Text
            color={Style[status] ? Style[status].color : "inherit"}
            fontSize={SIZES[size].fontSize}
            fontWeight="medium"
            textAlign="center"
            mb={0.5}
            mt={2}
          >
            {contentHeader}
          </Text>
        )}
        {contentDesc && (
          <Text fontSize={SIZES[size].contentFontSize} textAlign="center" lineHeight="normal" opacity={0.7}>
            {contentDesc}
          </Text>
        )}
        {addressButton && (
          <Box w="full" pt={4}>
            {addressButton}
          </Box>
        )}
        {bottomButton && (
          <Box w="full" pt={addressButton ? 3 : 4}>
            {bottomButton}
          </Box>
        )}
      </Flex>
    </AnimateBox>
  );
};

export const InstallWalletButton = ({ size = "md", icon, text }: DownloadWalletButtonType) => {
  const { colorMode } = useColorMode();
  return (
    <Button
      variant="unstyled"
      w="full"
      h={SIZES[size].h}
      minH="fit-content"
      fontWeight="medium"
      fontSize={SIZES[size].fontSize}
      border="1px solid"
      borderColor={handleChangeColorModeValue(colorMode, "gray.300", "gray.600")}
      color={handleChangeColorModeValue(colorMode, "gray.600", "gray.200")}
      _hover={{ opacity: 0.8 }}
      _active={{ opacity: 0.9 }}
      _focus={{ outline: "none" }}
    >
      <Stack w="full" isInline={true} justifyContent="center" alignItems="center" px={3}>
        <Icon as={icon} />
        <Text whiteSpace="break-spaces">{text ? text : `Install Wallet`}</Text>
      </Stack>
    </Button>
  );
};

export const QRCode = ({ link, text }: { link: string; text?: string }) => {
  const elementRef = useRef();
  const dimensions = useDimensions(elementRef);

  return (
    <AnimateBox ref={elementRef} initial="hidden" animate="enter" exit="exit" variants={ModalContentVariants}>
      <Stack justifyContent="center" alignItems="center" spacing={4} p={6}>
        <Text>{text}</Text>
        <Box
          w="full"
          border="1px solid"
          borderColor={useColorModeValue("blackAlpha.100", "whiteAlpha.600")}
          borderRadius="lg"
          boxShadow="base"
          p={5}
        >
          <QRCodeSVG
            value={link}
            size={dimensions && dimensions.contentBox.width - 24}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
        </Box>
      </Stack>
    </AnimateBox>
  );
};

export const DisplayWalletList = ({ walletsData, size = "md", handleClick }: DisplayWalletListType) => {
  const { colorMode } = useColorMode();
  return (
    <AnimateBox initial="hidden" animate="enter" variants={ModalContentVariants}>
      <Stack
        spacing={1.5}
        pl={3}
        pr={1}
        flex={1}
        maxH={64}
        overflowY="scroll"
        justifyContent="space-between"
        css={{
          // For Firefox
          scrollbarWidth: "thin",
          // For Chrome and other browsers except Firefox
          "&::-webkit-scrollbar": {
            width: "8px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: handleChangeColorModeValue(colorMode, "rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"),
            borderRadius: "6px",
            border: "3px solid",
            borderColor: handleChangeColorModeValue(colorMode, "#fff", "#2D3748"),
          },
        }}
      >
        <Stack spacing={1.5} pt={2.5}>
          {walletsData.map(({ name, prettyName, logo }, i) => {
            return (
              <Button
                id={name}
                key={name}
                variant="unstyled"
                display="flex"
                h={SIZES[size].h}
                fontSize={SIZES[size].fontSize}
                maxH="fit-content"
                p={2.5}
                justifyContent="start"
                borderRadius="lg"
                color={handleChangeColorModeValue(colorMode, "gray.600", "white")}
                transition="all .3s ease-in-out"
                _hover={{
                  bg: handleChangeColorModeValue(colorMode, "gray.200", "gray.600"),
                }}
                _active={{
                  bg: handleChangeColorModeValue(colorMode, "gray.300", "gray.700"),
                }}
                _focus={{ outline: "none" }}
                onClick={(e) => {
                  if (e.currentTarget.id === name) handleClick(walletsData[i]);
                }}
              >
                <Stack w="full" isInline={true} justifyContent="start" alignItems="center" spacing={2.5}>
                  <Box
                    borderRadius="full"
                    overflow="hidden"
                    w={SIZES[size].iconSize}
                    h={SIZES[size].iconSize}
                    minW={SIZES[size].iconSize}
                    minH={SIZES[size].iconSize}
                    maxW={SIZES[size].iconSize}
                    maxH={SIZES[size].iconSize}
                  >
                    {typeof logo === "string" ? (
                      <Image src={logo} />
                    ) : (
                      <Icon as={logo} w="full" h="full" p={0.5} />
                    )}
                  </Box>
                  <Box textAlign="start" flex={1}>
                    <Text fontWeight="medium" lineHeight={1.1} color="inherit">
                      {prettyName}
                    </Text>
                  </Box>
                  <Box>
                    <Icon as={FiChevronRight} />
                  </Box>
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </AnimateBox>
  );
};
