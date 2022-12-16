export interface IndexerQueryClientReadOnlyInterface {
  apiUrl: string;
  pools: () => Promise<any>;
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
}
