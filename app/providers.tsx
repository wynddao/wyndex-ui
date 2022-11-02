"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { extendedTheme } from "../theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={extendedTheme}>
      <RecoilRoot>{children}</RecoilRoot>
    </ChakraProvider>
  );
}
