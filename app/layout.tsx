"use client";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "../components/General/Loader";
import Sidebar from "../components/General/Sidebar";
import ToSModal from "../components/General/ToSModal";
import Providers from "../providers/providers";
import "@splidejs/splide/css/sea-green";
import { usePathname } from "next/navigation";
import { WYND_MAINTANANCE_MODE } from "../utils";
import Maintanance from "../components/General/Maintanance";

const getPageTitle = (path: string): string => {
  const pathPart: string = path.match(/^\/[^\/]*/)?.[0] ?? "/";

  switch (pathPart) {
    case "/lsd":
      return "WYND | Liquid Staking Derivatives - JUNO";
    case "/pools":
      return "WYND | DEX - Pool Overview";
    case "/swap":
      return "WYND | DEX - Swap";
    case "/gauges":
      return "WYND | DAO - Gauges";
    case "/stake":
      return "WYND | DAO - Stakes";
    case "/vote":
      return "WYND | DAO - Votes";
    case "/bridge":
      return "WYND | DEX - Bridge";
    default:
      return "WYND DAO";
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>WYND DAO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content={getPageTitle(path)} />
        <link rel="icon" type="image/svg" href="/logo-gradient.svg"></link>
      </head>
      <body>
        {WYND_MAINTANANCE_MODE ? (
          <Maintanance />
        ) : isLoaded ? (
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
