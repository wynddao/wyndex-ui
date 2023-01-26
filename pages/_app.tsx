"use client";

import Sidebar from "../components/General/Sidebar";
import Providers from "../providers/providers";
import { Toaster } from "react-hot-toast";
import { Suspense, useEffect, useState } from "react";
import Loader from "../components/General/Loader";
import ToSModal from "../components/General/ToSModal";
import { AppProps } from "next/app";
import ErrorBoundary from "../components/General/ErrorBoundary";
import "../components/Dex/Carousel/index.css";
import "../components/Dex/Swap/LineChart/style.css"

export default function RootLayout({ Component, pageProps }: AppProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return isLoaded ? (
    <ErrorBoundary>
      <Providers>
        <Toaster />
        <Sidebar>
          <Suspense fallback={<Loader />}>
            <Component {...pageProps} />
          </Suspense>
        </Sidebar>
        <ToSModal />
      </Providers>
    </ErrorBoundary>
  ) : (
    <Loader />
  );
}
