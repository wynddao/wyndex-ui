"use client";

import Sidebar from "../components/Sidebar";
import Providers from "../providers/providers";
import { Toaster } from "react-hot-toast";
import { Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader";
import ToSModal from "../components/ToSModal";
import { AppProps } from "next/app";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/Carousel/index.css";

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
