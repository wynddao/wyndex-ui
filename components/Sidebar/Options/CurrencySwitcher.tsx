import { Box, FormLabel, Input, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import { currencyAtom } from "../../../state/recoil/atoms/settings";

const CurrencySwitcher: React.FC = () => {
  const [currency, setCurrency] = useRecoilState(currencyAtom);
  const size = "24px";
  return (
    <FormLabel
      htmlFor="currency-switcher"
      as={"label"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={2}
      position="relative"
      margin="0"
    >
      <Input
        id="currency-switcher"
        type="checkbox"
        checked={currency.includes("EUR") ? true : false}
        onChange={() => setCurrency(currency.includes("EUR") ? "USD" : "EUR")}
        display="inline-block"
        appearance="none"
        cursor="pointer"
        height={size}
        width="48px"
        backgroundColor="whiteAlpha.300"
        borderRadius="full"
        border="none"
      />
      <Box
        as={FormLabel}
        margin="0"
        htmlFor="currency-switcher"
        className={`iconMove `}
        transition="all 0.2s ease-in"
        transform={`${currency.includes("EUR") ? "translateX(0)" : "translateX(23px)"}`}
        position="absolute"
        cursor="pointer"
        top={"0"}
        left={"1px"}
        w={"23px"}
        h={"23px"}
        borderRadius="full"
        bg="wynd.neutral.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="wynd.neutral.100" fontWeight="bold">
          {currency.includes("EUR") ? "€" : "$"}
        </Text>
      </Box>
    </FormLabel>
  );
};

export default CurrencySwitcher;
