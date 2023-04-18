import { Spinner } from "@chakra-ui/react";
import { Suspense, useEffect, useState } from "react";
import { AprCalculated, getAprForPool } from "../../../utils/apr";

import { getApr } from "../Pool/util/apr";

export default function MaxApr({ poolAddress, assetPrices }: { poolAddress: string; assetPrices: any }) {
  const [aprCalculated, setAprCalculated] = useState<AprCalculated[]>([]);

  const fetchData = async () => {
    const _aprCalculated = await getAprForPool(poolAddress, assetPrices);
    setAprCalculated(_aprCalculated);
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAddress]);

  return aprCalculated.length > 0 ? (
    <strong>{getApr(aprCalculated, aprCalculated.slice(-1)[0].unbonding_period)}</strong>
  ) : (
    <Spinner size="xs" />
  );
}
