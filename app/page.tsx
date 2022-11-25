import AssetBalances from "../components/AssetBalances";
import { assetsDetailsData, assetsTotalData } from "../components/AssetBalances/__mocks__/assets";
import DepositIbcModal from "../components/DepositIbcModal";
import WithdrawIbcModal from "../components/WithdrawIbcModal";

export default function Page() {
  return (
    <>
      <AssetBalances assetsDetailsData={assetsDetailsData} assetsTotalData={assetsTotalData} />
      <DepositIbcModal />
      <WithdrawIbcModal />
    </>
  );
}
