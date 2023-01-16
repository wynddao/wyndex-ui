import { useTokenInfo } from "../state";
import { microdenomToDenom } from "../utils/tokens";

interface TokenNameProps {
  address: string;
  symbol?: boolean;
}

export default function TokenName(props: TokenNameProps) {
  const { address, symbol } = props;
  const { tokenName, tokenSymbol } = useTokenInfo(address);
  return <span>{symbol ? microdenomToDenom(tokenSymbol) : tokenName}</span>;
}
