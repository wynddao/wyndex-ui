export type FunctionKeyOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export interface ProposalModule {
  contractName: string;
  address: string;
  prefix: string;
}
