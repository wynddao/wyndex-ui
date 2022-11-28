import AssetBalances from "../components/AssetBalances";
import DepositIbcModal from "../components/DepositIbcModal";
import WithdrawIbcModal from "../components/WithdrawIbcModal";

export default function Page() {
  return (
    <>
      <AssetBalances />
      <DepositIbcModal />
      <WithdrawIbcModal />
    </>
  );
}
