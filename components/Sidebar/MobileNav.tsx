import { Flex, FlexProps, IconButton, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { FiMenu } from "react-icons/fi";
import wyndLogoBlack from "../../public/logo-black.svg";
import wyndLogoWhite from "../../public/logo-white.svg";

interface MobileProps extends FlexProps {
  readonly onOpen: () => void;
}

export default function MobileNav({ onOpen, ...restProps }: MobileProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      gap={4}
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...restProps}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu" icon={<FiMenu />} />
      <Image
        alt="Wynd logo"
        src={useColorModeValue(wyndLogoBlack, wyndLogoWhite)}
        sizes="100vw"
        style={{ width: "100%", height: "auto", maxWidth: 128, maxHeight: 38 }}
      />
    </Flex>
  );
}
