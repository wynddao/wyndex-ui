import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { IBCAsset } from "@wynddao/asset-list";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { depositIbcModalAtom, withdrawIbcModalAtom } from "../../../state/recoil/atoms/modal";
import { microamountToAmount } from "../../../utils/tokens";
import { ExtendedAsset } from "./utils";

interface AssetBalanceItemProps {
  readonly asset: ExtendedAsset;
  readonly toggleFav: () => void;
}

export default function AssetBalanceItem({ asset, toggleFav }: AssetBalanceItemProps) {
  const setDepositIbcModalOpen = useSetRecoilState(depositIbcModalAtom);
  const setWithdrawIbcModalOpen = useSetRecoilState(withdrawIbcModalAtom);

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
        <Badge rounded="md" py="1" px="2" fontSize="x-small">
          {asset.tags}
        </Badge>
      </GridItem>
      <GridItem display="flex" alignItems="center" justifyContent="end">
        <Text fontSize="lg" mb={0.5}>
          {microamountToAmount(asset.balance, asset.decimals)}
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
