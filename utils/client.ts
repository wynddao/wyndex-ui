import { CosmWasmClient } from "cosmwasm";

type ChainClientRoutes<T> = {
  [rpcEndpoint: string]: T;
};

type HandleConnect<T> = (rpcEndpoint: string) => Promise<T>;

class ChainClientRouter<T> {
  private readonly handleConnect: HandleConnect<T>;
  private instances: ChainClientRoutes<T> = {};

  constructor({ handleConnect }: { handleConnect: HandleConnect<T> }) {
    this.handleConnect = handleConnect;
  }

  /*
   * Connect to the chain and return the client
   * or return an existing instance of the client.
   *  */
  async connect(rpcEndpoint: string) {
    if (!this.getClientInstance(rpcEndpoint)) {
      const instance = await this.handleConnect(rpcEndpoint);
      this.setClientInstance(rpcEndpoint, instance);
    }

    return this.getClientInstance(rpcEndpoint);
  }

  private getClientInstance(rpcEndpoint: string) {
    return this.instances[rpcEndpoint];
  }

  private setClientInstance(rpcEndpoint: string, client: T) {
    this.instances[rpcEndpoint] = client;
  }
}

/*
 * Router for connecting to `CosmWasmClient`.
 *  */
export const cosmWasmClientRouter = new ChainClientRouter({
  handleConnect: (rpcEndpoint: string) => CosmWasmClient.connect(rpcEndpoint),
});
