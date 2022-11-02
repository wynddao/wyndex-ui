"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </ChakraProvider>
  );
}
