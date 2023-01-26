import { HStack, useRadioGroup } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import TokenFilterOption from "./TokenFilterOption";

const tokenFilterOptions = ["All", "Native", "Juno Assets"] as const;
export type TokenFilterOptions = typeof tokenFilterOptions[number];

interface TokenFilterProps {
  readonly setFilterOption: Dispatch<SetStateAction<TokenFilterOptions>>;
}

export default function TokenFilter({ setFilterOption }: TokenFilterProps) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "token-type",
    defaultValue: tokenFilterOptions[0],
    onChange: (nextValue: TokenFilterOptions) => setFilterOption(nextValue),
  });

  return (
    <HStack {...getRootProps()}>
      {tokenFilterOptions.map((value) => {
        return (
          <TokenFilterOption key={value} {...getRadioProps({ value })}>
            {value}
          </TokenFilterOption>
        );
      })}
    </HStack>
  );
}
