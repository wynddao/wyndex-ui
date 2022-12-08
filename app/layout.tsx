"use client";

import Sidebar from "../components/Sidebar";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>WynDex</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Frontend for WynDex" />
        <link rel="icon" type="image/svg" href="/logo-gradient.svg"></link>
      </head>
      <body>
        {isLoaded ? (
          <Providers>
            <Toaster />
            <Sidebar>{children}</Sidebar>
          </Providers>
        ) : null}
      </body>
    </html>
  );
}
