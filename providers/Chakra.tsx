"use client";

import { ChakraProvider as DefaultChakraProvider } from "@chakra-ui/react";

export default function ChakraProvider({ children }: React.ComponentProps<typeof DefaultChakraProvider>) {
  return <DefaultChakraProvider>{children}</DefaultChakraProvider>;
}
