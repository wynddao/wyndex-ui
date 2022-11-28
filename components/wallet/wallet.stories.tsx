import { Box, Button, Center, Container, Icon, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { boolean, number, select, text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import Bowser from "bowser";
import { assets, chains } from "chain-registry";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { GoDesktopDownload } from "react-icons/go";
import { RiAlarmWarningLine, RiDoorOpenFill, RiErrorWarningLine, RiQuestionLine } from "react-icons/ri";

import { DefaultLink } from "../../default-component";
import { Astronaut } from "../../svg-icons";
import {
  ShowBalanceAssetsDetailsType,
  UserDeviceInfoType,
  Wallet,
  WalletMode,
  WalletStatus,
} from "../../types";
import {
  ConnectWalletButtonConfig,
  DisplayModalContent,
  DisplayModalHead,
  WalletData,
  WalletIcons,
} from "./config";
import { ConnectedUserCard } from "./ConnectedUserCard";
import { ConnectModal } from "./ConnectModal";
import { DisplayContent, DisplayWalletList, InstallWalletButton, QRCode } from "./ConnectModalContent";
import { ButtonTips, DisplayModalControlButton, ModalHead } from "./ConnectModalHead";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { ConnectWalletCard, SimpleAvatarWithName } from "./ConnectWalletCard";
import { CopyAddressButton } from "./CopyAddressButton";
import ShowBalance from "./ShowBalance";
import { SimpleConnectModal } from "./SimpleConnectModal";
import {
  SimpleDisplayModalContent,
  SimpleDisplayWalletList,
  SimpleInstallWalletButton,
  SimpleQRCode,
} from "./SimpleConnectModalContent";
import { SimpleModalHead } from "./SimpleConnectModalHead";
import { WarnBlock } from "./WarnCard";

function onClickConnectBtn() {
  console.log("do something"); // eslint-disable-line
}

const SIZES = {
  large: "lg",
  medium: "md",
  small: "sm",
};
const STATUS = WalletStatus;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getShuffledArr = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[rand]] = [arr[rand], arr[i]];
  }
  return arr;
};
const chainInfo = chains
  .filter(({ status }) => status === "live")
  .map(({ pretty_name, chain_name, chain_id, apis }) => ({
    label: pretty_name,
    value: chain_id,
    chainName: chain_name,
    address: (chain_name + Buffer.from(apis.rest[0].address, "utf-8").toString("base64")).slice(0, 32),
  }));
const chainList = chainInfo.map((chains) => ({
  label: chains.label,
  value: chains.value,
  chainName: chains.chainName,
  icon: assets
    .filter(({ chain_name }) => chains.chainName === chain_name)[0]
    ?.assets.filter(({ name }) => name === chains.label)[0]?.logo_URIs,
  address: chains.address,
}));

storiesOf("Cosmology/wallet", module).add("CopyAddressButton", () => {
  const selectWalletOption = {
    Keplr: "keplr",
    MetaMask: "metamask",
  };
  const maxDisplayLength = number("max display length", null);
  const roundButton = boolean("radius is round", false);
  const walletIcon = select("wallet image", selectWalletOption, selectWalletOption.Keplr);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const getRandomAddress = getShuffledArr(chainInfo)[0].address;
    setTimeout(() => {
      setAddress(getRandomAddress);
    }, 500);
  }, []);

  return (
    <Container w="full" maxW={80} mx="auto" py={16}>
      <Stack w="full" spacing={6}>
        <Stack w="full">
          <Text>size: lg</Text>
          <CopyAddressButton
            size="lg"
            address={address}
            walletIcon={WalletIcons[walletIcon]}
            maxDisplayLength={maxDisplayLength}
            isRound={roundButton}
          />
        </Stack>
        <Stack w="full">
          <Text>size: md</Text>
          <CopyAddressButton
            size="md"
            address={address}
            walletIcon={WalletIcons[walletIcon]}
            maxDisplayLength={maxDisplayLength}
            isRound={roundButton}
          />
        </Stack>
        <Stack w="full">
          <Text>size: sm</Text>
          <CopyAddressButton
            size="sm"
            address={address}
            walletIcon={WalletIcons[walletIcon]}
            maxDisplayLength={maxDisplayLength}
            isRound={roundButton}
          />
        </Stack>
      </Stack>
    </Container>
  );
});

