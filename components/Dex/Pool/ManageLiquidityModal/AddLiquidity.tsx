import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  NumberInput,
  NumberInputField,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react-lite";
import { Coin } from "cosmwasm";
import { startTransition, useCallback, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CustomHooks, getBalanceByAsset, useIndexerInfos, useToast } from "../../../../state";
import { Asset as WyndAsset, PairInfo, PoolResponse } from "../../../../state/clients/types/WyndexPair.types";
import TokenName from "../../TokenName";

import { CW20Asset, IBCAsset } from "@wynddao/asset-list";
import { AiFillWarning } from "react-icons/ai";
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from "recoil";
import { useUserStakeInfos } from "../../../../state/hooks/useUserStakeInfos";
import { getAssetByInfo, getAssetInfoDetails, getNativeIbcTokenDenom } from "../../../../utils/assets";
import { amountToMicroamount, microamountToAmount, microdenomToDenom } from "../../../../utils/tokens";
import AssetImage from "../../AssetImage";
interface inputType {
  id: string;
  value: string;
  contract?: string;
}

interface singleType {
  selectedIndex: number;
  isSingle: boolean;
}

interface popType {
  optionsIndex: DataType[];
  isOpen: boolean;
}

interface DataType {
  img: string;
  denomOrAddr: string;
  name: any;
  contractAddress?: string;
  show?: boolean;
}

