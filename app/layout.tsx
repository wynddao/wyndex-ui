"use client";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "../components/General/Loader";
import Sidebar from "../components/General/Sidebar";
import ToSModal from "../components/General/ToSModal";
import Providers from "../providers/providers";
import "@splidejs/splide/css/sea-green";

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
            <ToSModal />
          </Providers>
        ) : (
          <Loader />
        )}
      </body>
    </html>
  );
}
