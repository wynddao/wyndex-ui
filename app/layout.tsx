import Sidebar from "../components/Sidebar";
import Providers from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Providers>
          <Sidebar>{children}</Sidebar>
        </Providers>
      </body>
    </html>
  );
}
