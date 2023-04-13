import {
  Badge,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import { CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useIndexerInfos } from "../../../state";
import { depositIbcModalAtom, withdrawIbcModalAtom } from "../../../state/recoil/atoms/modal";
import { currencyAtom } from "../../../state/recoil/atoms/settings";
import { formatCurrency } from "../../../utils/currency";
import { capitalizeFirstLetter } from "../../../utils/text";
import { microamountToAmount } from "../../../utils/tokens";
import { ExtendedAsset } from "./utils";

interface AssetBalanceItemProps {
  readonly asset: ExtendedAsset;
  readonly toggleFav: () => void;
}

export default function AssetBalanceItem({ asset, toggleFav }: AssetBalanceItemProps) {
  const { onCopy, hasCopied } = useClipboard(asset.tags.includes("cw20") ? (asset as CW20Asset).token_address : asset.tags.includes("ibc") ? (asset as IBCAsset).juno_denom : asset.denom);
  const setDepositIbcModalOpen = useSetRecoilState(depositIbcModalAtom);
  const setWithdrawIbcModalOpen = useSetRecoilState(withdrawIbcModalAtom);
  const { assetPrices } = useIndexerInfos({});
  const currency = useRecoilValue(currencyAtom);

  const toCopy = "token_address" in asset ? "address" : "juno denom";
  const tooltipLabel = hasCopied ? `${capitalizeFirstLetter(toCopy)} copied!` : `Copy ${toCopy}`;

  return (
    <Grid
      templateColumns={{ base: "repeat(2, 1fr)", lg: "1fr 50px 1fr" }}
      fontWeight="semibold"
      alignItems="center"
      backgroundImage={"url(/images/Vector2Bg.png)"}
      backgroundSize="300px"
      borderBottom="1px solid var(--chakra-colors-chakra-border-color)"
      py="4"
      px="2"
      gap="4"
    >
      <GridItem display="flex" alignItems="center" gap={{ base: "2", lg: "4" }}>
        <Tooltip label={asset.isFav ? "Remove from favourites" : "Add to favourites"}>
          <Button
            padding="0"
            onClick={() => toggleFav()}
            border="1px solid wynd.cyan.500"
            aria-label={asset.isFav ? "Remove Fav" : "Add fav"}
          >
            <Icon as={asset.isFav ? AiFillStar : AiOutlineStar} w="1rem" h="1rem" color={"wynd.cyan.500"} />
          </Button>
        </Tooltip>
        <Image
          alt={asset.name}
          src={asset.logoURI}
          w={{ base: "2rem", lg: "3rem" }}
          h={{ base: "2rem", lg: "3rem" }}
        />
        <Text fontSize="lg">{asset.name}</Text>
        <Tooltip label={tooltipLabel} hasArrow={true} closeDelay={1000}>
          <Badge bgColor={"wynd.gray.300"} color="white" as={Button} onClick={onCopy}  rounded="md" fontSize="x-small" height="auto" p={2}>
            <Flex alignItems="center" justifyContent="space-between">
              <Icon fontSize="xs" as={FiCopy} />
              <Text marginLeft={1}>{asset.tags}</Text>
            </Flex>
          </Badge>
        </Tooltip>
      </GridItem>
      <GridItem display="flex" alignItems="center" flexDir="column" justifyContent="end">
        <Text fontSize="lg">{microamountToAmount(asset.balance, asset.decimals)}</Text>
        <Text fontSize="xs">
          (≈
          {formatCurrency(
            currency,
            (
              ((currency === "EUR"
                ? assetPrices.find(
                    (el) =>
                      el.asset === asset.denom ||
                      (asset as IBCAsset).juno_denom === el.asset ||
                      (asset as CW20Asset).token_address === el.asset,
                  )?.priceInEur
                : assetPrices.find(
                    (el) =>
                      el.asset === asset.denom ||
                      (asset as IBCAsset).juno_denom === el.asset ||
                      (asset as CW20Asset).token_address === el.asset,
                  )?.priceInUsd) || 0) * Number(microamountToAmount(asset.balance, asset.decimals))
            ).toString(),
          )}
          )
        </Text>
      </GridItem>
      <GridItem colSpan={{ base: 2, lg: 1 }} display="flex" alignItems="end" justifyContent="end" gap="2">
        {(asset as IBCAsset).external_deposit_uri && (
          <Button
            fontSize="sm"
            bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
            _hover={{
              bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
              ":disabled": {
                bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                cursor: "initial",
              },
            }}
            _disabled={{
              bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
              cursor: "initial",
            }}
            onClick={() => window.open((asset as IBCAsset).external_deposit_uri)}
          >
            IBC Transfer
          </Button>
        )}
        {asset.tags === "ibc" && !(asset as IBCAsset).external_deposit_uri ? (
          <Flex flexDirection="row" justifyContent="flex-end" gap={2} flexWrap="wrap">
            <Button
              fontSize={{ base: "sm" }}
              bgGradient="linear(to-l, wynd.green.400, wynd.cyan.400)"
              cursor="pointer"
              _hover={{
                bgGradient: "linear(to-l, wynd.green.300, wynd.cyan.300)",
                ":disabled": {
                  bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                  cursor: "initial",
                },
              }}
              _disabled={{
                bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                cursor: "initial",
              }}
              onClick={() => setDepositIbcModalOpen({ isOpen: true, chainId: asset.chain_id })}
              height="fit-content"
              px="4"
              py="2"
            >
              IBC Deposit
            </Button>
            <Button
              fontSize={{ base: "sm" }}
              _hover={{
                ":disabled": {
                  bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                  cursor: "initial",
                },
              }}
              _disabled={{
                bgGradient: "linear(to-b, wynd.gray.300, wynd.gray.400)",
                cursor: "initial",
              }}
              disabled={asset.balance === "0"}
              onClick={() => setWithdrawIbcModalOpen({ isOpen: true, chainId: asset.chain_id })}
              height="fit-content"
              px="4"
              py="2"
            >
              IBC Withdraw
            </Button>
          </Flex>
        ) : (
          <Text></Text>
        )}
      </GridItem>
    </Grid>
  );
}
