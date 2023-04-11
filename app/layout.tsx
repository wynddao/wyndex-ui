"use client";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "../components/General/Loader";
import Sidebar from "../components/General/Sidebar";
import ToSModal from "../components/General/ToSModal";
import Providers from "../providers/providers";
import "@splidejs/splide/css/sea-green";
import { usePathname } from "next/navigation";

const pageTitle = {
  "/": "WYND DAO",
  "/eth": "WYND DAO",
  "/lsd": "WYND | Liquid Staking Derivatives",
  "/pools": "WYND | DEX - Pool Overview",
  "/swap": "WYND | DEX - Swap",
  "/gauges": "WYND | DAO - Gauges",
  "/stake": "WYND | DAO - Stakes",
  "/vote": "WYND | DAO - Votes",
  "/bridge": "WYND | DEX - Bridge",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const path = usePathname();
  const pathPart: string = path.match(/^\/[^\/]*/)?.[0] ?? "/";
  console.log(pathPart);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>WYND DAO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content={pageTitle[pathPart]} />
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
