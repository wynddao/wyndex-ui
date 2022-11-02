"use client";

import { ChakraProvider } from "@chakra-ui/react";

export default function ClientChakraProvider({ children }: React.ComponentProps<typeof ChakraProvider>) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
