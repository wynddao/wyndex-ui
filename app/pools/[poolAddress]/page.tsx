"use client";
import Pool from "../../../components/Dex/Pool";
interface PoolPageProps {
  readonly params: {
    readonly poolAddress: string;
  };
}

export default function Page({ params }: PoolPageProps) {
  return <Pool poolAddress={params.poolAddress} />;
}
