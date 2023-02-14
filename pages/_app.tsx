import { AppProps } from "next/app";
import Head from "next/head";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "../components/Dex/Carousel/index.css";
import "../components/Dex/Swap/LineChart/style.css";
import ErrorBoundary from "../components/General/ErrorBoundary";
import Loader from "../components/General/Loader";
import Maintanance from "../components/General/Maintanance";
import Sidebar from "../components/General/Sidebar";
import ToSModal from "../components/General/ToSModal";
import Providers from "../providers/providers";
import { WYND_MAINTANANCE_MODE } from "../utils";

export default function RootLayout({ Component, pageProps }: AppProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (WYND_MAINTANANCE_MODE) {
    return <Maintanance />;
  }

  return isLoaded ? (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
    </>
  ) : (
    <Loader />
  );
}
