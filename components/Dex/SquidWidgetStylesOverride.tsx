import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

const squidWidgetContentSelector = "#squid-widget > div";
const squidWidgetBodySelector = "#squid-widget-header + div";
const fromToBoxSelector = `${squidWidgetBodySelector} > span:nth-child(1)`;
const swapBoxSelector = "#squid-swap-source + span";
const swapLineSelector = `${swapBoxSelector} > span:nth-child(1)`;
const swapButtonBoxSelector = `${swapBoxSelector} > span:nth-child(2)`;
const swapButtonSelector = `${swapButtonBoxSelector} > button`;
const swapButtonSvgSelector = `${swapButtonSelector} > svg`;
const rateBoxSelector = `${squidWidgetBodySelector} > span:nth-child(2)`;
const buttonBoxSelector = `${squidWidgetBodySelector} > span:nth-child(3)`;

export const SquidWidgetStylesOverride: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex
      gap={{ base: "2rem", lg: "4rem" }}
      flexFlow="column"
      w="full"
      p={{ base: 4, sm: 6 }}
      maxWidth="780px"
      sx={{
        "#squid-widget": {
          minHeight: "0 !important",
        },
        [squidWidgetContentSelector]: {
          width: "100% !important",
          maxWidth: "none !important",
          height: "auto !important",
          minHeight: "0 !important",
          maxHeight: "none !important",
        },
        "#squid-widget-header": {
          background: "none !important",
        },
        [squidWidgetBodySelector]: {
          marginTop: "4rem",
        },
        [fromToBoxSelector]: {
          order: "1 !important",
        },
        "#squid-swap-source, #squid-swap-destination": {
          padding: "4 !important",
          borderRadius: "lg !important",
          bg: "wynd.base.sidebar !important",

          "& span": {
            fontSize: "lg",
            lineHeight: 1.5,
          },
        },
        "#squid-swap-direction-txt": {
          fontSize: "xl !important",
          fontWeight: "bold",

          "& + button, & + a > button": {
            bgGradient: "linear(to-l, wynd.green.400, wynd.cyan.400) !important",

            "& span": {
              fontSize: "sm !important",
              color: "white",
              marginBottom: 0.5,
            },
          },

          "& + a:hover #squid-secondary-hover-button:hover": {
            bgGradient: "linear(to-l, wynd.green.400, wynd.cyan.400) !important",

            "& span": {
              fontSize: "sm !important",
              color: "white",
              marginBottom: 0.5,
            },
          },
        },
        "#squid-secondary-hover-button > span:nth-child(1) span": {
          fontSize: "sm !important",
        },
        [swapLineSelector]: {
          display: "none !important",
        },
        [swapButtonBoxSelector]: {
          position: "static !important",
          margin: "-1rem -2rem -1rem -2rem",
        },
        [swapButtonSelector]: {
          width: "64px !important",
          height: "64px !important",
          bgGradient: "linear(to-l, wynd.green.400, wynd.cyan.400) !important",
          border: "4px solid !important",
          borderColor: "wynd.cyan.700 !important",
          opacity: 0.6,
        },
        [swapButtonSvgSelector]: {
          width: "40px !important",
          height: "40px !important",
          color: "white !important",
        },
        [rateBoxSelector]: {
          order: "3 !important",
          background: "whiteAlpha.100",
          backdropFilter: "blur(5px)",
          borderRadius: "xl",
          maxWidth: "600px",
          margin: "0 auto",
          border: 0,

          "& > span": {
            background: "transparent !important",
            paddingBottom: "0.5rem",
          },

          "& span": {
            fontSize: "lg",
            lineHeight: 1.5,
          },

          "& div > span, & li > span": {
            color: "wynd.neutral.500 !important",
          },

          "& span + span": {
            color: "white !important",
          },
        },
        [buttonBoxSelector]: {
          marginTop: 2,
          flexDirection: "column-reverse !important",
          position: "static !important",
          left: "unset !important",
          transform: "unset !important",
          order: "2 !important",
        },
        "#squid-submit-swap-btn": {
          fontWeight: "bold",
          h: { base: 12, lg: 16 },
          w: "full",
          bgGradient: "linear(to-l, wynd.green.400, wynd.cyan.400)",
          maxW: "560px",
          margin: { base: "1rem auto", md: "2rem auto", lg: "4rem auto" },

          "&:hover": {
            bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",

            "&:disabled": {
              bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
              cursor: "initial",
            },
          },

          "&:disabled": {
            bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
            cursor: "initial",
          },
        },
      }}
    >
      {children}
    </Flex>
  );
};

export default SquidWidgetStylesOverride;
