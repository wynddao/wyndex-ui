"use client";

import Sidebar from "../components/Sidebar";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>WynDex</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Frontend for WynDex" />
      </head>
      <body>
        <Providers>
          <Toaster />
          <Sidebar>{children}</Sidebar>
        </Providers>
      </body>
    </html>
  );
}
