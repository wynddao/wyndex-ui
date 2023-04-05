import Head from "next/head";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import "../components/Dex/Carousel/index.css";
import "../components/Dex/Swap/LineChart/style.css";
import ErrorBoundary from "../components/General/ErrorBoundary";
import Loader from "../components/General/Loader";
import Maintanance from "../components/General/Maintanance";
import "../components/Dex/MysteryBox/index.css";
import Sidebar from "../components/General/Sidebar";
import ToSModal from "../components/General/ToSModal";
import Providers from "../providers/providers";
import { STATUS_BAR, STATUS_TEXT, WYND_MAINTANANCE_MODE } from "../utils";
import { Alert, AlertIcon } from "@chakra-ui/react";

export default function RootLayout({ children }: {children: React.ReactNode}) {
  if (WYND_MAINTANANCE_MODE) {
    return <Maintanance />;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Frontend for WynDex" />
        <link rel="icon" type="image/svg" href="/logo-gradient.svg"></link>
      </Head>
      <ErrorBoundary>
        <Providers>
          <Toaster />
          {STATUS_BAR && (
            <Alert status="warning">
              <AlertIcon />
              {STATUS_TEXT}
            </Alert>
          )}
          <Sidebar>
            {children}
          </Sidebar>
          <ToSModal />
        </Providers>
      </ErrorBoundary>
    </>
  );
}
