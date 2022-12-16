export interface IndexerQueryClientReadOnlyInterface {
  apiUrl: string;
  pools: () => Promise<any>;
  userPools: (walletAddress: string) => Promise<any>;
}

export class IndexerQueryClient implements IndexerQueryClientReadOnlyInterface {
  apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.pools = this.pools.bind(this);
  }

  pools = async (): Promise<any> => {
    const res = await fetch(`${this.apiUrl}/pools`);
    return await res.json();
  };

  userPools = async (walletAddress: string): Promise<any> => {
    const res = await fetch(`${this.apiUrl}/pools/user/${walletAddress}`);
    return await res.json();
  };

  assetPrices = async (): Promise<any> => {
    const res = await fetch(`${this.apiUrl}/assets/prices`);
    return await res.json();
  };
}
