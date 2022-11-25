import Sidebar from "../components/Sidebar";
import TxModal from "../components/TxModal";
import Providers from "./providers";

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
          <TxModal />
          <Sidebar>{children}</Sidebar>
        </Providers>
      </body>
    </html>
  );
}
