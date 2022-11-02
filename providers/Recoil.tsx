"use client";

import { RecoilRoot as DefaultRecoilProvider } from "recoil";

export default function RecoilProvider({ children }: React.ComponentProps<typeof DefaultRecoilProvider>) {
  return <DefaultRecoilProvider>{children}</DefaultRecoilProvider>;
}
