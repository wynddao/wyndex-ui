"use client";

import Sidebar from "../components/Sidebar";
import Providers from "../providers/providers";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ToSModal from "../components/ToSModal";
import { AppProps } from "next/app";

export default function RootLayout({ Component, pageProps }: AppProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return isLoaded ? (
    <Providers>
      <Toaster />
      <Sidebar>
        <Component {...pageProps} />
      </Sidebar>
      <ToSModal />
    </Providers>
  ) : (
    <Loader />
  );
}
