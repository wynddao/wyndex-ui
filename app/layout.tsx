"use client";

import Sidebar from "../components/Sidebar";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

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
        ) : (
          <Loader />
        )}
      </body>
    </html>
  );
}
