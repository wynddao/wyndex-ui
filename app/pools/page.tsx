import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1>Pools page</h1>
      <Link href={`/pools/${Math.random().toString().slice(-8)}`}>Take me to a random pool</Link>
    </>
  );
}
