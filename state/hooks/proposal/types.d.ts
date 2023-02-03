export interface IProposalModuleAdapterInitialOptions {
  coreAddress: string;
  Logo: ComponentType<LogoProps>;
  Loader: ComponentType<LoaderProps>;
}

export interface IProposalModuleAdapterCommonOptions extends IProposalModuleAdapterInitialOptions {
  proposalModule: ProposalModule;
}

export interface IProposalModuleAdapterOptions extends IProposalModuleAdapterInitialOptions {
  proposalModule: ProposalModule;
  proposalId: string;
  proposalNumber: number;
}

export interface IProposalModuleContext {
  id: string;
  options: IProposalModuleAdapterOptions;
  adapter: IProposalModuleAdapter;
  common: IProposalModuleAdapterCommon | undefined;
}

// Internal Adapter Types

export interface CommonProposalListInfo {
  id: string;
  proposalNumber: number;
  timestamp: Date | undefined;
  isOpen: boolean;
}

export interface CommonProposalInfo {
  id: number;
  title: string;
  description: string;
}

export interface BaseProposalVotesProps {
  className?: string;
}

export interface BaseProposalVoteDecisionStatusProps {
  voteConversionDecimals: number;
}

export interface BaseProposalInfoCardProps {
  connected: boolean;
  walletAddress?: string;
}

export interface BaseProposalDetailsProps {
  actions: Action[];
  onExecuteSuccess: () => void;
  onCloseSuccess: () => void;
  onVoteSuccess: () => void;
  connected: boolean;
  ConnectWalletButton: ComponentType;
  duplicate: (data: FormProposalData) => void;
  walletAddress?: string;
  VotingPowerWidget?: ComponentType<BaseProposalDetailsVotingPowerWidgetProps>;
}

export interface BaseProposalLineProps {
  className?: string;
}

export interface BaseProposalModuleInfo {
  className?: string;
}

export interface BaseCreateProposalFormProps {
  connected: boolean;
  walletAddress?: string;
  onCreateSuccess: (proposalId: string) => void;
  ConnectWalletButton: ComponentType;
}

export interface BasePinnedProposalLineProps {
  className?: string;
}