storiesOf("Cosmology/wallet", module).add("ConnectWalletButton", () => {
  const isConnect = boolean("connect wallet", false);
  const rejected = boolean("wallet rejected", false);
  const notExist = boolean("wallet not exist", false);
  const error = boolean("error", false);
  const size = select("size", SIZES, SIZES.medium);

  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState("primary");
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [icon, setIcon] = useState<React.ReactNode | undefined>();

  useEffect(() => {
    setIsLoading(true);
    if (isConnect) {
      setVariant("secondary");
      setButtonText("Disconnect");
      setIcon(<RiDoorOpenFill />);
      setTimeout(() => setIsLoading(false), 1500);
    }
    if (!isConnect) {
      setVariant("primary");
      setButtonText("Connect Wallet");
      setIcon(undefined);
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [isConnect]);

  useEffect(() => {
    setIsDisabled(false);
    if (rejected) {
      setVariant("secondary");
      setButtonText("Wallet Rejected");
      setIcon(<RiAlarmWarningLine />);
      setIsDisabled(true);
    }
    if (notExist) {
      setVariant("secondary");
      setButtonText("Wallet Not Exist");
      setIcon(<RiQuestionLine />);
      setIsDisabled(true);
    }
    if (error) {
      setVariant("secondary");
      setButtonText("Error");
      setIcon(<RiErrorWarningLine />);
      setIsDisabled(true);
    }
  }, [rejected, notExist, error]);

  return (
    <Stack mx="auto" maxW={56} p={4} spacing={6}>
      <Stack>
        <Text>variant: primary</Text>
        <ConnectWalletButton
          size="lg"
          buttonText="Connect Wallet"
          variant="primary"
          onClickConnectBtn={onClickConnectBtn}
        />
      </Stack>
      <Stack>
        <Text>variant: secondary</Text>
        <ConnectWalletButton
          size="lg"
          buttonText="Disconnect"
          variant="secondary"
          leftIcon={<></>}
          rightIcon={<Icon as={RiDoorOpenFill} w="initial" h="initial" />}
          onClickConnectBtn={onClickConnectBtn}
        />
      </Stack>
      <Stack>
        <Text>variant: tertiary</Text>
        <ConnectWalletButton
          size="lg"
          buttonText="Tertiary Demo"
          variant="tertiary"
          onClickConnectBtn={onClickConnectBtn}
        />
      </Stack>
      <Stack>
        <Text>with knobs</Text>
        <ConnectWalletButton
          size={size}
          leftIcon={icon}
          buttonText={buttonText}
          variant={variant}
          isLoading={isLoading}
          isDisabled={isDisabled}
          onClickConnectBtn={onClickConnectBtn}
        />
      </Stack>
    </Stack>
  );
});

storiesOf("Cosmology/wallet", module).add("ShowBalance", () => {
  const [assetsDetailsData, setAssetsDetailsData] = useState<ShowBalanceAssetsDetailsType[] | []>([]);
  const [assetsTotalData, setAssetsTotalData] = useState({
    total: "0",
    availableAsset: "0",
    bondedAssets: "0",
    stakedAssets: "0",
  });

  useEffect(() => {
    const getAssetsDetailData = chainList.map(({ label, icon }) => ({
      name: label,
      imgSrc: icon?.png || icon?.jpeg || icon?.svg,
      amount: (
        parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) / 100000000
      ).toFixed(4),
      value:
        "$" +
        (
          parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) /
          100000000
        ).toFixed(2),
      depositLink: "#",
      withdrawLink: "#",
    }));
    const getAssetsTotalData = {
      total:
        "$" +
        (
          parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) /
          100000000
        ).toFixed(2),
      availableAsset:
        "$" +
        (
          parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) /
          100000000
        ).toFixed(2),
      bondedAssets:
        "$" +
        (
          parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) /
          100000000
        ).toFixed(2),
      stakedAssets:
        "$" +
        (
          parseFloat(getShuffledArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).toString().replaceAll(",", "")) /
          100000000
        ).toFixed(2),
    };

    setAssetsDetailsData(getAssetsDetailData);
    setAssetsTotalData(getAssetsTotalData);
  }, []);

  return <ShowBalance assetsDetailsData={assetsDetailsData} assetsTotalData={assetsTotalData} />;
});

