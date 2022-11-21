"use client";

import { useColorMode } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { dataType } from "..";
import CustomControl from "./CustomControl";
import CustomOption from "./CustomOption";
import { getCustomStyles } from "./style";

interface TokenDropdownProps {
  readonly tokens: dataType[];
  readonly selectedToken: dataType;
  readonly selectToken: (value: dataType) => void;
  readonly onClose: () => void;
}

export default function TokenDropdown({ tokens, selectedToken, selectToken, onClose }: TokenDropdownProps) {
  const { colorMode } = useColorMode();

  return (
    <AsyncSelect
      placeholder="Search"
      chakraStyles={getCustomStyles(colorMode)}
      isClearable={false}
      blurInputOnSelect={true}
      controlShouldRenderValue={false}
      menuIsOpen={true}
      defaultOptions={tokens}
      value={selectedToken}
      loadOptions={(inputValue, callback) => {
        setTimeout(() => {
          const values = tokens.filter((option) =>
            option.label?.toLowerCase().includes(inputValue.toLowerCase()),
          );
          callback(values);
        }, 1000);
      }}
      onChange={(selectedOption) => {
        let value = {};
        value = { ...selectedOption };
        selectToken(value as dataType);
        onClose();
      }}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        Control: CustomControl,
        Option: CustomOption,
      }}
    />
  );
}
