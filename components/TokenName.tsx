import { useTokenInfo } from "../state";

interface TokenNameProps {
  address: string;
}

export default function TokenName(props: TokenNameProps) {
  const { address } = props;
  const { tokenName } = useTokenInfo(address);
  return <span>{tokenName}</span>;
}
