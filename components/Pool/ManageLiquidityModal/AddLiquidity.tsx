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
import { useWallet } from "@cosmos-kit/react";
import { Coin } from "cosmwasm";
import { startTransition, useCallback, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CustomHooks, useIndexerInfos, useToast, useTokenInfo } from "../../../state";
import { Asset as WyndAsset, PairInfo, PoolResponse } from "../../../state/clients/types/WyndexPair.types";
import TokenName from "../../TokenName";

import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { useUserStakeInfos } from "../../../state/hooks/useUserStakeInfos";
import { getAssetInfoDetails, getNativeIbcTokenDenom } from "../../../utils/assets";
import { getAssetList } from "../../../utils/getAssetList";
import { amountToMicroamount, microamountToAmount, microdenomToDenom } from "../../../utils/tokens";
import AssetImage from "../../AssetImage";
import { CW20Asset } from "@wynddao/asset-list";
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
  denom: string;
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
    return {
      img: "https://via.placeholder.com/300",
      // @ts-ignore
      denom: asset.hasOwnProperty("native") ? asset.native : asset.token,
      // @ts-ignore
      contractAddress: asset.hasOwnProperty("token") ? asset.token : undefined,
      // @ts-ignore
      name: asset.hasOwnProperty("token") ? (
        // @ts-ignore
        <TokenName symbol={true} address={asset.token} />
      ) : (
        // @ts-ignore
        <span>{microdenomToDenom(getNativeIbcTokenDenom(asset.native))}</span>
      ),
      show: true,
    };
  });

  const { address: walletAddress } = useWallet();
  const { refreshBondings } = useUserStakeInfos(pairData.staking_addr, walletAddress || "");
  const { assetInfosBalancesSelector, refreshIbcBalances, refreshCw20Balances } = useIndexerInfos({});

  const [loading, setLoading] = useState<boolean>(false);

  const defaultInput = poolData.map(({ denom: label, contractAddress }) => ({
    id: label,
    value: "0",
    contract: contractAddress,
  }));
  const [tokenInputValue, setTokenInputValue] = useState<inputType[]>(defaultInput);
  const [single, setSingle] = useState<singleType>({ selectedIndex: 0, isSingle: false });
  const [openPop, setOpenPop] = useState<popType>({ optionsIndex: [], isOpen: false });
  const { txToast } = useToast();

  const doProvideLiquidity = CustomHooks.useCustomProvideLP({
    sender: walletAddress || "",
  });

  const pairBalancesSelector = assetInfosBalancesSelector(pairData.asset_infos);
  const pairBalances = useRecoilValue(pairBalancesSelector);
  const refreshPairBalances = useRecoilRefresher_UNSTABLE(pairBalancesSelector);

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

    const assets = getAssetList().tokens;
    const decimalsA =
      assets.find(
        (el) => newInputValueA.id === el.denom || newInputValueA.id === (el as CW20Asset).token_address,
      )?.decimals || 6;
    const decimalsB =
      assets.find(
        (el) => newInputValueB.id === el.denom || newInputValueB.id === (el as CW20Asset).token_address,
      )?.decimals || 6;
    const ratioA =
      Number(assetB?.amount || "0") / 10 ** decimalsB / (Number(assetA?.amount || "0") / 10 ** decimalsA);
    const ratioB =
      Number(assetA?.amount || "0") / 10 ** decimalsA / (Number(assetB?.amount || "0") / 10 ** decimalsB);
    return [ratioA, ratioB];
  }, [chainData.assets, tokenInputValue]);

  const calculateInputValues = useCallback(
    (denom: string, inputValue: string) => {
      const [newInputValueA, newInputValueB] = tokenInputValue;
      const [ratioA, ratioB] = calculateRatios();

      if (isNaN(ratioA) && isNaN(ratioB)) {
        newInputValueA.value = denom === newInputValueA.id ? inputValue : newInputValueA.value;
        newInputValueB.value = denom === newInputValueB.id ? inputValue : newInputValueB.value;
      } else {
        newInputValueA.value =
          denom === newInputValueA.id ? inputValue : (Number(inputValue) / ratioA).toFixed(6);
        newInputValueB.value =
          denom === newInputValueB.id ? inputValue : (Number(inputValue) / ratioB).toFixed(6);
      }

      setTokenInputValue([newInputValueA, newInputValueB]);
    },
    [calculateRatios, tokenInputValue],
  );

  const calculateMaxValues = useCallback(() => {
    const [newInputValueA, newInputValueB] = tokenInputValue;
    const [ratioA, ratioB] = calculateRatios();
    const assets = getAssetList().tokens;
    const decimalsA =
      assets.find(
        (el) => newInputValueA.id === el.denom || newInputValueA.id === (el as CW20Asset).token_address,
      )?.decimals || 6;
    const decimalsB =
      assets.find(
        (el) => newInputValueB.id === el.denom || newInputValueB.id === (el as CW20Asset).token_address,
      )?.decimals || 6;
    const maxMicroBalanceA = microamountToAmount(pairBalances[0], decimalsA);
    const maxMicroBalanceB = microamountToAmount(pairBalances[1], decimalsB);

    if (Number(maxMicroBalanceA) / ratioB < Number(maxMicroBalanceB)) {
      newInputValueA.value = maxMicroBalanceA;
      newInputValueB.value = (Number(maxMicroBalanceA) / ratioB).toFixed(6);
    } else {
      newInputValueB.value = maxMicroBalanceB;
      newInputValueA.value = (Number(maxMicroBalanceB) / ratioA).toFixed(6);
    }

    setTokenInputValue([newInputValueA, newInputValueB]);
  }, [calculateRatios, pairBalances, tokenInputValue]);

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    const hasCw20 = !!assets.find(({ info }) => "token" in info);
    const hasNative = !!assets.find(({ info }) => "native" in info);
    //FIXME - This startTransition does not work
    startTransition(() => {
      refreshPairBalances();
      refreshBondings();
      refreshLpBalance();

      if (hasCw20) refreshCw20Balances();
      if (hasNative) refreshIbcBalances();
    });
  };

  const assets = getAssetList().tokens;

  return (
    <>
      <Stack spacing={2} mb={6}>
        {poolData.map(({ denom, show, name }, i) => {
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
                        {openPop.optionsIndex.map(({ denom: optionLabel, img, name }, i) => (
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
                              poolData.map(({ denom }, i) => {
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
                            <Image alt={`${denom} logo`} src={img} w={12} mr={{ base: 3, sm: 4 }} />
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
                    <AssetImage asset={denom} width={12} mr={{ base: 3, sm: 4 }} />
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
                      <Text fontWeight="medium" textAlign="center">
                        Available{" "}
                        {microamountToAmount(
                          pairBalances[i] ?? "",
                          assets.find((el) => denom === el.denom || denom === (el as CW20Asset).token_address)
                            ?.decimals || 6,
                        )}
                        <Text as="span" color={"wynd.cyan.500"}></Text> {name}
                      </Text>
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
                      max={Number(pairBalances[i])}
                      onChange={(value) => calculateInputValues(denom, value)}
                    >
                      <NumberInputField textAlign="end" pr={4} />
                    </NumberInput>
                  </Box>
                </Flex>
              </Box>
            )
          );
        })}
      </Stack>
      <Box px={{ sm: 12 }}>
        <Button
          onClick={() => prodiveLiquidity()}
          isLoading={loading}
          loadingText={"Executing"}
          isDisabled={
            !(tokenInputValue.filter(({ value }) => Number(value) > 0).length > 0) ||
            tokenInputValue.filter(
              ({ value }, index) =>
                Number(value) >
                Number(
                  microamountToAmount(
                    pairBalances[index],
                    assets.find((el) => value === el.denom || value === (el as CW20Asset).token_address)
                      ?.decimals || 6,
                  ),
                ),
            ).length > 0
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
