import Pool from "../../../components/Pool";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { poolAddress } = router.query;
  return <Pool poolAddress={poolAddress as string} />;
}
