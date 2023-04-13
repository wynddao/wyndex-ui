"use client";
import { Box, useRadio } from "@chakra-ui/react";
import { capitalizeFirstLetter } from "../../../utils/text";

export const VoteRadio = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  let color = "#FFF";

  switch (props.children) {
    case "yes":
      color = "#9AE6B4";
      break;
    case "no":
      color = "#FEB2B2";
      break;
    default:
      color = "#90cdf4";
  }

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        _checked={{ backgroundColor: color, color: "black" }}
        bgColor={"wynd.base.sidebar"}
        p={3}
        borderStartRadius={props.children === "yes" ? "xl" : "none"}
        borderEndRadius={props.children === "no" ? "xl" : "none"}
        borderX={props.children === "abstain" ? "white solid 1px" : "none"}
        width={"100%"}
        cursor={"pointer"}
        textAlign={"center"}
      >
        {capitalizeFirstLetter(props.children)}
      </Box>
    </Box>
  );
};
