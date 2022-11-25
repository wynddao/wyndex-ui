import { PlacementWithLogical } from "@chakra-ui/react";
import { FaAndroid } from "react-icons/fa";
import { FiArrowLeft, FiX } from "react-icons/fi";
import { GrFirefox } from "react-icons/gr";
import {
  RiAppStoreFill,
  RiChromeFill,
  RiDoorOpenFill,
  RiDownload2Line,
  RiErrorWarningLine,
} from "react-icons/ri";
import { TbRefreshAlert } from "react-icons/tb";

import { LogoStatus, WalletMode } from "../../types";

export const ConnectWalletButtonConfig = {
  NotExist: {
    leftIcon: RiDownload2Line,
    text: "Install",
  },
  Connected: {
    leftIcon: RiDoorOpenFill,
    text: "Disconnect",
  },
  Connecting: {
    leftIcon: undefined,
    text: "Connecting...",
  },
  Rejected: {
    leftIcon: TbRefreshAlert,
    text: "Reconnect",
  },
  Error: {
    leftIcon: RiErrorWarningLine,
    text: "Change Wallet",
  },
};

export const WalletIcons = {
  keplr: "https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png",
  metamask: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
};

export const WalletData = [
  {
    name: "Keplr",
    prettyName: "Keplr Extension",
    logo: "https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png",
    mode: WalletMode.Extension,
    mobileDisabled: false,
    rejectMessage: "Request Rejected!",
    downloads: {
      desktop: [
        {
          browser: "chrome",
          icon: RiChromeFill,
          link: "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en",
        },
        {
          browser: "firefox",
          icon: GrFirefox,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      tablet: [
        {
          os: "android",
          icon: FaAndroid,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
        {
          os: "ios",
          icon: RiAppStoreFill,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      mobile: [
        {
          os: "android",
          icon: FaAndroid,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
        {
          os: "ios",
          icon: RiAppStoreFill,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      default: "https://www.keplr.app/download",
    },
  },
  {
    name: "WalletConnectKeplr",
    prettyName: "Keplr Mobile",
    logo: "https://user-images.githubusercontent.com/545047/191616515-eee176d0-9e50-4325-9529-6c0019d5c71a.png",
    mode: WalletMode.WalletConnect,
    mobileDisabled: false,
    rejectMessage: "Request Rejected!",
    downloads: {
      desktop: [
        {
          browser: "chrome",
          icon: RiChromeFill,
          link: "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en",
        },
        {
          browser: "firefox",
          icon: GrFirefox,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      tablet: [
        {
          os: "android",
          icon: FaAndroid,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
        {
          os: "ios",
          icon: RiAppStoreFill,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      mobile: [
        {
          os: "android",
          icon: FaAndroid,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
        {
          os: "ios",
          icon: RiAppStoreFill,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      default: "https://www.keplr.app/download",
    },
  },
  // {
  //   id: "meme",
  //   logo: "https://i.imgflip.com/jl9b3.jpg",
  //   displayName: "meme",
  //   modalHeader: "Scan with Phone",
  //   qrCodeLink: "https://cosmology.tech",
  // },
  // {
  //   id: "luctus",
  //   logo: "https://i.imgflip.com/7n3b1.jpg",
  //   displayName: "lesson meow",
  //   modalHeader: "gravida nisi at nibh in hac habitasse",
  //   qrCodeLink:
  //     "https://list-manage.com/justo.jsp?aliquam=et&convallis=ultrices&nunc=posuere&proin=cubilia&at=curae&turpis=mauris&a=viverra&pede=diam&posuere=vitae&nonummy=quam&integer=suspendisse&non=potenti&velit=nullam&donec=porttitor&diam=lacus&neque=at&vestibulum=turpis&eget=donec&vulputate=posuere&ut=metus&ultrices=vitae&vel=ipsum&augue=aliquam&vestibulum=non&ante=mauris&ipsum=morbi&primis=non&in=lectus&faucibus=aliquam&orci=sit&luctus=amet&et=diam&ultrices=in&posuere=magna&cubilia=bibendum&curae=imperdiet&donec=nullam&pharetra=orci&magna=pede&vestibulum=venenatis&aliquet=non&ultrices=sodales&erat=sed&tortor=tincidunt&sollicitudin=eu&mi=felis&sit=fusce&amet=posuere&lobortis=felis&sapien=sed&sapien=lacus&non=morbi&mi=sem&integer=mauris&ac=laoreet&neque=ut&duis=rhoncus&bibendum=aliquet&morbi=pulvinar&non=sed&quam=nisl&nec=nunc&dui=rhoncus&luctus=dui&rutrum=vel&nulla=sem&tellus=sed&in=sagittis&sagittis=nam&dui=congue&vel=risus&nisl=semper&duis=porta&ac=volutpat&nibh=quam&fusce=pede&lacus=lobortis&purus=ligula&aliquet=sit&at=amet&feugiat=eleifend&non=pede&pretium=libero&quis=quis&lectus=orci&suspendisse=nullam&potenti=molestie&in=nibh&eleifend=in&quam=lectus&a=pellentesque&odio=at&in=nulla&hac=suspendisse&habitasse=potenti&platea=cras",
  // },
  // {
  //   id: "sed",
  //   logo: "https://i.imgflip.com/imqvc.jpg",
  //   displayName: "hacker doge",
  //   modalHeader: "at turpis donec posuere",
  //   qrCodeLink:
  //     "http://stanford.edu/pellentesque/at/nulla/suspendisse/potenti/cras/in.aspx?tortor=pede&quis=justo&turpis=lacinia&sed=eget&ante=tincidunt&vivamus=eget&tortor=tempus&duis=vel&mattis=pede&egestas=morbi&metus=porttitor&aenean=lorem&fermentum=id&donec=ligula&ut=suspendisse&mauris=ornare&eget=consequat&massa=lectus&tempor=in&convallis=est&nulla=risus&neque=auctor&libero=sed&convallis=tristique&eget=in&eleifend=tempus&luctus=sit&ultricies=amet&eu=sem&nibh=fusce&quisque=consequat&id=nulla&justo=nisl&sit=nunc&amet=nisl&sapien=duis&dignissim=bibendum&vestibulum=felis&vestibulum=sed&ante=interdum&ipsum=venenatis&primis=turpis&in=enim&faucibus=blandit&orci=mi",
  // },
  // {
  //   id: "ante",
  //   logo: "https://i.imgflip.com/d5wxs.jpg",
  //   displayName: "shocked",
  //   modalHeader: "aliquet",
  //   qrCodeLink:
  //     "https://msu.edu/turpis/enim/blandit.jpg?id=aenean&mauris=sit&vulputate=amet&elementum=justo&nullam=morbi&varius=ut&nulla=odio&facilisi=cras&cras=mi&non=pede&velit=malesuada&nec=in&nisi=imperdiet&vulputate=et&nonummy=commodo&maecenas=vulputate&tincidunt=justo&lacus=in&at=blandit&velit=ultrices&vivamus=enim&vel=lorem&nulla=ipsum&eget=dolor&eros=sit&elementum=amet&pellentesque=consectetuer&quisque=adipiscing&porta=elit&volutpat=proin",
  // },
  // {
  //   id: "mauris",
  //   logo: "https://i.imgflip.com/chr5k.jpg",
  //   displayName: "doge",
  //   modalHeader: "nibh quisque id justo sit",
  //   qrCodeLink:
  //     "https://macromedia.com/mi/integer/ac/neque/duis/bibendum.html?lectus=convallis&suspendisse=duis&potenti=consequat&in=dui&eleifend=nec&quam=nisi&a=volutpat&odio=eleifend&in=donec&hac=ut&habitasse=dolor&platea=morbi&dictumst=vel&maecenas=lectus&ut=in&massa=quam&quis=fringilla&augue=rhoncus&luctus=mauris&tincidunt=enim&nulla=leo&mollis=rhoncus&molestie=sed&lorem=vestibulum&quisque=sit&ut=amet&erat=cursus&curabitur=id&gravida=turpis&nisi=integer&at=aliquet&nibh=massa&in=id&hac=lobortis&habitasse=convallis&platea=tortor&dictumst=risus&aliquam=dapibus",
  // },
  // {
  //   id: "aenean",
  //   logo: "https://i.imgflip.com/heoii.jpg",
  //   displayName: "selfie",
  //   modalHeader:
  //     "vestibulum ante ipsum primis in faucibus orci luctus et ultrices",
  //   qrCodeLink:
  //     "http://google.co.jp/amet/eros/suspendisse/accumsan/tortor/quis.xml?pede=nunc&libero=commodo&quis=placerat&orci=praesent&nullam=blandit&molestie=nam&nibh=nulla&in=integer&lectus=pede&pellentesque=justo&at=lacinia&nulla=eget&suspendisse=tincidunt&potenti=eget&cras=tempus&in=vel&purus=pede&eu=morbi&magna=porttitor&vulputate=lorem&luctus=id&cum=ligula&sociis=suspendisse&natoque=ornare&penatibus=consequat&et=lectus&magnis=in&dis=est&parturient=risus&montes=auctor&nascetur=sed&ridiculus=tristique&mus=in&vivamus=tempus&vestibulum=sit&sagittis=amet&sapien=sem&cum=fusce&sociis=consequat&natoque=nulla&penatibus=nisl&et=nunc&magnis=nisl&dis=duis&parturient=bibendum&montes=felis&nascetur=sed&ridiculus=interdum&mus=venenatis",
  // },
  // {
  //   id: "at",
  //   logo: "https://i.imgflip.com/n1zui.jpg",
  //   displayName: "smirking",
  //   modalHeader: "pellentesque ultrices mattis odio donec vitae nisi",
  //   qrCodeLink:
  //     "https://meetup.com/lobortis.aspx?ipsum=sit&primis=amet&in=sem&faucibus=fusce&orci=consequat&luctus=nulla&et=nisl&ultrices=nunc&posuere=nisl&cubilia=duis&curae=bibendum&duis=felis&faucibus=sed&accumsan=interdum&odio=venenatis&curabitur=turpis&convallis=enim&duis=blandit&consequat=mi&dui=in&nec=porttitor&nisi=pede&volutpat=justo&eleifend=eu&donec=massa&ut=donec&dolor=dapibus&morbi=duis&vel=at&lectus=velit&in=eu&quam=est&fringilla=congue&rhoncus=elementum&mauris=in&enim=hac&leo=habitasse&rhoncus=platea&sed=dictumst&vestibulum=morbi&sit=vestibulum&amet=velit&cursus=id&id=pretium&turpis=iaculis&integer=diam&aliquet=erat&massa=fermentum&id=justo&lobortis=nec&convallis=condimentum&tortor=neque&risus=sapien&dapibus=placerat&augue=ante&vel=nulla&accumsan=justo&tellus=aliquam&nisi=quis&eu=turpis&orci=eget&mauris=elit&lacinia=sodales&sapien=scelerisque&quis=mauris&libero=sit&nullam=amet&sit=eros",
  // },
  // {
  //   id: "proin",
  //   logo: "https://i.imgflip.com/1s0t4e.jpg",
  //   displayName: "O RLY",
  //   modalHeader: "lorem vitae",
  //   qrCodeLink:
  //     "http://moonfruit.com/sed/tincidunt.json?semper=nulla&rutrum=facilisi&nulla=cras&nunc=non&purus=velit&phasellus=nec&in=nisi&felis=vulputate&donec=nonummy&semper=maecenas&sapien=tincidunt&a=lacus&libero=at&nam=velit&dui=vivamus&proin=vel&leo=nulla&odio=eget&porttitor=eros&id=elementum&consequat=pellentesque&in=quisque&consequat=porta&ut=volutpat&nulla=erat&sed=quisque&accumsan=erat&felis=eros&ut=viverra&at=eget&dolor=congue&quis=eget&odio=semper&consequat=rutrum&varius=nulla&integer=nunc&ac=purus&leo=phasellus&pellentesque=in&ultrices=felis&mattis=donec&odio=semper&donec=sapien&vitae=a&nisi=libero&nam=nam&ultrices=dui&libero=proin&non=leo&mattis=odio&pulvinar=porttitor&nulla=id&pede=consequat&ullamcorper=in&augue=consequat&a=ut&suscipit=nulla&nulla=sed&elit=accumsan&ac=felis&nulla=ut&sed=at&vel=dolor&enim=quis&sit=odio&amet=consequat&nunc=varius&viverra=integer&dapibus=ac&nulla=leo&suscipit=pellentesque&ligula=ultrices&in=mattis&lacus=odio&curabitur=donec&at=vitae&ipsum=nisi&ac=nam",
  // },
  // {
  //   id: "mauris",
  //   logo: "http://dummyimage.com/200x200.png/cc0000/ffffff",
  //   displayName: "turpis integer aliquet",
  //   modalHeader: "convallis",
  //   qrCodeLink:
  //     "http://ifeng.com/nascetur/ridiculus/mus/etiam/vel/augue/vestibulum.aspx?diam=diam&in=cras&magna=pellentesque&bibendum=volutpat&imperdiet=dui&nullam=maecenas&orci=tristique&pede=est&venenatis=et&non=tempus&sodales=semper&sed=est&tincidunt=quam&eu=pharetra&felis=magna&fusce=ac&posuere=consequat&felis=metus&sed=sapien&lacus=ut&morbi=nunc&sem=vestibulum&mauris=ante&laoreet=ipsum&ut=primis&rhoncus=in&aliquet=faucibus&pulvinar=orci&sed=luctus&nisl=et&nunc=ultrices&rhoncus=posuere&dui=cubilia&vel=curae&sem=mauris&sed=viverra&sagittis=diam&nam=vitae&congue=quam&risus=suspendisse&semper=potenti&porta=nullam&volutpat=porttitor&quam=lacus&pede=at&lobortis=turpis&ligula=donec&sit=posuere&amet=metus&eleifend=vitae&pede=ipsum&libero=aliquam&quis=non&orci=mauris&nullam=morbi&molestie=non&nibh=lectus&in=aliquam&lectus=sit&pellentesque=amet&at=diam&nulla=in&suspendisse=magna",
  // },
  // {
  //   id: "velit",
  //   logo: "http://dummyimage.com/200x200.png/5fa2dd/ffffff",
  //   displayName: "quam suspendisse potenti",
  //   modalHeader: "pellentesque ultrices phasellus id",
  //   qrCodeLink:
  //     "http://nsw.gov.au/turpis/adipiscing/lorem.png?elit=vitae&proin=ipsum&risus=aliquam&praesent=non&lectus=mauris&vestibulum=morbi&quam=non&sapien=lectus&varius=aliquam&ut=sit&blandit=amet&non=diam&interdum=in&in=magna&ante=bibendum&vestibulum=imperdiet&ante=nullam&ipsum=orci&primis=pede&in=venenatis&faucibus=non",
  // },
  // {
  //   id: "id",
  //   logo: "http://dummyimage.com/200x200.png/5fa2dd/ffffff",
  //   displayName: "nascetur ridiculus mus",
  //   modalHeader: "id sapien in sapien iaculis congue",
  //   qrCodeLink:
  //     "http://domainmarket.com/odio/justo.json?orci=ac&luctus=est&et=lacinia&ultrices=nisi&posuere=venenatis&cubilia=tristique&curae=fusce&donec=congue&pharetra=diam&magna=id&vestibulum=ornare&aliquet=imperdiet&ultrices=sapien&erat=urna&tortor=pretium&sollicitudin=nisl&mi=ut&sit=volutpat&amet=sapien&lobortis=arcu&sapien=sed&sapien=augue&non=aliquam&mi=erat&integer=volutpat&ac=in&neque=congue&duis=etiam&bibendum=justo&morbi=etiam",
  // },
];

export const DisplayModalHead = {
  // ↓ for connect modal
  withInfo: {
    leftIcon: RiErrorWarningLine,
    rightIcon: FiX,
    header: "What is wallet?",
    content:
      "Wallet is a gateway to the Cosmos interchain world. By connecting your wallet to Cosmos, you have more accessibility to smart invest.",
    placement: "bottom" as PlacementWithLogical,
  },
  default: {
    leftIcon: FiArrowLeft,
    rightIcon: FiX,
  },
  connected: {
    leftIcon: undefined,
    rightIcon: FiX,
  },
};

export const DisplayModalContent = {
  NotExist: {
    logoStatus: LogoStatus.Warning,
    header: "Is Not Exist",
    desc: "Please install the",
  },
  Connecting: {
    logoStatus: LogoStatus.Loading,
    header: "Requesting Connection",
    desc: "Open the browser extension or app to connect your wallet.",
  },
  Rejected: {
    logoStatus: LogoStatus.Error,
    header: "Wallet Rejected",
    desc: "Connection authorization is denied.",
  },
  Error: {
    logoStatus: LogoStatus.Error,
    header: "Oops! something wrong...",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, quasi.",
  },
};
