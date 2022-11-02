import ChakraProvider from "../providers/Chakra";
import RecoilProvider from "../providers/Recoil";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <ChakraProvider>
          <RecoilProvider>{children}</RecoilProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