storiesOf("Cosmology/wallet", module).add("ConnectModal", () => {
  const connectWalletStatus = select("wallet status", STATUS, STATUS.Connecting);
  const size = select("size", SIZES, SIZES.medium);

  const { isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure();
  const initialFocus = useRef();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>();
  const [modalHead, setModalHead] = useState<ReactNode>();
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [userBrowserInfo, setUserBrowserInfo] = useState<UserDeviceInfoType | undefined>();

  function handleClear() {
    setSelectedWallet(undefined);
  }
  function handleClose() {
    modalOnClose();
    connectWalletStatus !== WalletStatus.Connected && handleClear(); // eslint-disable-line
  }
  function handleSelectWallet(select: Wallet) {
    setSelectedWallet(select);
  }

  useEffect(() => {
    setUserBrowserInfo({
      browser: Bowser.getParser(window.navigator.userAgent).getBrowserName(true),
      device: Bowser.getParser(window.navigator.userAgent).getPlatform().type,
      os: Bowser.getParser(window.navigator.userAgent).getOSName(true),
    });
  }, []);
  useEffect(() => {
    if (connectWalletStatus === WalletStatus.Connected && userBrowserInfo) {
      return userBrowserInfo.device === "desktop"
        ? setSelectedWallet(WalletData[0])
        : setSelectedWallet(WalletData[1]);
    }
  }, [connectWalletStatus, userBrowserInfo]);
  useEffect(() => {
    if (!selectedWallet) {
      setModalHead(
        <ModalHead
          size={size}
          leftButton={
            <ButtonTips
              size={size}
              icon={DisplayModalHead.withInfo.leftIcon}
              header={DisplayModalHead.withInfo.header}
              content={DisplayModalHead.withInfo.content}
              placement={DisplayModalHead.withInfo.placement}
            />
          }
          rightButton={
            <DisplayModalControlButton
              size={size}
              icon={DisplayModalHead.default.rightIcon}
              handleClick={handleClose}
            />
          }
          title="Connect Wallet"
        />,
      );
      setModalContent(
        <DisplayWalletList
          initialFocus={initialFocus}
          walletsData={WalletData}
          size={size}
          handleClick={handleSelectWallet}
        />,
      );
    }
    if (selectedWallet) {
      setModalHead(
        <ModalHead
          size={size}
          leftButton={
            <DisplayModalControlButton
              size={size}
              icon={DisplayModalHead.default.leftIcon}
              handleClick={handleClear}
            />
          }
          title={selectedWallet.prettyName}
          rightButton={
            <DisplayModalControlButton
              size={size}
              icon={DisplayModalHead.default.rightIcon}
              handleClick={handleClose}
            />
          }
        />,
      );
      if (connectWalletStatus === WalletStatus.NotExist)
        setModalContent(
          <DisplayContent
            size={size}
            logo={selectedWallet.logo}
            contentHeader={`${selectedWallet.prettyName} ${DisplayModalContent.NotExist.header}`}
            contentDesc={`${DisplayModalContent.NotExist.desc} ${selectedWallet.prettyName} to connect your wallet`}
            bottomButton={
              <DefaultLink
                target="_blank"
                href={
                  selectedWallet.downloads[userBrowserInfo.device].find(
                    ({ browser, os }) => browser === userBrowserInfo.browser || os === userBrowserInfo.os,
                  )?.link || selectedWallet.downloads
                }
              >
                <InstallWalletButton
                  size={size}
                  icon={
                    selectedWallet.downloads[userBrowserInfo.device].find(
                      ({ browser, os }) => browser === userBrowserInfo.browser || os === userBrowserInfo.os,
                    )?.icon || GoDesktopDownload
                  }
                  text={`${ConnectWalletButtonConfig.NotExist.text} ${
                    userBrowserInfo.device === "desktop" ? "Extension" : "App"
                  }`}
                />
              </DefaultLink>
            }
          />,
        );
      if (connectWalletStatus !== WalletStatus.NotExist) {
        if (selectedWallet.mode === WalletMode.Extension) {
          if (connectWalletStatus !== WalletStatus.Connected)
            setModalContent(
              <DisplayContent
                size={size}
                status={DisplayModalContent[connectWalletStatus].logoStatus}
                logo={selectedWallet.logo}
                contentHeader={DisplayModalContent[connectWalletStatus].header}
                contentDesc={DisplayModalContent[connectWalletStatus].desc}
                bottomButton={
                  connectWalletStatus !== WalletStatus.Connecting && (
                    <ConnectWalletButton
                      size={size}
                      variant="primary"
                      leftIcon={<Icon as={ConnectWalletButtonConfig[connectWalletStatus].leftIcon} />}
                      buttonText={ConnectWalletButtonConfig[connectWalletStatus].text}
                    />
                  )
                }
              />,
            );
          if (connectWalletStatus === WalletStatus.Connected)
            setModalContent(
              <DisplayContent
                size={size}
                logo={Astronaut}
                contentHeader="Lonnie Python"
                addressButton={
                  <CopyAddressButton
                    size={size}
                    address={getShuffledArr(chainList)[0].address}
                    isRound={true}
                  />
                }
                bottomButton={
                  <ConnectWalletButton
                    size={size}
                    leftIcon={<Icon as={ConnectWalletButtonConfig.Connected.leftIcon} />}
                    buttonText={ConnectWalletButtonConfig.Connected.text}
                  />
                }
              />,
            );
        }
        if (selectedWallet.mode === WalletMode.WalletConnect) {
          setModalContent(
            <QRCode
              link={selectedWallet.downloads[userBrowserInfo.device]}
              text="Use Wallet App to Scan this QRCode"
            />,
          );
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet, connectWalletStatus]);

  return (
    <Center mx="auto" py={16}>
      <Box w="full" maxW={48}>
        <ConnectWalletButton
          buttonText={
            connectWalletStatus !== WalletStatus.NotExist &&
            connectWalletStatus === WalletStatus.Connected &&
            "My Wallet"
          }
          onClickConnectBtn={modalOnOpen}
        />
      </Box>
      <ConnectModal
        initialRef={initialFocus}
        modalIsOpen={modalIsOpen}
        modalOnClose={handleClose}
        modalHead={modalHead}
        modalContent={modalContent}
      />
    </Center>
  );
});

storiesOf("Cosmology/wallet", module).add("SimpleConnectModal", () => {
  const getRandomAddress = getShuffledArr(chainList)[0].address;
  const walletStatus = select("wallet status", STATUS, STATUS.Connecting);

  const { isOpen: modalIsOpen, onOpen: modalOnOpen, onClose: modalOnClose } = useDisclosure();
  const initialFocus = useRef();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>();
  const [modalHead, setModalHead] = useState<ReactNode>();
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [userBrowserInfo, setUserBrowserInfo] = useState<UserDeviceInfoType | undefined>();

  function handleWalletClick(select: Wallet) {
    setSelectedWallet(select);
  }
  function handleBack() {
    setSelectedWallet(undefined);
  }
  function handleConnectButtonClick() {
    console.log("reconnect wallet"); //eslint-disable-line
  }

  useEffect(() => {
    setUserBrowserInfo({
      browser: Bowser.getParser(window.navigator.userAgent).getBrowserName(true),
      device: Bowser.getParser(window.navigator.userAgent).getPlatform().type,
      os: Bowser.getParser(window.navigator.userAgent).getOSName(true),
    });
  }, []);
  useEffect(() => {
    if (walletStatus === WalletStatus.Connected && userBrowserInfo) {
      return userBrowserInfo.device === "desktop"
        ? setSelectedWallet(WalletData[0])
        : setSelectedWallet(WalletData[1]);
    }
  }, [walletStatus, userBrowserInfo]);
  useEffect(() => {
    if (selectedWallet) {
      setModalHead(
        <SimpleModalHead
          title={selectedWallet.prettyName}
          backButton={true}
          handleBack={handleBack}
          handleClose={modalOnClose}
        />,
      );
      if (selectedWallet.mode === WalletMode.Extension) {
        if (walletStatus === STATUS.NotExist)
          setModalContent(
            <SimpleDisplayModalContent
              logo={selectedWallet.logo}
              status={DisplayModalContent.NotExist.logoStatus}
              contentHeader={`${selectedWallet.prettyName} ${DisplayModalContent.NotExist.header}`}
              contentDesc={`${DisplayModalContent.NotExist.desc} ${selectedWallet.prettyName} to connect your wallet`}
              bottomButton={
                <Link
                  href={
                    selectedWallet.downloads[userBrowserInfo.device].map(({ link }) => {
                      return link;
                    })[0]
                  }
                  _hover={{ textDecoration: "none" }}
                >
                  <SimpleInstallWalletButton
                    icon={
                      selectedWallet.downloads[userBrowserInfo.device].map(({ browser, os, icon }) => {
                        return browser === userBrowserInfo.browser || os === userBrowserInfo.os
                          ? icon
                          : GoDesktopDownload;
                      })[0]
                    }
                    text={`Install ${userBrowserInfo.device === "desktop" ? "Extension" : "App"}`}
                  />
                </Link>
              }
            />,
          );
        if (walletStatus !== STATUS.NotExist) {
          if (walletStatus !== STATUS.Connected)
            setModalContent(
              <SimpleDisplayModalContent
                status={DisplayModalContent[walletStatus].logoStatus}
                logo={selectedWallet.logo}
                contentHeader={DisplayModalContent[walletStatus].header}
                contentDesc={
                  walletStatus === STATUS.Connecting
                    ? `Open the ${selectedWallet.prettyName} ${
                        userBrowserInfo.device === "desktop" ? "Extension" : "App"
                      } to connect your wallet.`
                    : DisplayModalContent[walletStatus].desc
                }
                bottomButton={
                  walletStatus !== STATUS.Connecting && (
                    <Box px={6}>
                      <ConnectWalletButton
                        size="lg"
                        variant="primary"
                        buttonText={ConnectWalletButtonConfig[walletStatus].text}
                        onClickConnectBtn={handleConnectButtonClick}
                      />
                    </Box>
                  )
                }
              />,
            );
          if (walletStatus === STATUS.Connected)
            setModalContent(
              <SimpleDisplayModalContent
                logo={Astronaut}
                username="Lonnie Python"
                walletIcon={typeof selectedWallet.logo === "string" && selectedWallet.logo}
                addressButton={<CopyAddressButton size="sm" isRound={true} address={getRandomAddress} />}
                bottomButton={
                  <Box px={6}>
                    <ConnectWalletButton
                      size="lg"
                      variant="primary"
                      leftIcon={<Icon as={ConnectWalletButtonConfig[walletStatus].leftIcon} />}
                      buttonText={ConnectWalletButtonConfig[walletStatus].text}
                      onClickConnectBtn={handleConnectButtonClick}
                    />
                  </Box>
                }
              />,
            );
        }
      }
      if (selectedWallet.mode === WalletMode.WalletConnect) {
        setModalContent(
          <SimpleQRCode
            link={selectedWallet.downloads[userBrowserInfo.device]}
            description="Use Kepler App to Scan this QRCode"
          />,
        );
      }
    }
    if (!selectedWallet) {
      setModalHead(
        <SimpleModalHead
          title="Select a Wallet"
          backButton={false}
          handleBack={handleBack}
          handleClose={modalOnClose}
        />,
      );
      setModalContent(
        <SimpleDisplayWalletList
          initialFocus={initialFocus}
          walletsData={WalletData}
          handleClick={handleWalletClick}
        />,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletStatus, selectedWallet]);

  return (
    <Stack justifyContent="center" w="full" maxW="sm" mx="auto" p={16}>
      <Text fontSize="xl" textAlign="center">
        Wallet Status: {walletStatus}
      </Text>
      <Center>
        <Button onClick={modalOnOpen}>
          {walletStatus === WalletStatus.Connected ? "My Wallet" : "Connect Wallet"}
        </Button>
      </Center>
      <SimpleConnectModal
        initialRef={initialFocus}
        modalIsOpen={modalIsOpen}
        modalOnClose={modalOnClose}
        modalHead={modalHead}
        modalContent={modalContent}
      />
    </Stack>
  );
});

storiesOf("Cosmology/wallet", module).add("ConnectWalletCard", () => {
  const isConnect = boolean("connect wallet", false);
  const rejected = boolean("wallet rejected", false);
  const notExist = boolean("wallet not exist", false);
  const walletIcon = text(
    "wallet icon",
    "https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png",
  );
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getRandomAddress = getShuffledArr(chainList)[0].address;
    setAddress(getRandomAddress);
  }, []);
  useEffect(() => {
    setIsLoading(true);
    if (isConnect) {
      setButtonText("Disconnect");
      setUsername("Lonnie Python");
      setTimeout(() => setIsLoading(false), 500);
    }
    if (!isConnect) {
      setButtonText("Connect Wallet");
      setUsername("");
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [isConnect]);
  useEffect(() => {
    setIsDisabled(false);
    if (rejected) {
      setButtonText("Wallet Rejected");
      setAddress("");
      setIsDisabled(true);
    }
    if (notExist) {
      setButtonText("Wallet Not Exist");
      setAddress("");
      setIsDisabled(true);
    }
  }, [rejected, notExist]);

  return (
    <Container p={4}>
      <Box maxW="xs" mx="auto">
        <ConnectWalletCard
          userInfo={
            isConnect &&
            !rejected &&
            !notExist && (
              <SimpleAvatarWithName walletIcon={walletIcon} username={username} icon={<Astronaut />} />
            )
          }
          addressBtn={isConnect && address && <CopyAddressButton address={address} isRound={true} />}
          connectWalletButton={
            <ConnectWalletButton isLoading={isLoading} isDisabled={isDisabled} buttonText={buttonText} />
          }
        />
      </Box>
    </Container>
  );
});

storiesOf("Cosmology/wallet", module).add("ConnectedUserCard", () => {
  return (
    <Container w="full" maxW={60} p={4}>
      <ConnectedUserCard username="Lonnie Python" icon={<Astronaut />} />
    </Container>
  );
});

storiesOf("Cosmology/wallet", module).add("WarnCard", () => {
  const wordOfWarning = text(
    "word of warning",
    "Warning: There is not enough chain information to connect to this chain.",
  );

  return (
    <Center p={4}>
      <Box maxW="sm">
        <WarnBlock wordOfWarning={wordOfWarning} icon={<Icon as={FiAlertTriangle} mt={1} />} />
      </Box>
    </Center>
  );
});
