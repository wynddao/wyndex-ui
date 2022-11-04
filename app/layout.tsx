import Link from "next/link";
import Providers from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <Link href="/test">Test</Link>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