export default function AddLiquidity({
  data: pairData,
  onClose,
  refreshLpBalance,
  poolData: chainData,
}: {
  data: PairInfo;
  onClose: () => void;
  refreshLpBalance: () => void;
  poolData: PoolResponse;
}) {
  const poolData: readonly DataType[] = pairData.asset_infos.map((asset) => {
    const isCw20Asset = "token" in asset;

    return {
      img: "https://via.placeholder.com/300",
      denomOrAddr: isCw20Asset ? asset.token : asset.native,
      contractAddress: isCw20Asset ? asset.token : undefined,
      name: isCw20Asset ? (
        <TokenName symbol={true} address={asset.token} />
      ) : (
        <span>{microdenomToDenom(getNativeIbcTokenDenom(asset.native))}</span>
      ),
      show: true,
    };
  });

  const { address: walletAddress } = useChain("juno");
  const { refreshBondings } = useUserStakeInfos(pairData.staking_addr, walletAddress || "");
  const { refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({});
  const { permlessAssets } = useIndexerInfos({});
  const [loading, setLoading] = useState<boolean>(false);

  const defaultInput = poolData.map(({ denomOrAddr: label, contractAddress }) => ({
    id: label,
    value: "0",
    contract: contractAddress,
  }));
  const [tokenInputValue, setTokenInputValue] = useState<inputType[]>(defaultInput);
  const [[showJunoWarning, junoSymbol], setShowJunoWarning] = useState<[boolean, string]>([false, "JUNO"]);
  const [single, setSingle] = useState<singleType>({ selectedIndex: 0, isSingle: false });
  const [openPop, setOpenPop] = useState<popType>({ optionsIndex: [], isOpen: false });
  const { txToast } = useToast();

  const doProvideLiquidity = CustomHooks.useCustomProvideLP({
    sender: walletAddress || "",
  });

  const assetASelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: getAssetByInfo(pairData.asset_infos[0]),
  });
  const assetBSelector = getBalanceByAsset({
    address: walletAddress || "",
    asset: getAssetByInfo(pairData.asset_infos[1]),
  });
  const { state: assetABalanceState, contents: assetABalance } = useRecoilValueLoadable(assetASelector);
  const { state: assetBBalanceState, contents: assetBBalance } = useRecoilValueLoadable(assetBSelector);
  const refreshBalanceA = useRecoilRefresher_UNSTABLE(assetASelector);
  const refreshBalanceB = useRecoilRefresher_UNSTABLE(assetBSelector);

  const calculateRatios = useCallback(() => {
    const [newInputValueA, newInputValueB] = tokenInputValue;

    const assetA = chainData.assets.find((asset) =>
      "token" in asset.info
        ? asset.info.token === newInputValueA.id
        : asset.info.native === newInputValueA.id,
    );
    const assetB = chainData.assets.find((asset) =>
      "token" in asset.info
        ? asset.info.token === newInputValueB.id
        : asset.info.native === newInputValueB.id,
    );

    const assets = permlessAssets;
    const decimalsA =
      assets.find(
        (el) =>
          newInputValueA.id === el.denom ||
          newInputValueA.id === (el as IBCAsset).juno_denom ||
          newInputValueA.id === (el as CW20Asset).token_address,
      )?.decimals || 6;
    const decimalsB =
      assets.find(
        (el) =>
          newInputValueB.id === el.denom ||
          newInputValueB.id === (el as IBCAsset).juno_denom ||
          newInputValueB.id === (el as CW20Asset).token_address,
      )?.decimals || 6;

    const ratioA =
      Number(assetB?.amount || "0") / 10 ** decimalsB / (Number(assetA?.amount || "0") / 10 ** decimalsA);
    const ratioB =
      Number(assetA?.amount || "0") / 10 ** decimalsA / (Number(assetB?.amount || "0") / 10 ** decimalsB);
    return [ratioA, ratioB];
  }, [chainData.assets, tokenInputValue]);

  const calculateInputValues = useCallback(
    (denom: string, inputValue: string) => {
      if (assetABalanceState !== "hasValue" || assetBBalanceState !== "hasValue") return;
      const [newInputValueA, newInputValueB] = tokenInputValue;
      const [ratioA, ratioB] = calculateRatios();
      const assets = permlessAssets;
      const decimalsA =
        assets.find(
          (el) => newInputValueA.id === el.denom || newInputValueA.id === (el as CW20Asset).token_address,
        )?.decimals || 6;
      const decimalsB =
        assets.find(
          (el) => newInputValueB.id === el.denom || newInputValueB.id === (el as CW20Asset).token_address,
        )?.decimals || 6;
      if (isNaN(ratioA) && isNaN(ratioB)) {
        newInputValueA.value = denom === newInputValueA.id ? inputValue : newInputValueA.value;
        newInputValueB.value = denom === newInputValueB.id ? inputValue : newInputValueB.value;
      } else {
        newInputValueA.value =
          denom === newInputValueA.id ? inputValue : (Number(inputValue) / ratioA).toFixed(decimalsA);
        newInputValueB.value =
          denom === newInputValueB.id ? inputValue : (Number(inputValue) / ratioB).toFixed(decimalsB);
      }

      setTokenInputValue([newInputValueA, newInputValueB]);

      const isAJuno = newInputValueA.id === "ujunox" || newInputValueA.id === "ujuno";
      const isBJuno = newInputValueB.id === "ujunox" || newInputValueB.id === "ujuno";
      const isSomeJuno = isAJuno || isBJuno;

      const junoBalance = (() => {
        if (!isSomeJuno) return "0";
        return isAJuno ? assetABalance.amount : assetBBalance.amount;
      })();
      const hasJunoBalance = junoBalance !== "0";

      const junoInputValue = (() => {
        if (!isSomeJuno) return "0";
        return isAJuno ? newInputValueA.value : newInputValueB.value;
      })();
      const isJunoAmountMax =
        Number(junoInputValue) >
        Number(microamountToAmount(Number(junoBalance) - 50000, isAJuno ? decimalsA : decimalsB));

      const showJunoWarning = isSomeJuno && hasJunoBalance && isJunoAmountMax;
      const junoSymbol = assets.find((el) => el.denom === "ujunox" || el.denom === "ujuno")?.symbol || "JUNO";
      setShowJunoWarning([showJunoWarning, junoSymbol]);
    },
    [
      assetABalance.amount,
      assetABalanceState,
      assetBBalance.amount,
      assetBBalanceState,
      calculateRatios,
      tokenInputValue,
    ],
  );

  const calculateMaxValues = useCallback(() => {
    if (assetABalanceState !== "hasValue" || assetBBalanceState !== "hasValue") return;

    const [newInputValueA, newInputValueB] = tokenInputValue;
    const [ratioA, ratioB] = calculateRatios();

    const assets = permlessAssets;
    const decimalsA =
      assets.find(
        (el) =>
          newInputValueA.id === el.denom ||
          newInputValueA.id === (el as IBCAsset).juno_denom ||
          newInputValueA.id === (el as CW20Asset).token_address,
      )?.decimals || 6;
    const decimalsB =
      assets.find(
        (el) =>
          newInputValueB.id === el.denom ||
          newInputValueA.id === (el as IBCAsset).juno_denom ||
          newInputValueB.id === (el as CW20Asset).token_address,
      )?.decimals || 6;

    const isAJuno = newInputValueA.id === "ujunox" || newInputValueA.id === "ujuno";
    const isBJuno = newInputValueB.id === "ujunox" || newInputValueB.id === "ujuno";

    const maxMicroBalanceA = microamountToAmount(
      isAJuno ? Number(assetABalance.amount) - 50000 : assetABalance.amount,
      decimalsA,
    );
    const maxMicroBalanceB = microamountToAmount(
      isBJuno ? Number(assetBBalance.amount) - 50000 : assetBBalance.amount,
      decimalsB,
    );

    if (Number(maxMicroBalanceA) / ratioB < Number(maxMicroBalanceB)) {
      newInputValueA.value = maxMicroBalanceA;
      newInputValueB.value = (Number(maxMicroBalanceA) / ratioB).toFixed(decimalsA);
    } else {
      newInputValueB.value = maxMicroBalanceB;
      newInputValueA.value = (Number(maxMicroBalanceB) / ratioA).toFixed(decimalsB);
    }

    setTokenInputValue([newInputValueA, newInputValueB]);
  }, [
    assetABalance.amount,
    assetABalanceState,
    assetBBalance.amount,
    assetBBalanceState,
    calculateRatios,
    tokenInputValue,
  ]);

  const prodiveLiquidity = async () => {
    setLoading(true);
    const assets = tokenInputValue
      .filter((token) => {
        return token.value !== "0";
      })
      .map((token): WyndAsset => {
        const info = token.contract ? { token: token.contract } : { native: token.id };
        const { decimals } = getAssetInfoDetails(info);
        return {
          amount: amountToMicroamount(token.value, decimals),
          info: token.contract ? { token: token.contract } : { native: token.id },
        };
      });
    // @ts-ignore
    const funds: Coin[] | undefined = tokenInputValue
      .filter((element) => !element.contract)
      .map((e) => {
        if (!e.contract) {
          const { decimals } = getAssetInfoDetails({ native: e.id });
          return {
            amount: amountToMicroamount(e.value || "", decimals) || "1",
            denom: e.id,
          };
        }
      });

    // Funds must be sorted as of
    // https://github.com/cosmos/cosmos-sdk/blob/579121912172e1bd4069a50ad1a988c22a15dfe4/types/coin.go#L255-L257
    if (funds) {
      funds.sort((a, b) => (a.denom > b.denom ? 1 : b.denom > a.denom ? -1 : 0));
    }
    await txToast(async () => {
      const res = await doProvideLiquidity({
        pairContractAddress: pairData.contract_addr,
        assets: assets,
        funds,
        slippageTolerance: "0.03",
      });
      onClose();
      return res;
    });
    setLoading(false);
    // New balances will not appear until the next block.
    await new Promise((resolve) => setTimeout(resolve, 6500));
    const hasCw20 = !!assets.find(({ info }) => "token" in info);
    const hasNative = !!assets.find(({ info }) => "native" in info);
    //FIXME - This startTransition does not work
    startTransition(() => {
      refreshBalanceA();
      refreshBalanceB();
      refreshBondings();
      refreshLpBalance();

      if (hasCw20) refreshCw20Balances();
      if (hasNative) refreshIbcBalances();
    });
  };

  const assets = permlessAssets;

  return (
    <>
      <Stack spacing={2} mb={6}>
        {poolData.map(({ denomOrAddr, show, name }, i) => {
          const asset = assets.find(
            (asset) =>
              denomOrAddr === asset.denom ||
              denomOrAddr === (asset as CW20Asset).token_address ||
              denomOrAddr === (asset as IBCAsset).juno_denom,
          );

          let maxInput = "0";
          if (assetABalanceState === "hasValue" && assetBBalanceState === "hasValue") {
            maxInput = microamountToAmount(
              i === 0 ? assetABalance.amount : assetBBalance.amount,
              asset?.decimals ?? 6,
            );
          }

          return (
            show && (
              <Box position="relative" key={`box-${name}-${i}`}>
                {single.isSingle && (
                  <Popover returnFocusOnClose={false} isOpen={openPop.isOpen}>
                    <PopoverTrigger>
                      <Button w={0} h={0} minW={0} p={0} />
                    </PopoverTrigger>
                    <PopoverContent
                      position="absolute"
                      top={{ base: 24, sm: "6.7rem" }}
                      left={0}
                      borderTopStyle="dashed"
                      borderRadius={openPop.isOpen ? "0 0 0.375rem 0.375rem" : "md"}
                      bg={"wynd.alpha.50"}
                      w="full"
                      maxW={{ base: 60, sm: "sm" }}
                      minW={{ base: 60, sm: "sm" }}
                      _focus={{ outline: "none" }}
                    >
                      <PopoverBody>
                        {openPop.optionsIndex.map(({ denomOrAddr: optionLabel, img, name }, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            w="full"
                            h="fit-content"
                            justifyContent="flex-start"
                            flexWrap="wrap"
                            fontSize="xl"
                            fontWeight="bold"
                            wordBreak="break-word"
                            px={{ base: 2, sm: 4 }}
                            py={4}
                            onClick={() => {
                              poolData.map(({ denomOrAddr: denom }, i) => {
                                if (optionLabel === denom) {
                                  setSingle({
                                    selectedIndex: i,
                                    isSingle: true,
                                  });
                                  setOpenPop({
                                    optionsIndex: openPop.optionsIndex,
                                    isOpen: false,
                                  });
                                }
                              });
                            }}
                          >
                            <Image alt={`${denomOrAddr} logo`} src={img} w={12} mr={{ base: 3, sm: 4 }} />
                            {name}
                          </Button>
                        ))}
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
                <Flex
                  key={1}
                  border="1px solid"
                  borderColor={"wynd.alpha.900"}
                  borderRadius={openPop.isOpen ? "1rem 1rem 1rem 0" : "2xl"}
                  align="center"
                  flexDirection={{ base: "column", sm: "row" }}
                  wrap="wrap"
                  p={4}
                  gap={4}
                >
                  <Flex flex={1} align="center" mb={{ base: 4, sm: 0 }} mr={{ base: 0, sm: 4 }} py={2}>
                    <AssetImage asset={denomOrAddr} width={12} mr={{ base: 3, sm: 4 }} />
                    <Flex
                      position="relative"
                      align="center"
                      _hover={{ cursor: single.isSingle && "pointer" }}
                      onClick={() =>
                        setOpenPop({
                          optionsIndex: poolData.filter((_, index) => index !== i),
                          isOpen: !openPop.isOpen,
                        })
                      }
                    >
                      <Text fontWeight="bold" fontSize={{ base: "xl" }}>
                        {name}
                      </Text>
                      {single.isSingle && (
                        <IconButton
                          variant="unstyled"
                          icon={<IoIosArrowDown />}
                          aria-label="singleButton"
                          _focus={{ outline: "none" }}
                          padding={4}
                        />
                      )}
                    </Flex>
                  </Flex>
                  <Box flex={1}>
                    <Stack
                      isInline={true}
                      w="full"
                      justify={{ base: "center", sm: "end" }}
                      align="center"
                      wrap="wrap"
                      spacing={2}
                      mb={2}
                    >
                      {assetABalanceState === "hasValue" && assetBBalanceState === "hasValue" ? (
                        <Text fontWeight="medium" textAlign="center">
                          Available {maxInput}
                          <Text as="span" color={"wynd.cyan.500"}></Text> {name}
                        </Text>
                      ) : (
                        <Text fontWeight="medium" textAlign="center">
                          Loading balance
                        </Text>
                      )}
                      <Button
                        alignSelf="end"
                        size="sm"
                        sx={{ display: i === 0 ? "flex" : "none" }}
                        _focus={{ outline: "none" }}
                        onClick={calculateMaxValues}
                      >
                        MAX
                      </Button>
                    </Stack>
                    <NumberInput
                      alignItems="center"
                      value={tokenInputValue[i].value}
                      bg={"wynd.alpha.200"}
                      min={0}
                      max={Number(maxInput)}
                      onChange={(value) => calculateInputValues(denomOrAddr, value)}
                    >
                      <NumberInputField textAlign="end" pr={4} />
                    </NumberInput>
                  </Box>
                </Flex>
              </Box>
            )
          );
        })}
        {showJunoWarning ? (
          <Box
            w="full"
            display="flex"
            alignItems="center"
            gap={2}
            p={4}
            borderRadius="lg"
            backgroundColor="wynd.alert.warning.500"
            color="black"
          >
            <AiFillWarning size={64} />
            <Text>
              If you spend all your {junoSymbol}, you won&apos;t be able to pay for the fees of future
              transactions.
            </Text>
          </Box>
        ) : null}
      </Stack>
      <Box px={{ sm: 12 }}>
        <Button
          onClick={() => prodiveLiquidity()}
          isLoading={loading}
          loadingText={"Executing"}
          isDisabled={
            !(tokenInputValue.filter(({ value }) => Number(value) > 0).length > 0) ||
            tokenInputValue.filter((input, index) => {
              const asset = assets.find(
                (asset) => input.id === asset.denom || input.contract === (asset as CW20Asset).token_address,
              );

              let maxInput = "0";
              if (assetABalanceState === "hasValue" && assetBBalanceState === "hasValue") {
                maxInput = microamountToAmount(
                  index === 0 ? assetABalance.amount : assetBBalance.amount,
                  asset?.decimals ?? 6,
                );
              }

              return Number(input.value) > Number(maxInput);
            }).length > 0
          }
          w="full"
          size="lg"
          h={{ base: 12, sm: 14 }}
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
        >
          Add Liquidity
        </Button>
      </Box>
    </>
  );
}
